import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ChatWindow from "@/components/ChatWindow";
import Link from "next/link";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="h-screen flex flex-col page-bg">
      {/* Top navigation */}
      <div className="glass flex items-center justify-between px-4 py-2 z-10">
        <Link href="/profile" className="nav-button">
          {session.avatarUrl ? (
            <img
              src={session.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full ring-2 ring-purple-300"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: "var(--gradient-main)" }}
            >
              {session.name?.[0] || "?"}
            </div>
          )}
        </Link>
        <h1 className="text-sm font-semibold gradient-text">搭灵Darling</h1>
        <Link href="/" className="nav-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatWindow initialIntimacy={session.intimacyScore} />
      </div>
    </div>
  );
}
