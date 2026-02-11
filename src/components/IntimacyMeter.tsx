"use client";

interface IntimacyMeterProps {
  score: number;
  emotion?: string;
}

export default function IntimacyMeter({ score, emotion }: IntimacyMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getLevel = () => {
    if (clampedScore >= 80) return { label: "心意相通", color: "from-pink-500 to-purple-500" };
    if (clampedScore >= 60) return { label: "渐入佳境", color: "from-purple-500 to-indigo-500" };
    if (clampedScore >= 40) return { label: "初识阶段", color: "from-indigo-500 to-blue-500" };
    if (clampedScore >= 20) return { label: "刚刚认识", color: "from-blue-500 to-cyan-500" };
    return { label: "陌生人", color: "from-cyan-500 to-gray-400" };
  };

  const level = getLevel();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">{level.label}</span>
          {emotion && <span className="text-xs text-primary">{emotion}</span>}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all duration-500`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-semibold text-primary tabular-nums">
        {clampedScore}
      </span>
    </div>
  );
}
