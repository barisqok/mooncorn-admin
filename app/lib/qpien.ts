const QPIEN_API_URL = "https://api.qpien.com/api/v1";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getQpienToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.QPIEN_CLIENT_ID;
  const clientSecret = process.env.QPIEN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("QPIEN_CLIENT_ID veya QPIEN_CLIENT_SECRET eksik");
  }

  const response = await fetch(QPIEN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "mutation GenerateOAuthToken($input: GenerateOAuthTokenInput!) { generateOAuthToken(input: $input) { success data { accessToken expiresIn } code message } }",
      variables: {
        input: {
          clientId: clientId,
          clientSecret: clientSecret,
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Auth HTTP hatasi: " + response.status + " - " + text.substring(0, 300));
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error("Auth GraphQL hatasi: " + JSON.stringify(result.errors).substring(0, 300));
  }

  const tokenData = result.data?.generateOAuthToken;
  if (!tokenData?.data?.accessToken) {
    throw new Error("Token alinamadi: " + JSON.stringify(result).substring(0, 300));
  }

  cachedToken = tokenData.data.accessToken;
  tokenExpiry = Date.now() + 55 * 60 * 1000;
  return cachedToken!;
}

export async function qpienQuery(query: string, variables: Record<string, unknown> = {}) {
  const token = await getQpienToken();
  const response = await fetch(QPIEN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("API hatasi: " + response.status + " - " + text.substring(0, 300));
  }
  const result = await response.json();
  if (result.errors) {
    throw new Error("GraphQL hatasi: " + (result.errors[0]?.message || JSON.stringify(result.errors)));
  }
  return result.data;
}

export async function getChannels() {
  return qpienQuery("query ExternalGetAllConnectedPlatformList { externalGetAllConnectedPlatformList { success data { _id name status channelId channelType senderEmailAddress } code message } }");
}

export async function getConversationList(page: number = 1, limit: number = 20) {
  return qpienQuery("query ExternalGetConversationList($page: Int, $limit: Int) { externalGetConversationList(page: $page, limit: $limit) { success data { docs { _id status priority lastMessage { content createdAt channelType senderType } tags { _id name color } } hasNextPage totalDocs } code message } }", { page, limit });
}

export async function getConversation(id: string) {
  return qpienQuery("query ExternalGetConversation($conversationId: ID!) { externalGetConversation(conversationId: $conversationId) { success data { _id status priority lastMessage { content createdAt channelType senderType } tags { _id name color } } code message } }", { conversationId: id });
}

export async function getMessageList(conversationId: string, page: number = 1, limit: number = 30) {
  return qpienQuery("query ExternalGetMessageList($conversationId: ID!, $page: Int, $limit: Int) { externalGetMessageList(conversationId: $conversationId, page: $page, limit: $limit) { success data { docs { _id content messageType channelType senderType createdAt } hasNextPage totalDocs } code message } }", { conversationId, page, limit });
}

export async function createMessage(conversationId: string, content: string) {
  return qpienQuery("mutation ExternalCreateMessage($conversationId: ID!, $content: String!) { externalCreateMessage(conversationId: $conversationId, content: $content) { success data { _id content createdAt } code message } }", { conversationId, content });
}

export async function getContactList(page: number = 1, limit: number = 20) {
  return qpienQuery("query ExternalGetContactList($page: Int, $limit: Int) { externalGetContactList(page: $page, limit: $limit) { success data { docs { _id name email phone } hasNextPage totalDocs } code message } }", { page, limit });
}
