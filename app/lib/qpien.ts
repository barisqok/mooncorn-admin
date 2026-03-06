// Qpien API Helper
// OAuth2 client credentials flow

const QPIEN_BASE_URL = "https://api.qpien.com/api/v1";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getQpienToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.QPIEN_CLIENT_ID;
  const clientSecret = process.env.QPIEN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("QPIEN_CLIENT_ID veya QPIEN_CLIENT_SECRET tanımlanmamış");
  }

  const response = await fetch("https://api.qpien.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qpien auth hatası: ${response.status} - ${errorText}`);
  }

  const data: TokenResponse = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 1 dk erken expire et

  return cachedToken;
}

export async function qpienFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getQpienToken();

  const response = await fetch(`${QPIEN_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Qpien API Hatası [${endpoint}]:`, response.status, errorText);
    throw new Error(`Qpien API hatası: ${response.status}`);
  }

  return response.json();
}
