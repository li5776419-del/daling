import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // Exchange code for tokens
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SECONDME_REDIRECT_URI!,
      client_id: process.env.SECONDME_CLIENT_ID!,
      client_secret: process.env.SECONDME_CLIENT_SECRET!,
    });

    const tokenRes = await fetch(process.env.SECONDME_TOKEN_ENDPOINT!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/?error=token_failed", request.url));
    }

    const tokenData = await tokenRes.json();
    const { accessToken, refreshToken, expiresIn } = tokenData;

    // Get user info from SecondMe
    const userRes = await fetch(
      `${process.env.SECONDME_API_BASE_URL}/api/secondme/user/info`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const userResult = await userRes.json();
    let secondmeUserId = "unknown";
    let name = null;
    let email = null;
    let avatarUrl = null;

    if (userResult.code === 0 && userResult.data) {
      secondmeUserId = String(userResult.data.userId || userResult.data.route || "unknown");
      name = userResult.data.name || null;
      email = userResult.data.email || null;
      avatarUrl = userResult.data.avatar || null;
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { secondmeUserId },
      update: {
        name,
        email,
        avatarUrl,
        accessToken,
        refreshToken,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
      },
      create: {
        secondmeUserId,
        name,
        email,
        avatarUrl,
        accessToken,
        refreshToken,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });

    await setSession(user.id);
    return NextResponse.redirect(new URL("/chat", request.url));
  } catch {
    return NextResponse.redirect(new URL("/?error=callback_failed", request.url));
  }
}
