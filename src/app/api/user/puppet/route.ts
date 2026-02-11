import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: NextRequest) {
  const { userId, personality } = await request.json();

  await kv.set(`user:${userId}:puppet`, {
    personality,
    generatedAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "demo_user";

  const puppet = await kv.get(`user:${userId}:puppet`);
  return NextResponse.json({ puppet });
}
