"use client";

import { useRef, useEffect } from "react";
import PuppetAvatar from "@/components/PuppetAvatar";

type PersonalityType = "rational" | "emotional" | "humorous" | "deep";

interface MatchResult {
  id: string;
  name: string;
  seed: string;
  personality: PersonalityType;
  score: number;
  highlight: string;
  dimensions: {
    label: string;
    value: number;
  }[];
}

const mockResults: MatchResult[] = [
  {
    id: "1",
    name: "小晴",
    seed: "match-puppet-1",
    personality: "emotional",
    score: 92,
    highlight: "审美偏好、文学品味高度一致",
    dimensions: [
      { label: "审美", value: 95 },
      { label: "价值观", value: 88 },
      { label: "兴趣", value: 92 },
      { label: "生活", value: 85 },
      { label: "性格", value: 90 },
    ],
  },
  {
    id: "2",
    name: "阿远",
    seed: "match-puppet-2",
    personality: "rational",
    score: 85,
    highlight: "思维方式相近，对创业有共同热情",
    dimensions: [
      { label: "审美", value: 78 },
      { label: "价值观", value: 92 },
      { label: "兴趣", value: 80 },
      { label: "生活", value: 88 },
      { label: "性格", value: 85 },
    ],
  },
  {
    id: "3",
    name: "Luna",
    seed: "match-puppet-3",
    personality: "humorous",
    score: 78,
    highlight: "音乐品味和旅行偏好很像",
    dimensions: [
      { label: "审美", value: 85 },
      { label: "价值观", value: 72 },
      { label: "兴趣", value: 90 },
      { label: "生活", value: 75 },
      { label: "性格", value: 68 },
    ],
  },
];

function RadarChart({ dimensions, size = 160 }: { dimensions: { label: string; value: number }[]; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 24;
    const count = dimensions.length;
    const angleStep = (Math.PI * 2) / count;

    // Helper to get point on radar
    function getPoint(index: number, value: number) {
      const angle = angleStep * index - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius * (value / 100),
        y: cy + Math.sin(angle) * radius * (value / 100),
      };
    }

    // Draw grid rings
    ctx.strokeStyle = "rgba(124, 58, 237, 0.08)";
    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const p = getPoint(i % count, ring * 25);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < count; i++) {
      const p = getPoint(i, 100);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    // Draw data polygon with gradient fill
    ctx.beginPath();
    dimensions.forEach((d, i) => {
      const p = getPoint(i, d.value);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, "rgba(124, 58, 237, 0.25)");
    grad.addColorStop(1, "rgba(99, 102, 241, 0.1)");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(124, 58, 237, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    dimensions.forEach((d, i) => {
      const p = getPoint(i, d.value);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#7c3aed";
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    dimensions.forEach((d, i) => {
      const p = getPoint(i, 118);
      ctx.fillText(d.label, p.x, p.y);
    });
  }, [dimensions, size]);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto"
      style={{ width: size, height: size }}
    />
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-200/25 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -left-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />

      {/* Header */}
      <div className="glass px-4 py-3 flex items-center justify-between relative z-10">
        <a href="/matching" className="p-2 rounded-full hover:bg-white/40 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </a>
        <h1 className="text-sm font-medium">匹配结果</h1>
        <div className="w-8" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">灵偶为你找到了</h2>
          <p className="text-text-secondary text-sm">
            以下是与你灵魂频率最接近的人
          </p>
        </div>

        {/* Result cards */}
        <div className="space-y-4">
          {mockResults.map((result, index) => (
            <div
              key={result.id}
              className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-3 flex items-center gap-4">
                <div className="relative">
                  <PuppetAvatar seed={result.seed} size={56} personality={result.personality} />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                      1
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{result.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">{result.score}</span>
                      <span className="text-xs text-text-secondary">%契合</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{result.highlight}</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="px-5 pb-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Radar chart */}
              <div className="px-5 pb-4">
                <RadarChart dimensions={result.dimensions} size={160} />
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium hover:shadow-md hover:shadow-primary/20 transition-shadow">
                  开始对话
                </button>
                <button className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-white/60 transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="text-center space-y-3 pb-8">
          <button className="text-sm text-primary font-medium hover:underline">
            重新匹配
          </button>
          <p className="text-xs text-text-secondary">
            灵偶会持续学习，匹配结果将越来越准确
          </p>
        </div>
      </div>
    </div>
  );
}
