"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";
import { BreakIceReport } from "@/components/BreakIceReport";

const plans = [
  {
    id: "match",
    name: "确定性匹配",
    badge: "推荐",
    description: "包含：微信、完整分析报告、破冰建议",
    price: 99,
    recommended: true,
  },
  {
    id: "icebreak",
    name: "单向破冰权",
    badge: null,
    description: "包含：对方详细人格档案、拒绝理由分析",
    price: 199,
    recommended: false,
  },
];

export default function UnlockPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("match");
  const [isPaying, setIsPaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  async function handleUnlock() {
    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsPaying(false);
    setUnlocked(true);
  }

  return (
    <div className="page-bg relative overflow-hidden">
      <div className="absolute top-20 -right-20 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 page-transition">
        {/* Title */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-bold text-foreground">
            解锁与 <span className="gradient-text">虚像筑梦师</span> 的连接
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
            付费是对彼此时间的尊重，我们将揭开对方真实的联系方式
          </p>
        </div>

        {/* 1:1 并排展示 */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* 你的灵偶 */}
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-4">你的灵偶</p>
            <div className="flex justify-center">
              <PuppetAvatar
                seed="me-center"
                size={200}
                personality="emotional"
              />
            </div>
            <p className="mt-4 font-semibold text-foreground">内敛厚重</p>
            <p className="text-xs text-text-secondary">Lv.4</p>
          </div>

          {/* 对方灵偶 */}
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-4">对方灵偶</p>
            <div className="flex justify-center">
              <PuppetAvatar
                seed="dreamer-x1"
                size={200}
                personality="deep"
              />
            </div>
            <p className="mt-4 font-semibold text-foreground">虚像筑梦师</p>
            <p className="text-xs text-text-secondary">Lv.7 · 元初奇点</p>
          </div>
        </div>

        {!unlocked ? (
          <>
            {/* Plan cards */}
            <div className="max-w-md mx-auto space-y-3 mb-8">
              {plans.map((plan) => {
                const isSelected = selected === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelected(plan.id)}
                    className={`card w-full text-left cursor-pointer ${
                      isSelected
                        ? "!ring-2 !ring-primary !shadow-lg"
                        : "hover:!shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "border-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  background: "var(--gradient-main)",
                                }}
                              />
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground text-sm">
                            {plan.name}
                          </h3>
                          {plan.badge && (
                            <span
                              className="text-[10px] font-medium text-white px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--gradient-main)",
                              }}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary pl-[26px]">
                          {plan.description}
                        </p>
                      </div>
                      <div className="shrink-0 pl-4 text-right">
                        <div className="flex items-baseline">
                          <span
                            className={`text-sm ${
                              isSelected
                                ? "text-primary"
                                : "text-text-secondary"
                            }`}
                          >
                            ¥
                          </span>
                          <span
                            className={`text-3xl font-bold font-mono ${
                              isSelected
                                ? "gradient-text"
                                : "text-foreground/70"
                            }`}
                          >
                            {plan.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="max-w-md mx-auto space-y-4">
              <button
                onClick={handleUnlock}
                disabled={isPaying}
                className="btn-primary w-full text-base"
              >
                {isPaying ? (
                  <>
                    <div className="loading-spinner !w-4 !h-4 !border-2 !border-white !border-t-transparent" />
                    支付处理中...
                  </>
                ) : (
                  `确认解锁 · ¥${plans.find((p) => p.id === selected)?.price}`
                )}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-2 text-sm text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                返回观察
              </button>
            </div>
          </>
        ) : (
          /* 解锁成功后显示三合一破冰报告 */
          <BreakIceReport />
        )}
      </div>
    </div>
  );
}
