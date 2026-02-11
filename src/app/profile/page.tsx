import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import UserProfile from "@/components/UserProfile";
import NoteForm from "@/components/NoteForm";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="glass px-4 py-3 flex items-center justify-between">
        <a
          href="/chat"
          className="p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </a>
        <h1 className="text-sm font-medium">个人资料</h1>
        <LogoutButton />
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile card */}
        <div className="glass rounded-2xl p-5">
          <UserProfile />
        </div>

        {/* Note section */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-text-secondary">
            教 TA 认识你
          </h3>
          <p className="text-xs text-text-secondary/70">
            分享你的喜好和习惯，让 AI 更懂你
          </p>
          <NoteForm />
        </div>
      </div>
    </div>
  );
}
