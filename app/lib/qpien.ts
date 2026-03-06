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
    throw new Error("QPIEN_CLIENT_ID veya QPIEN_CLIENT_SECRET tanımlanmamış");
  }

  const response = await fetch(QPIEN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation { generateOAuthToken(clientId: "${clientId}", clientSecret: "${clientSecret}") { accessToken expiresIn } }`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qpien auth HTTP hatası: ${response.status} - ${text.substring(0, 200)}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Qpien auth hatası: ${JSON.stringify(result.errors)}`);
  }

  const tokenData = result.data?.generateOAuthToken;
  if (!tokenData?.accessToken) {
    throw new Error(`Token alınamadı: ${JSON.stringify(result)}`);
  }

  cachedToken = tokenData.accessToken;
  tokenExpiry = Date.now() + 55 * 60 * 1000;
  return cachedToken!;
}

export async function qpienQuery(query: string, variables: Record<string, unknown> = {}) {
  const token = await getQpienToken();

  const response = await fetch(QPIEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qpien API hatası: ${response.status} - ${text.substring(0, 200)}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL hatası: ${result.errors[0]?.message || JSON.stringify(result.errors)}`);
  }
  return result.data;
}

export async function getConversationList(page: number = 1, limit: number = 20) {
  return qpienQuery(`query { externalGetConversationList(page: ${page}, limit: ${limit}) { success data { docs { _id status priority lastMessage { content createdAt channelType senderType } tags { _id name color } channels { _id name type } } hasNextPage totalDocs } code message } }`);
}

export async function getConversation(conversationId: string) {
  return qpienQuery(`query { externalGetConversation(conversationId: "${conversationId}") { success data { _id status priority lastMessage { content createdAt channelType senderType } tags { _id name color } channels { _id name type } } code message } }`);
}

export async function getMessageList(conversationId: string, page: number = 1, limit: number = 30) {
  return qpienQuery(`query { externalGetMessageList(conversationId: "${conversationId}", page: ${page}, limit: ${limit}) { success data { docs { _id content messageType channelType senderType createdAt } hasNextPage totalDocs } code message } }`);
}

export async function createMessage(conversationId: string, content: string) {
  return qpienQuery(`mutation { externalCreateMessage(conversationId: "${conversationId}", content: "${content}") { success data { _id content createdAt } code message } }`);
}

export async function getChannels() {
  return qpienQuery(`query { externalGetChannels { success data { _id name type } code message } }`);
}

export async function getContactList(page: number = 1, limit: number = 20) {
  return qpienQuery(`query { externalGetContactList(page: ${page}, limit: ${limit}) { success data { docs { _id name email phone } hasNextPage totalDocs } code message } }`);
}
