import { NextResponse } from "next/server";
import { getQpienToken, getConversationList, getChannels } from "../../../lib/qpien";

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      QPIEN_CLIENT_ID: process.env.QPIEN_CLIENT_ID ? "✅ Tanımlı" : "❌ Eksik",
      QPIEN_CLIENT_SECRET: process.env.QPIEN_CLIENT_SECRET ? "✅ Tanımlı" : "❌ Eksik",
    },
    auth: "⏳ Test ediliyor...",
    channels: "⏳ Test ediliyor...",
    conversations: "⏳ Test ediliyor...",
  };

  // Test 1: Auth
  try {
    const token = await getQpienToken();
    results.auth = `✅ Token alındı (${token.substring(0, 20)}...)`;
  } catch (error: unknown) {
    results.auth = `❌ ${error instanceof Error ? error.message : String(error)}`;
    return NextResponse.json(results);
  }

  // Test 2: Channels
  try {
    const data = await getChannels();
    results.channels = { status: "✅ Başarılı", data };
  } catch (error: unknown) {
    results.channels = `❌ ${error instanceof Error ? error.message : String(error)}`;
  }

  // Test 3: Conversations
  try {
    const data = await getConversationList(1, 3);
    results.conversations = { status: "✅ Başarılı", data };
  } catch (error: unknown) {
    results.conversations = `❌ ${error instanceof Error ? error.message : String(error)}`;
  }

  return NextResponse.json(results);
}
