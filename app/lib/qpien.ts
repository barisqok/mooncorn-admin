// Qpien GraphQL API Helper
// API URL: https://api.qpien.com/api/v1
// Auth: generateOAuthToken mutation → Bearer token (1 hour)

const QPIEN_API_URL = "https://api.qpien.com/api/v1";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// ============================================
// AUTH: Get OAuth Token
// ============================================
export async function getQpienToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.QPIEN_CLIENT_ID;
  const clientSecret = process.env.QPIEN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("QPIEN_CLIENT_ID veya QPIEN_CLIENT_SECRET tanımlanmamış");
  }

  const query = `
    mutation GenerateOAuthToken($clientId: String!, $clientSecret: String!) {
      generateOAuthToken(clientId: $clientId, clientSecret: $clientSecret) {
        success
        data {
          accessToken
        }
        code
        message
      }
    }
  `;

  const response = await fetch(QPIEN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { clientId, clientSecret },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qpien auth HTTP hatası: ${response.status} - ${text.substring(0, 200)}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Qpien auth GraphQL hatası: ${JSON.stringify(result.errors)}`);
  }

  const tokenData = result.data?.generateOAuthToken;
  if (!tokenData?.success || !tokenData?.data?.accessToken) {
    throw new Error(`Qpien token alınamadı: ${tokenData?.message || "Bilinmeyen hata"}`);
  }

  cachedToken = tokenData.data.accessToken;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 dakika (5 dk güvenlik payı)

  return cachedToken!;
}

// ============================================
// GRAPHQL HELPER
// ============================================
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
    throw new Error(`Qpien API HTTP hatası: ${response.status} - ${text.substring(0, 200)}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error("Qpien GraphQL Errors:", result.errors);
    throw new Error(`Qpien GraphQL hatası: ${result.errors[0]?.message || "Bilinmeyen hata"}`);
  }

  return result.data;
}

// ============================================
// CONVERSATIONS
// ============================================
export async function getConversationList(page: number = 1, limit: number = 20) {
  const query = `
    query ExternalGetConversationList($page: Int, $limit: Int) {
      externalGetConversationList(page: $page, limit: $limit) {
        success
        data {
          docs {
            _id
            customer
            status
            isStarred
            priority
            type
            lastMessage {
              content
              createdAt
              channelType
              senderType
            }
            tags {
              _id
              name
              color
            }
            channels {
              _id
              name
              type
            }
            joinedPerson
            joinedCPerson
            createdAt
            updatedAt
          }
          hasNextPage
          totalDocs
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query, { page, limit });
}

export async function getConversation(conversationId: string) {
  const query = `
    query ExternalGetConversation($conversationId: ID!) {
      externalGetConversation(conversationId: $conversationId) {
        success
        data {
          _id
          customer
          status
          isStarred
          priority
          type
          lastMessage {
            content
            createdAt
            channelType
            senderType
          }
          tags {
            _id
            name
            color
          }
          channels {
            _id
            name
            type
          }
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query, { conversationId });
}

// ============================================
// MESSAGES
// ============================================
export async function getMessageList(conversationId: string, page: number = 1, limit: number = 30) {
  const query = `
    query ExternalGetMessageList($conversationId: ID!, $page: Int, $limit: Int) {
      externalGetMessageList(conversationId: $conversationId, page: $page, limit: $limit) {
        success
        data {
          docs {
            _id
            content
            contentHtml
            messageType
            channelType
            senderType
            sender {
              name
              avatar
            }
            media {
              url
              type
            }
            createdAt
            ackStatus
          }
          hasNextPage
          totalDocs
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query, { conversationId, page, limit });
}

export async function createMessage(conversationId: string, content: string) {
  const query = `
    mutation ExternalCreateMessage($conversationId: ID!, $content: String!) {
      externalCreateMessage(conversationId: $conversationId, content: $content) {
        success
        data {
          _id
          content
          createdAt
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query, { conversationId, content });
}

// ============================================
// CHANNELS
// ============================================
export async function getChannels() {
  const query = `
    query ExternalGetChannels {
      externalGetChannels {
        success
        data {
          _id
          name
          type
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query);
}

// ============================================
// CONTACTS
// ============================================
export async function getContactList(page: number = 1, limit: number = 20) {
  const query = `
    query ExternalGetContactList($page: Int, $limit: Int) {
      externalGetContactList(page: $page, limit: $limit) {
        success
        data {
          docs {
            _id
            name
            email
            phone
          }
          hasNextPage
          totalDocs
        }
        code
        message
      }
    }
  `;
  return qpienQuery(query, { page, limit });
}
