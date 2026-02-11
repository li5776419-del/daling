import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth";

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.SECONDME_API_BASE_URL}/api/secondme/user/info`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
