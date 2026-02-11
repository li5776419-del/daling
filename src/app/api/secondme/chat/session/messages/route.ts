import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ code: 400, message: "缺少 sessionId" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.SECONDME_API_BASE_URL}/api/secondme/chat/session/messages?sessionId=${sessionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
