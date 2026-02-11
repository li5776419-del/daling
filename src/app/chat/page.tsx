import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ChatWindow from "@/components/ChatWindow";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="h-screen flex flex-col gradient-bg">
      {/* Top navigation */}
      <div className="flex items-center justify-between px-4 py-2 z-10">
        <a href="/profile" className="p-2 rounded-full hover:bg-white/40 transition-colors">
          {session.avatarUrl ? (
            <img
              src={session.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-semibold">
              {session.name?.[0] || "?"}
            </div>
          )}
        </a>
        <h1 className="text-sm font-medium text-foreground">搭灵Darling</h1>
        <div className="w-8" />
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatWindow initialIntimacy={session.intimacyScore} />
      </div>
    </div>
  );
}
