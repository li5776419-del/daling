"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  getTrainingData,
  savePuppetData,
  type PuppetData,
  type TrainingData,
} from "@/lib/persistence";
import { useUser } from "@/contexts/UserContext";

export default function BirthPage() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [puppetData, setPuppetData] = useState<PuppetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSkippedMode, setIsSkippedMode] = useState(false);
  const [hasSecondMeData, setHasSecondMeData] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    generatePuppet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePuppet = async () => {
    setLoading(true);

    const hasTrainingData =
      localStorage.getItem("hasTrainingData") === "true";
    const skipped = localStorage.getItem("skippedTraining") === "true";

    // Fetch SecondMe shades for enhanced analysis if logged in
    let secondMeShades: string[] = [];
    if (isLoggedIn) {
      try {
        const res = await fetch("/api/secondme/user/shades");
        const data = await res.json();
        if (data.code === 0 && data.data?.shades?.length) {
          secondMeShades = data.data.shades.map(
            (s: { shadeName: string }) => s.shadeName
          );
          setHasSecondMeData(true);
        }
      } catch {
        // silently fail
      }
    }

    if (skipped || !hasTrainingData) {
      setIsSkippedMode(true);
      const defaultPuppet = generateDefaultPuppet();
      setPuppetData(defaultPuppet);
      savePuppetData(defaultPuppet);
      setLoading(false);
      return;
    }

    const trainingData = getTrainingData();
    if (!trainingData) {
      router.push("/upload");
      return;
    }

    const puppet = await generatePuppetFromData(trainingData, secondMeShades);
    setPuppetData(puppet);
    savePuppetData(puppet);
    setLoading(false);
  };

  function generateDefaultPuppet(): PuppetData {
    return {
      personality: {
        style: "deep",
        colorScheme: ["#7C3AED", "#EC4899", "#F59E0B"],
        elements: ["神秘", "探索", "未知"],
      },
      description:
        "我是一个刚刚诞生的灵偶，还在等待了解真实的你。虽然我现在还不够了解你，但我已经准备好陪你一起探索这个数字世界，寻找那些与你频率一致的灵魂。",
      tags: ["#待塑造", "#开放探索", "#潜力无限"],
      values: ["保持好奇", "拥抱未知", "真诚连接"],
    };
  }

  async function generatePuppetFromData(
    data: TrainingData,
    shadeNames: string[] = []
  ): Promise<PuppetData> {
    const isRational = analyzeDataType(data, shadeNames);

    const personality = {
      style: (isRational ? "rational" : "emotional") as
        | "rational"
        | "emotional",
      colorScheme: isRational
        ? ["#4F46E5", "#7C3AED", "#2563EB"]
        : ["#EC4899", "#F472B6", "#FB923C"],
      elements: extractTags(data),
    };

    const aiDescription = await generateDescription();

    return {
      personality,
      description: aiDescription.description,
      tags: aiDescription.tags,
      values: aiDescription.values,
    };
  }

  function analyzeDataType(data: TrainingData, shadeNames: string[] = []) {
    const rationalKeywords = [
      "数据", "分析", "逻辑", "思考", "工作", "技术",
    ];
    const emotionalKeywords = [
      "感受", "感觉", "喜欢", "美", "艺术", "情感",
    ];

    const allText = Object.values(data).join(" ") + " " + shadeNames.join(" ");
    const rationalScore = rationalKeywords.filter((k) =>
      allText.includes(k)
    ).length;
    const emotionalScore = emotionalKeywords.filter((k) =>
      allText.includes(k)
    ).length;

    return rationalScore > emotionalScore;
  }

  function extractTags(data: TrainingData) {
    const allText = Object.values(data).join(" ");
    const tagMap: Record<string, string[]> = {
      rational: ["深度思考者", "理性分析", "逻辑严谨"],
      creative: ["创意灵感", "审美敏锐", "跨界思维"],
      emotional: ["共情达人", "温暖治愈", "感性表达"],
    };

    if (allText.includes("技术") || allText.includes("数据"))
      return tagMap.rational;
    if (allText.includes("设计") || allText.includes("艺术"))
      return tagMap.creative;
    return tagMap.emotional;
  }

  async function generateDescription() {
    await new Promise((r) => setTimeout(r, 1500));

    // TODO: Replace with actual Gemini API call
    return {
      description:
        "我游走在理性的边界，用逻辑解构世界，却在每个深夜追问存在的意义。我更倾向于在扎实的数据中挖掘真相，而非被表象的浪潮裹挟。",
      tags: [
        "#深度思考者",
        "#理性分析",
        "#逻辑严谨",
        "#内敛厚重",
        "#文化学者",
      ],
      values: ["真诚第一", "深度优先", "追求本质"],
    };
  }

  async function syncToSecondMe() {
    if (!puppetData || syncing) return;
    setSyncing(true);
    setSyncFeedback(null);

    try {
      const noteContent = [
        `【灵偶自述】${puppetData.description}`,
        `【核心特质】${puppetData.tags.join("、")}`,
        `【价值观】${puppetData.values.join("、")}`,
      ].join("\n\n");

      const res = await fetch("/api/secondme/note/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });
      const result = await res.json();
      if (result.code === 0) {
        setSyncFeedback("已同步到 SecondMe");
        setTimeout(() => setSyncFeedback(null), 3000);
      } else {
        setSyncFeedback("同步失败，请重试");
      }
    } catch {
      setSyncFeedback("网络错误");
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">正在生成你的灵偶...</p>
        </div>
      </div>
    );
  }

  if (!puppetData) return null;

  const personalityType =
    puppetData.personality.style === "rational"
      ? "rational"
      : puppetData.personality.style === "deep"
        ? "deep"
        : "emotional";

  const personalityLabel =
    personalityType === "rational"
      ? "理性几何"
      : personalityType === "deep"
        ? "神秘深邃"
        : "感性流体";

  return (
    <div className="page-bg min-h-screen p-8">
      {/* 左上角按钮 */}
      <button
        onClick={() => router.push("/upload")}
        className="fixed top-20 left-6 z-40 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border-2 border-purple-300 text-purple-600 font-medium hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw size={16} />
        {isSkippedMode ? "填写数据" : "重新校准"}
      </button>

      <div className="max-w-6xl mx-auto pt-12">
        {/* SecondMe 数据增强提示 */}
        {hasSecondMeData && !isSkippedMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
          >
            <p className="text-center text-purple-700 font-medium text-sm">
              已融合你的 SecondMe 数据，灵偶人格分析更加精准
            </p>
          </motion.div>
        )}

        {/* 跳过模式提示 */}
        {isSkippedMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
          >
            <p className="text-center text-purple-700 font-medium">
              这是基于默认数据生成的灵偶。填写真实数据后，灵偶会更懂你！
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {isSkippedMode
              ? "你的临时灵偶已生成"
              : hasSecondMeData
                ? "基于你的 SecondMe 数据生成"
                : "你的灵偶已诞生"}
          </h1>
          <p className="text-gray-600">
            {isSkippedMode
              ? "这是一个待塑造的灵魂，等待你的真实数据来完善它"
              : "这是基于你的数据，在数字世界生成的专属化身"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-12 items-start">
          {/* 左侧：灵偶形态 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <PuppetAvatar
              seed="my-puppet-birth"
              personality={personalityType}
              size={400}
              animated={true}
            />
            {isSkippedMode && (
              <div className="mt-4 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                临时状态
              </div>
            )}
            <p className="mt-4 text-lg font-semibold text-gray-700">
              人格风格：
              <span className="gradient-text ml-2">{personalityLabel}</span>
            </p>
          </motion.div>

          {/* 右侧：三段式解析 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* 灵偶自述 */}
            <div className="card">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                灵偶自述
              </h2>
              <p className="text-gray-700 leading-relaxed italic">
                &ldquo;{puppetData.description}&rdquo;
              </p>
            </div>

            {/* 核心特质 */}
            <div className="card">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                核心特质
              </h2>
              <div className="flex flex-wrap gap-2">
                {puppetData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={isSkippedMode ? "tag" : "tag tag-selected"}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 价值观共鸣 */}
            <div className="card">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                价值观共鸣
              </h2>
              <div className="space-y-2">
                {puppetData.values.map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部按钮和寄语 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => router.push("/preference")}
            className="btn-hero mb-4"
          >
            赋予它使命
          </button>

          {/* Sync to SecondMe button */}
          {isLoggedIn && (
            <div className="mb-4">
              <button
                onClick={syncToSecondMe}
                disabled={syncing}
                className="btn-secondary text-sm"
              >
                {syncing ? "同步中..." : "同步灵偶到 SecondMe"}
              </button>
              {syncFeedback && (
                <p
                  className={`text-sm mt-2 font-medium ${
                    syncFeedback.includes("失败") || syncFeedback.includes("错误")
                      ? "text-red-500"
                      : "gradient-text"
                  }`}
                >
                  {syncFeedback}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500">
            灵偶形态会随你的真实成长与互动而持续演化
          </p>

          {isSkippedMode && (
            <p className="text-sm text-purple-600 mt-3 font-medium">
              完善数据后，灵偶的匹配精准度会显著提升
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
