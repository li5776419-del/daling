"use client";

import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

export default function UnlockSuccessPage() {
  const router = useRouter();

  return (
    <div className="page-bg relative overflow-hidden flex flex-col">
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-8 page-transition">
          {/* Success icon + avatars */}
          <div className="flex items-center justify-center gap-4">
            <PuppetAvatar seed="me-center" size={64} personality="emotional" />
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <PuppetAvatar seed="dreamer-x1" size={64} personality="deep" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">连接已建立</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              你与虚像筑梦师的真实联系方式已解锁
            </p>
          </div>

          {/* Contact card */}
          <div className="card text-left space-y-4">
            <div className="flex items-center gap-3">
              <PuppetAvatar seed="dreamer-x1" size={44} personality="deep" />
              <div>
                <p className="text-sm font-semibold text-foreground">虚像筑梦师</p>
                <p className="text-xs text-text-secondary">深度型 · Lv.7</p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">微信号</span>
                <span className="text-sm font-medium text-foreground font-mono">dreamweaver_2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">破冰建议</span>
                <span className="text-sm text-foreground">&ldquo;聊聊你最近读的那本书？&rdquo;</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/soul-dialogue")}
              className="btn-primary w-full text-sm"
            >
              继续灵魂对话
            </button>
            <button
              onClick={() => router.push("/resonance")}
              className="btn-secondary w-full text-sm"
            >
              查看其他匹配
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
