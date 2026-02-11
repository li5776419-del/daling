"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

interface MatchCard {
  id: string;
  name: string;
  seed: string;
  personality: "rational" | "emotional" | "humorous" | "deep";
  level: number;
  title: string;
  score: number;
  tags: string[];
  highlights: string[];
  dimensions: { label: string; value: number }[];
}

const matches: MatchCard[] = [
  {
    id: "1",
    name: "虚像筑梦师",
    seed: "dreamer-x1",
    personality: "deep",
    level: 7,
    title: "元初奇点",
    score: 96,
    tags: ["#深度思辨", "#文学审美", "#哲学探索"],
    highlights: [
      "对「语言与真实连接」的理解高度一致",
      "审美偏好重叠度 94%，尤其在文学与影像领域",
      "价值观核心：都将「理解」置于「表达」之上",
    ],
    dimensions: [
      { label: "价值观契合", value: 97 },
      { label: "对话共鸣", value: 95 },
      { label: "审美/兴趣", value: 94 },
      { label: "需求偏好", value: 88 },
    ],
  },
  {
    id: "2",
    name: "极光捕手",
    seed: "aurora-h2",
    personality: "emotional",
    level: 5,
    title: "感知织梦",
    score: 92,
    tags: ["#感性直觉", "#自然美学", "#冒险精神"],
    highlights: [
      "对「美」的感知方式极为相似——都是体验驱动型",
      "生活节奏偏好接近，都享受独处但不封闭",
      "情绪表达风格互补：一个内敛深沉，一个热烈真挚",
    ],
    dimensions: [
      { label: "价值观契合", value: 88 },
      { label: "对话共鸣", value: 94 },
      { label: "审美/兴趣", value: 96 },
      { label: "需求偏好", value: 85 },
    ],
  },
  {
    id: "3",
    name: "星辰编织者",
    seed: "starweaver-r3",
    personality: "rational",
    level: 6,
    title: "逻辑核心",
    score: 89,
    tags: ["#系统思维", "#产品直觉", "#跨界连接"],
    highlights: [
      "思维框架高度相似，都偏好结构化表达",
      "对「效率与深度」的平衡方式一致",
      "共同关注：用技术改善人与人的连接方式",
    ],
    dimensions: [
      { label: "价值观契合", value: 91 },
      { label: "对话共鸣", value: 87 },
      { label: "审美/兴趣", value: 82 },
      { label: "需求偏好", value: 93 },
    ],
  },
  {
    id: "4",
    name: "温度收集家",
    seed: "warmth-e4",
    personality: "emotional",
    level: 4,
    title: "共情灵体",
    score: 86,
    tags: ["#治愈系", "#生活美学", "#温暖陪伴"],
    highlights: [
      "对「陪伴」的理解一致——不打扰的温暖",
      "生活审美偏好重叠：咖啡、阅读、独立电影",
      "情绪敏感度匹配，都能捕捉对话中的弦外之音",
    ],
    dimensions: [
      { label: "价值观契合", value: 84 },
      { label: "对话共鸣", value: 90 },
      { label: "审美/兴趣", value: 88 },
      { label: "需求偏好", value: 80 },
    ],
  },
  {
    id: "5",
    name: "混沌先知",
    seed: "chaos-h5",
    personality: "humorous",
    level: 8,
    title: "灵感爆破",
    score: 83,
    tags: ["#创意爆发", "#幽默解构", "#反叛精神"],
    highlights: [
      "幽默风格互补：一个冷幽默，一个热梗王",
      "都对「反常规思维」有天然好感",
      "创造力维度高度匹配，擅长激发对方灵感",
    ],
    dimensions: [
      { label: "价值观契合", value: 78 },
      { label: "对话共鸣", value: 88 },
      { label: "审美/兴趣", value: 85 },
      { label: "需求偏好", value: 76 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Bar chart component                                                */
/* ------------------------------------------------------------------ */

function DimensionBars({ dimensions }: { dimensions: { label: string; value: number }[] }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3">
      {dimensions.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">{d.label}</span>
            <span className="text-xs font-semibold text-primary font-mono">{d.value}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${d.value}%` : "0%",
                background: "var(--gradient-main)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diamond icon                                                       */
/* ------------------------------------------------------------------ */

function DiamondIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-primary">
      <path d="M6 0L12 6L6 12L0 6Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Match result card                                                  */
/* ------------------------------------------------------------------ */

function ResultCard({ match, index }: { match: MatchCard; index: number }) {
  const router = useRouter();

  return (
    <div
      className="card animate-[fadeIn_0.6s_ease-out]"
      style={{ animationDelay: `${index * 0.2}s`, animationFillMode: "both" }}
    >
      {/* Top: avatar row with score in center */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center space-y-1.5">
          <PuppetAvatar seed="me-center" size={64} personality="emotional" />
          <div>
            <p className="text-xs font-medium text-foreground">我的灵偶</p>
            <p className="text-[10px] text-text-secondary">Lv.4 · 内敛厚重</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-5xl font-bold gradient-text font-mono">
            {match.score}
          </span>
          <p className="text-[10px] text-text-secondary mt-1 tracking-wider">RESONANCE SCORE</p>
        </div>

        <div className="text-center space-y-1.5">
          <PuppetAvatar seed={match.seed} size={64} personality={match.personality} />
          <div>
            <p className="text-xs font-medium text-foreground">{match.name}</p>
            <p className="text-[10px] text-text-secondary">Lv.{match.level} · {match.title}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {match.tags.map((t) => (
          <span key={t} className="tag text-xs">{t}</span>
        ))}
      </div>

      {/* Highlights */}
      <div className="mb-5 space-y-2">
        <h4 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">共鸣高光</h4>
        <div className="space-y-2">
          {match.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-0.5"><DiamondIcon /></div>
              <p className="text-sm text-foreground leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension bars */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-3">契合度分析</h4>
        <DimensionBars dimensions={match.dimensions} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/soul-dialogue")}
          className="btn-primary flex-1 !py-2.5 text-sm"
        >
          灵魂对话
        </button>
        <button
          onClick={() => router.push("/unlock")}
          className="btn-secondary flex-1 !py-2.5 text-sm"
        >
          解锁真实联系
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ResonancePage() {
  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-20 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -left-20 w-80 h-80 bg-orange-200/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-20 page-transition">
        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-4xl font-bold gradient-text">共鸣回响</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            在数字海洋中，灵偶为你捕捉到了这些跳动的信号
          </p>
        </div>

        {/* Match cards */}
        <div className="space-y-6 mb-10">
          {matches.map((match, i) => (
            <ResultCard key={match.id} match={match} index={i} />
          ))}
        </div>

        {/* Bottom */}
        <div className="text-center pb-8 space-y-2 animate-[fadeIn_1s_ease-out]" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
          <a href="/matching-live" className="text-sm text-primary font-medium hover:underline">
            重新匹配
          </a>
          <p className="text-xs text-text-secondary">
            灵偶持续演化中，共鸣将越来越精准
          </p>
        </div>
      </div>
    </div>
  );
}
