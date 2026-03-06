import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.QPIEN_CLIENT_ID || "";
  const clientSecret = process.env.QPIEN_CLIENT_SECRET || "";

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      clientId: clientId ? `✅ ${clientId.substring(0, 8)}...` : "❌ Eksik",
      clientSecret: clientSecret ? `✅ ${clientSecret.substring(0, 8)}...` : "❌ Eksik",
    },
    tests: {} as Record<string, unknown>,
  };

  const tests = results.tests as Record<string, unknown>;

  // Test 1: OAuth token - api.qpien.com/oauth/token
  try {
    const r = await fetch("https://api.qpien.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
    });
    const text = await r.text();
    tests["POST api.qpien.com/oauth/token"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["POST api.qpien.com/oauth/token"] = { error: String(e) };
  }

  // Test 2: OAuth token - api.qpien.com/auth/token
  try {
    const r = await fetch("https://api.qpien.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
    });
    const text = await r.text();
    tests["POST api.qpien.com/auth/token"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["POST api.qpien.com/auth/token"] = { error: String(e) };
  }

  // Test 3: OAuth token - api.qpien.com/v1/auth/token
  try {
    const r = await fetch("https://api.qpien.com/v1/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
    });
    const text = await r.text();
    tests["POST api.qpien.com/v1/auth/token"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["POST api.qpien.com/v1/auth/token"] = { error: String(e) };
  }

  // Test 4: Bearer token with client_secret directly
  try {
    const r = await fetch("https://api.qpien.com/v1/conversations", {
      headers: { Authorization: `Bearer ${clientSecret}` },
    });
    const text = await r.text();
    tests["GET v1/conversations (Bearer secret)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET v1/conversations (Bearer secret)"] = { error: String(e) };
  }

  // Test 5: Bearer token with client_id directly
  try {
    const r = await fetch("https://api.qpien.com/v1/conversations", {
      headers: { Authorization: `Bearer ${clientId}` },
    });
    const text = await r.text();
    tests["GET v1/conversations (Bearer clientId)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET v1/conversations (Bearer clientId)"] = { error: String(e) };
  }

  // Test 6: Basic Auth
  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const r = await fetch("https://api.qpien.com/v1/conversations", {
      headers: { Authorization: `Basic ${basic}` },
    });
    const text = await r.text();
    tests["GET v1/conversations (Basic auth)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET v1/conversations (Basic auth)"] = { error: String(e) };
  }

  // Test 7: X-API-Key header
  try {
    const r = await fetch("https://api.qpien.com/v1/conversations", {
      headers: { "X-API-Key": clientSecret },
    });
    const text = await r.text();
    tests["GET v1/conversations (X-API-Key)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET v1/conversations (X-API-Key)"] = { error: String(e) };
  }

  // Test 8: Try without /v1
  try {
    const r = await fetch("https://api.qpien.com/conversations", {
      headers: { Authorization: `Bearer ${clientSecret}` },
    });
    const text = await r.text();
    tests["GET /conversations (Bearer secret)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET /conversations (Bearer secret)"] = { error: String(e) };
  }

  // Test 9: app.qpien.com/api endpoint
  try {
    const r = await fetch("https://app.qpien.com/api/v1/conversations", {
      headers: { Authorization: `Bearer ${clientSecret}` },
    });
    const text = await r.text();
    tests["GET app.qpien.com/api/v1/conversations"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["GET app.qpien.com/api/v1/conversations"] = { error: String(e) };
  }

  // Test 10: OAuth with form-urlencoded
  try {
    const r = await fetch("https://api.qpien.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
    });
    const text = await r.text();
    tests["POST oauth/token (form-urlencoded)"] = { status: r.status, body: text.substring(0, 300) };
  } catch (e: unknown) {
    tests["POST oauth/token (form-urlencoded)"] = { error: String(e) };
  }

  return NextResponse.json(results, { status: 200 });
}
