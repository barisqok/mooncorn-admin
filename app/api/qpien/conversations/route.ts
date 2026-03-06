import { NextResponse } from "next/server";
import { qpienFetch } from "../../lib/qpien";

export async function GET() {
  try {
    const data = await qpienFetch("/conversations?limit=50&sort=-updatedAt");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Conversations hatası:", message);
    return NextResponse.json(
      { error: message, conversations: [] },
      { status: 500 }
    );
  }
}
