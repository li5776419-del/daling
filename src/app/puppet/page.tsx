"use client";

import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

/* ------------------------------------------------------------------ */
/*  Concentric rings SVG                                               */
/* ------------------------------------------------------------------ */
function PuppetVisualization() {
  const rings = [
    { r: 140, opacity: 0.06, delay: "0s" },
    { r: 118, opacity: 0.10, delay: "0.3s" },
    { r: 96,  opacity: 0.16, delay: "0.6s" },
    { r: 74,  opacity: 0.24, delay: "0.9s" },
    { r: 52,  opacity: 0.35, delay: "1.2s" },
    { r: 30,  opacity: 0.50, delay: "1.5s" },
  ];

  return (
    <div className="puppet-container w-[320px] h-[320px] mx-auto">
      <svg viewBox="0 0 320 320" className="w-full h-full">
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {rings.map((ring, i) => (
          <circle
            key={i}
            cx="160" cy="160" r={ring.r}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="1.5"
            opacity={ring.opacity}
            className="animate-[breatheRing_4s_ease-in-out_infinite]"
            style={{ animationDelay: ring.delay }}
          />
        ))}

        <circle cx="160" cy="160" r="50" fill="url(#core-glow)" className="animate-[breatheCore_3s_ease-in-out_infinite]" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <PuppetAvatar seed="my-puppet-main" size={100} personality="deep" className="puppet-glow" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */
function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-[#13111a] text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-sm font-semibold tracking-wide text-white/70">灵偶碎片仓库</h2>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/30">
            灵
          </div>
          <div>
            <p className="text-sm font-medium">我的灵偶</p>
            <p className="text-xs text-white/40">内敛厚重</p>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/8" />

      <div className="px-4 py-4 flex-1">
        <p className="text-xs text-white/40 mb-3 px-1">当前激活</p>
        <div className="rounded-xl bg-purple-500/15 border border-purple-500/25 p-3 space-y-3">
          <div className="flex items-center gap-3">
            <PuppetAvatar seed="my-puppet-main" size={40} personality="deep" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">主灵偶</p>
              <p className="text-xs text-purple-300/60">深度型 · 活跃</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5 px-2.5 py-1.5 text-center">
              <p className="text-xs text-white/35">碎片</p>
              <p className="text-sm font-semibold text-purple-300">128</p>
            </div>
            <div className="rounded-lg bg-white/5 px-2.5 py-1.5 text-center">
              <p className="text-xs text-white/35">演化</p>
              <p className="text-sm font-semibold text-purple-300">Lv.3</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-white/10 p-3 flex items-center justify-center">
          <button className="text-xs text-white/30 hover:text-white/50 transition-colors flex items-center gap-1.5 cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            创建新灵偶
          </button>
        </div>
      </div>

      <div className="px-4 pb-5">
        <a href="/chat" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs">返回对话</span>
        </a>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function PuppetPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 page-bg relative overflow-y-auto">
        <div className="absolute top-10 right-20 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-8 py-12 page-transition">
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl font-bold gradient-text">你的灵偶已诞生</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              这是基于你的数据，在数字世界生成的专属化身
            </p>
          </div>

          <div className="mb-6">
            <PuppetVisualization />
          </div>

          <p className="text-center text-sm text-text-secondary mb-10">
            人格风格：<span className="text-primary font-semibold">内敛厚重</span>
          </p>

          <div className="space-y-4">
            {/* 灵偶自述 */}
            <div className="card">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full gradient-primary inline-block" />
                灵偶自述
              </h3>
              <blockquote className="text-sm text-text-secondary leading-relaxed pl-4 border-l-2 border-primary/20 italic">
                &ldquo;我习惯在沉默中观察世界，在阅读中寻找答案。比起热闹的聚会，更享受一个人的深度思考。
                我相信真正的连接不在于话多，而在于每一句话都掷地有声。&rdquo;
              </blockquote>
            </div>

            {/* 核心特质 */}
            <div className="card">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full gradient-primary inline-block" />
                核心特质
              </h3>
              <div className="flex flex-wrap gap-2">
                {["#思想深渊", "#内敛静谧", "#文化学者", "#逻辑严谨"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>

            {/* 价值观共鸣 */}
            <div className="card">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full gradient-primary inline-block" />
                价值观共鸣
              </h3>
              <div className="flex flex-wrap gap-2">
                {["智慧的积淀", "精神的自由", "深度的共鸣"].map((value) => (
                  <span key={value} className="tag">{value}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center space-y-3 pb-8">
            <button
              onClick={() => router.push("/preference")}
              className="btn-primary w-full text-base"
            >
              赋予它使命
            </button>
            <p className="text-xs text-text-secondary">
              灵偶形态会随你的真实成长与互动而持续演化
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
