import { NextRequest } from "next/server";
import { getAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return new Response(JSON.stringify({ code: 401, message: "未登录" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();

  const res = await fetch(
    `${process.env.SECONDME_API_BASE_URL}/api/secondme/chat/stream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok || !res.body) {
    return new Response(JSON.stringify({ code: res.status, message: "请求失败" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
