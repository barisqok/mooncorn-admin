import { NextResponse } from "next/server";
import { qpienFetch } from "../../lib/qpien";

export async function GET() {
  try {
    const data = await qpienFetch("/channels");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Channels hatası:", message);
    return NextResponse.json(
      { error: message, channels: [] },
      { status: 500 }
    );
  }
}
