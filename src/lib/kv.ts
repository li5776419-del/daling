import { kv } from "@vercel/kv";

interface UserData {
  uploads: Record<string, unknown>[];
  [key: string]: unknown;
}

export async function getUserData(userId: string): Promise<UserData | null> {
  return await kv.get<UserData>(`user:${userId}`);
}

export async function saveUserUpload(
  userId: string,
  upload: Record<string, unknown>
): Promise<UserData> {
  const userData: UserData = (await getUserData(userId)) || { uploads: [] };
  userData.uploads.push(upload);
  await kv.set(`user:${userId}`, userData);
  return userData;
}

export async function getUserUploads(
  userId: string
): Promise<Record<string, unknown>[]> {
  const userData = await getUserData(userId);
  return userData?.uploads || [];
}
