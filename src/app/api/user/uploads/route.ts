import { NextRequest, NextResponse } from "next/server";
import { getUserUploads, saveUserUpload } from "@/lib/kv";

// Temporary fixed userId — will be replaced with SecondMe OAuth session
const DEMO_USER_ID = "demo_user";

export async function GET() {
  const uploads = await getUserUploads(DEMO_USER_ID);
  return NextResponse.json({ uploads });
}

export async function POST(request: NextRequest) {
  const upload = await request.json();
  const userData = await saveUserUpload(DEMO_USER_ID, upload);
  return NextResponse.json({ success: true, userData });
}
