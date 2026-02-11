"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

/* ------------------------------------------------------------------ */
/*  Channel data                                                       */
/* ------------------------------------------------------------------ */

interface ChannelMessage {
  speaker: "me" | "them";
  text: string;
}

interface Channel {
  id: number;
  name: string;
  seed: string;
  personality: "rational" | "emotional" | "humorous" | "deep";
  status: "syncing" | "resonating" | "complete";
  score: number;
  messages: ChannelMessage[];
}

const channels: Channel[] = [
  {
    id: 1,
    name: "虚像筑梦师",
    seed: "dreamer-x1",
    personality: "deep",
    status: "resonating",
    score: 96,
    messages: [
      { speaker: "me", text: "你觉得人和人之间最稀缺的是什么？" },
      { speaker: "them", text: "是不需要解释的理解。就像读到一首诗，瞬间知道作者在说什么。" },
      { speaker: "me", text: "所以你也相信，有些连接是超越语言的？" },
      { speaker: "them", text: "不只是相信，我觉得那才是唯一真实的连接。语言只是桥，不是目的地。" },
    ],
  },
  {
    id: 2,
    name: "极光捕手",
    seed: "aurora-h2",
    personality: "emotional",
    status: "syncing",
    score: 88,
    messages: [
      { speaker: "me", text: "最近在看什么有意思的东西？" },
      { speaker: "them", text: "在追冰岛的极光直播！凌晨三点爬起来看，结果被美哭了" },
      { speaker: "me", text: "这种愿意为美牺牲睡眠的人，审美一定不会差" },
      { speaker: "them", text: "哈哈被你夸得好开心～你也是会为了一个好画面专门跑一趟的人吧？" },
    ],
  },
  {
    id: 3,
    name: "离散比特",
    seed: "bit-d3",
    personality: "rational",
    status: "syncing",
    score: 82,
    messages: [
      { speaker: "me", text: "你怎么看技术和人文的关系？" },
      { speaker: "them", text: "技术是放大器，放大的是使用它的人的意图。所以本质上这是个人文问题。" },
      { speaker: "me", text: "很少听到技术背景的人这么说。" },
      { speaker: "them", text: "可能因为我觉得最好的代码和最好的诗一样，都是优雅的简洁。" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Left side: orbital graph                                           */
/* ------------------------------------------------------------------ */

function OrbitalGraph() {
  const allNodes = [
    { seed: "me-center", name: "ME", personality: "emotional" as const, cx: 140, cy: 150, isMe: true },
    { seed: "dreamer-x1", name: "虚像筑梦师", personality: "deep" as const, cx: 52, cy: 40, isMe: false },
    { seed: "aurora-h2", name: "极光捕手", personality: "emotional" as const, cx: 238, cy: 50, isMe: false },
    { seed: "bit-d3", name: "离散比特", personality: "rational" as const, cx: 260, cy: 170, isMe: false },
    { seed: "quantum-q4", name: "量子絮语", personality: "humorous" as const, cx: 50, cy: 240, isMe: false },
    { seed: "stardust-s5", name: "星尘拾荒", personality: "deep" as const, cx: 230, cy: 260, isMe: false },
  ];

  return (
    <div className="relative w-[300px] h-[310px]">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 310">
        {allNodes.slice(1).map((node, i) => (
          <line
            key={i}
            x1={140} y1={150}
            x2={node.cx} y2={node.cy}
            stroke="rgba(167,139,250,0.15)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
      </svg>

      {/* Nodes */}
      {allNodes.map((node) => (
        <div
          key={node.seed}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: node.cx, top: node.cy }}
        >
          <div className="relative">
            {node.isMe && (
              <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse blur-sm" />
            )}
            <PuppetAvatar seed={node.seed} size={node.isMe ? 52 : 40} personality={node.personality} />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                node.isMe
                  ? "text-purple-300 bg-purple-500/15 border border-purple-500/20"
                  : "text-white/35 bg-white/5"
              }`}>
                {node.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Right side: channel card                                           */
/* ------------------------------------------------------------------ */

function ChannelCard({ channel, delay }: { channel: Channel; delay: number }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    channel.messages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), delay + i * 1400));
    });
    return () => timers.forEach(clearTimeout);
  }, [channel.messages, delay]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleCount, scrollToBottom]);

  const statusColor =
    channel.status === "resonating" ? "text-green-400" :
    channel.status === "complete" ? "text-blue-400" : "text-amber-400";

  const statusLabel =
    channel.status === "resonating" ? "RESONATING" :
    channel.status === "complete" ? "COMPLETE" : "SYNCING";

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Channel header */}
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <PuppetAvatar seed={channel.seed} size={28} personality={channel.personality} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/30">CHANNEL #{channel.id}</span>
              <span className={`text-[9px] font-mono ${statusColor} tracking-wider`}>{statusLabel}</span>
            </div>
            <span className="text-xs font-medium text-white/70">{channel.name}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold font-mono text-purple-300">{channel.score}</span>
          <span className="text-[10px] text-white/30 ml-0.5">%</span>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-3 space-y-2.5 max-h-[160px] overflow-y-auto scrollbar-hide">
        {channel.messages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.speaker === "me" ? "justify-end" : "justify-start"} animate-[fadeIn_0.3s_ease-out]`}
          >
            <div
              className={`max-w-[85%] px-3 py-1.5 rounded-xl text-xs leading-relaxed ${
                msg.speaker === "me"
                  ? "bg-purple-500/20 text-purple-200 rounded-br-sm"
                  : "bg-white/[0.05] text-white/60 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {visibleCount < channel.messages.length && (
          <div className="flex justify-start">
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.05] rounded-bl-sm">
              <span className="inline-flex gap-1">
                <span className="w-1 h-1 bg-white/20 rounded-full animate-pulse" />
                <span className="w-1 h-1 bg-white/20 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1 h-1 bg-white/20 rounded-full animate-pulse [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function MatchingChannelsPage() {
  const router = useRouter();
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAllDone(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left panel */}
        <div className="lg:w-[340px] shrink-0 border-r border-white/[0.04] flex flex-col items-center justify-center py-8 px-6">
          <OrbitalGraph />
          {/* Mini stats */}
          <div className="mt-6 flex gap-6 text-center">
            {[
              { label: "连接", value: "5" },
              { label: "维度", value: "12" },
              { label: "深度", value: "4.2M" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-sm font-bold font-mono text-white">{s.value}</p>
                <p className="text-[10px] text-white/25 tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold">实时并发对撞流</h1>
              <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/15">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE SIMULATION
              </span>
            </div>
            <a href="/matching-live" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5 space-y-4">
            {channels.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} delay={i * 2000} />
            ))}
          </div>

          {/* Bottom */}
          <div className="px-6 py-4 border-t border-white/[0.04]">
            {allDone ? (
              <button
                onClick={() => router.push("/resonance")}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm
                           hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                查看共鸣结果
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
                <svg className="animate-spin w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                多频道并发对撞进行中...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
