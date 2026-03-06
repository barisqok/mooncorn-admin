import { NextResponse } from "next/server";
import { qpienFetch } from "../../../lib/qpien";

export async function GET() {
  try {
    const data = await qpienFetch("/contacts?limit=50");
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Contacts hatası:", message);
    return NextResponse.json(
      { error: message, contacts: [] },
      { status: 500 }
    );
  }
}
