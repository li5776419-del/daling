import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import UserProfile from "@/components/UserProfile";
import NoteForm from "@/components/NoteForm";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="page-bg min-h-screen">
      {/* Header */}
      <div className="glass px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link
          href="/chat"
          className="nav-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold gradient-text">个人资料</h1>
        <LogoutButton />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <div className="card">
          <UserProfile />
        </div>

        {/* Note section */}
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold gradient-text">
            教 TA 认识你
          </h3>
          <p className="text-xs text-gray-500">
            分享你的喜好和习惯，让 AI 更懂你
          </p>
          <NoteForm />
        </div>
      </div>
    </div>
  );
}
