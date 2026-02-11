"use client";

import { motion } from "framer-motion";

interface BreakIceReportProps {
  matchPoints: string[];
  avoidPoints: string[];
  opener: string;
  openerHitRate: number;
  contactInfo: string;
}

const defaultProps: BreakIceReportProps = {
  matchPoints: [
    "你们都对深度对话有强烈需求，讨厌表面寒暄",
    "审美偏好高度重合，都欣赏理性与感性的平衡",
    "价值观契合度 97%，都将真诚视为社交底线",
  ],
  avoidPoints: [
    "避免过于功利的话题开场",
    "不要用流行梗或网络用语（对方偏好严肃表达）",
    "初次对话不要涉及过于私密的话题",
  ],
  opener:
    "看到你在感悟中提到的那句'美感是不需要被证明的真实'，特别有共鸣。我最近也在思考，当我们在数字世界中寻找连接时，是在对抗孤独，还是在创造一种新的存在形式？你怎么看？",
  openerHitRate: 94,
  contactInfo: "WeChat: virtual_dreamer",
};

export function BreakIceReport(props: Partial<BreakIceReportProps>) {
  const data = { ...defaultProps, ...props };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-12"
    >
      {/* 1. 契合点 */}
      <div className="card">
        <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span> 契合点
        </h3>
        <div className="space-y-3">
          {data.matchPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 避坑指南 */}
      <div className="card">
        <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚠️</span> 避坑指南
        </h3>
        <div className="space-y-2">
          {data.avoidPoints.map((point, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-orange-50 border border-orange-200"
            >
              <p className="text-sm text-orange-800">❌ {point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 万能开头 */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
        <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span> 万能开场白
        </h3>
        <div className="p-4 rounded-xl bg-white border-2 border-purple-200">
          <p className="text-gray-800 leading-relaxed mb-3">
            &ldquo;{data.opener}&rdquo;
          </p>
          <p className="text-xs text-gray-500">
            💡 这个开场基于你们的共同感悟生成，命中率高达 {data.openerHitRate}%
          </p>
        </div>
      </div>

      {/* 联系方式 */}
      <div className="card text-center">
        <p className="text-gray-600 mb-4">对方的真实联系方式</p>
        <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
          <p className="text-2xl font-mono font-bold text-purple-600">
            {data.contactInfo}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
