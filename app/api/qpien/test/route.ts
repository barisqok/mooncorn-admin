import { NextResponse } from "next/server";
import { getQpienToken, qpienFetch } from "../../../lib/qpien";

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env_check: {
      QPIEN_CLIENT_ID: process.env.QPIEN_CLIENT_ID ? "✅ Tanımlı" : "❌ Eksik",
      QPIEN_CLIENT_SECRET: process.env.QPIEN_CLIENT_SECRET ? "✅ Tanımlı" : "❌ Eksik",
    },
    auth: "⏳ Test ediliyor...",
    channels: "⏳ Test ediliyor...",
    conversations: "⏳ Test ediliyor...",
  };

  // Test Auth
  try {
    const token = await getQpienToken();
    results.auth = token ? "✅ Token alındı" : "❌ Token boş";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    results.auth = `❌ Hata: ${message}`;
    return NextResponse.json(results);
  }

  // Test Channels
  try {
    const channels = await qpienFetch("/channels");
    results.channels = `✅ ${JSON.stringify(channels).substring(0, 200)}`;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    results.channels = `❌ Hata: ${message}`;
  }

  // Test Conversations
  try {
    const convos = await qpienFetch("/conversations?limit=3");
    results.conversations = `✅ ${JSON.stringify(convos).substring(0, 200)}`;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    results.conversations = `❌ Hata: ${message}`;
  }

  return NextResponse.json(results, { status: 200 });
}
