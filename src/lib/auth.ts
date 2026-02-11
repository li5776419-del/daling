import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "daling_session";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
  });

  if (!user) return null;

  if (new Date() > user.tokenExpiresAt) {
    try {
      const refreshed = await refreshToken(user.refreshToken);
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          tokenExpiresAt: new Date(Date.now() + refreshed.expiresIn * 1000),
        },
      });
      return updated;
    } catch {
      return null;
    }
  }

  return user;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

async function refreshToken(refreshTokenValue: string) {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshTokenValue,
    client_id: process.env.SECONDME_CLIENT_ID!,
    client_secret: process.env.SECONDME_CLIENT_SECRET!,
  });

  const res = await fetch(process.env.SECONDME_TOKEN_REFRESH_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return res.json() as Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}
