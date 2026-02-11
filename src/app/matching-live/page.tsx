"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

const satellites = [
  { id: 1, name: "虚像筑梦师", seed: "dreamer-x1", personality: "deep" as const, angle: 0 },
  { id: 2, name: "极光捕手", seed: "aurora-h2", personality: "emotional" as const, angle: 72 },
  { id: 3, name: "离散比特", seed: "bit-d3", personality: "rational" as const, angle: 144 },
  { id: 4, name: "量子絮语", seed: "quantum-q4", personality: "humorous" as const, angle: 216 },
  { id: 5, name: "星尘拾荒", seed: "stardust-s5", personality: "deep" as const, angle: 288 },
];

const stats = [
  { label: "同步密度", value: "100", unit: "%" },
  { label: "并发线程", value: "5", unit: "X" },
  { label: "共鸣深度", value: "4.2", unit: "M" },
];

export default function MatchingLivePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [activePulse, setActivePulse] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);

  // Progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setSyncComplete(true);
          return 100;
        }
        return p + 0.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Pulse rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((p) => (p + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/8 rounded-full blur-[100px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Top status bar */}
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <a href="/preference" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400/50" />
            <span className="text-[11px] tracking-[0.2em] text-green-400/80 font-mono uppercase">
              Concurrent Soul Sync Active
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Title */}
        <div className="text-center mt-4 mb-2 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">并发多维人格对撞</h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            灵偶正在同时与 5 个潜在灵魂进行高频交互，实时筛选最佳契合度
          </p>
        </div>

        {/* Orbital visualization */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="relative w-[360px] h-[360px]">
            {/* Orbit rings */}
            {[140, 110, 80].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/[0.04]"
                style={{
                  width: r * 2,
                  height: r * 2,
                  top: `calc(50% - ${r}px)`,
                  left: `calc(50% - ${r}px)`,
                }}
              />
            ))}

            {/* Connection lines (animated) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
              {satellites.map((sat, i) => {
                const rad = ((sat.angle + progress * 0.3) * Math.PI) / 180;
                const x = 180 + Math.cos(rad) * 130;
                const y = 180 + Math.sin(rad) * 130;
                return (
                  <line
                    key={sat.id}
                    x1="180" y1="180" x2={x} y2={y}
                    stroke={activePulse === i ? "rgba(167,139,250,0.4)" : "rgba(167,139,250,0.08)"}
                    strokeWidth={activePulse === i ? "2" : "1"}
                    strokeDasharray="4 4"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Center — user puppet */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-pulse blur-md" />
                <PuppetAvatar seed="me-center" size={72} personality="emotional" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-mono text-purple-300/70 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    ME: SecondMe_User
                  </span>
                </div>
              </div>
            </div>

            {/* Satellite puppets */}
            {satellites.map((sat, i) => {
              const rad = ((sat.angle + progress * 0.3) * Math.PI) / 180;
              const x = 180 + Math.cos(rad) * 130;
              const y = 180 + Math.sin(rad) * 130;
              const isActive = activePulse === i;

              return (
                <div
                  key={sat.id}
                  className="absolute z-10 transition-all duration-700 ease-out"
                  style={{
                    left: x - 28,
                    top: y - 28,
                  }}
                >
                  <div className="relative">
                    {isActive && (
                      <div className="absolute -inset-2 rounded-full bg-purple-400/25 animate-ping" style={{ animationDuration: "1.5s" }} />
                    )}
                    <PuppetAvatar seed={sat.seed} size={56} personality={sat.personality} />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full transition-colors duration-500 ${
                        isActive
                          ? "text-purple-200 bg-purple-500/20 border border-purple-400/30"
                          : "text-white/30 bg-white/5 border border-white/5"
                      }`}>
                        {sat.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto px-8 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white/30 tracking-wider">SYNC PROGRESS</span>
            <span className="text-[10px] font-mono text-purple-300">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-xl font-bold font-mono text-white">{stat.value}</span>
                <span className="text-xs font-mono text-purple-300">{stat.unit}</span>
              </div>
              <p className="text-[10px] text-white/30 mt-0.5 tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="w-full max-w-md mx-auto px-8 pb-8">
          {syncComplete ? (
            <button
              onClick={() => router.push("/matching-channels")}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm
                         hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              查看对撞详情
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
              <svg className="animate-spin w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              人格维度深度扫描中...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
