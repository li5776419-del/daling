import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  const session = await getSession();
  if (!token || !session) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(
    `${process.env.SECONDME_API_BASE_URL}/api/secondme/note/add`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: body.content,
        title: body.title,
        memoryType: "TEXT",
      }),
    }
  );

  const data = await res.json();

  if (data.code === 0) {
    await prisma.note.create({
      data: {
        userId: session.id,
        content: body.content,
        noteId: data.data?.noteId,
      },
    });
  }

  return NextResponse.json(data);
}
