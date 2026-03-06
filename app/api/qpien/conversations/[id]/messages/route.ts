import { NextRequest, NextResponse } from "next/server";
import { qpienFetch } from "../../../../../lib/qpien";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await qpienFetch(`/conversations/${id}/messages?limit=50`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Messages hatası:", message);
    return NextResponse.json(
      { error: message, messages: [] },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await qpienFetch(`/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Send message hatası:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
