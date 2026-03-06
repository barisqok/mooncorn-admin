import { NextResponse } from "next/server";
import { getChannels } from "../../../lib/qpien";

export async function GET() {
  try {
    const data = await getChannels();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
