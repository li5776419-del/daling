"use client";

interface IntimacyMeterProps {
  score: number;
  emotion?: string;
}

export default function IntimacyMeter({ score, emotion }: IntimacyMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getLevel = () => {
    if (clampedScore >= 80) return "心意相通";
    if (clampedScore >= 60) return "渐入佳境";
    if (clampedScore >= 40) return "初识阶段";
    if (clampedScore >= 20) return "刚刚认识";
    return "陌生人";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{getLevel()}</span>
          {emotion && <span className="text-xs gradient-text font-medium">{emotion}</span>}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${clampedScore}%`,
              background: "var(--gradient-main)",
            }}
          />
        </div>
      </div>
      <span className="text-sm font-bold gradient-text tabular-nums">
        {clampedScore}
      </span>
    </div>
  );
}
