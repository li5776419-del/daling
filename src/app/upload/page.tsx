"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, BookOpen, PenTool, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { saveTrainingData } from "@/lib/persistence";
import { useUser } from "@/contexts/UserContext";

export default function UploadPage() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [autoFilled, setAutoFilled] = useState(false);
  const [formData, setFormData] = useState({
    xiaohongshu: "",
    feishu: "",
    thoughts: "",
    accountSync: "",
  });

  // Auto-fill from SecondMe data when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    Promise.all([
      fetch("/api/secondme/user/info").then((r) => r.json()),
      fetch("/api/secondme/user/shades").then((r) => r.json()),
    ]).then(([userResult, shadesResult]) => {
      const updates: Partial<typeof formData> = {};
      let filled = false;

      if (userResult.code === 0 && userResult.data?.bio) {
        updates.xiaohongshu = userResult.data.bio;
        filled = true;
      }

      if (shadesResult.code === 0 && shadesResult.data?.shades?.length) {
        const shadesText = shadesResult.data.shades
          .map((s: { shadeName: string; shadeDescription: string }) =>
            `${s.shadeName}：${s.shadeDescription}`
          )
          .join("\n");
        updates.thoughts = shadesText;
        filled = true;
      }

      if (filled) {
        setFormData((prev) => ({ ...prev, ...updates }));
        setAutoFilled(true);
      }
    }).catch(() => {
      // silently fail
    });
  }, [isLoggedIn]);

  const handleSubmit = () => {
    saveTrainingData(formData);
    localStorage.setItem("hasTrainingData", "true");
    localStorage.removeItem("skippedTraining");
    router.push("/birth");
  };

  const handleSkip = () => {
    localStorage.setItem("hasTrainingData", "false");
    localStorage.setItem("skippedTraining", "true");
    router.push("/birth");
  };

  const hasAnyData = Object.values(formData).some((v) => v.trim());

  return (
    <div className="page-bg page-transition">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 gradient-text">
          让灵偶认识你
        </h1>
        <p className="text-center text-gray-600 mb-8">
          数据越丰富，灵偶越能代表真实的你
        </p>

        {/* SecondMe auto-fill notice */}
        {autoFilled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 max-w-2xl mx-auto"
          >
            <p className="text-center text-purple-700 font-medium text-sm">
              已检测到你的 SecondMe 数据并自动填充，你可以自由编辑
            </p>
          </motion.div>
        )}

        {/* 四模块横向平铺 */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* 模块 1: 笔记内容 */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">笔记内容</h3>
                <p className="text-xs text-gray-500">审美与轨迹</p>
              </div>
            </div>
            <textarea
              value={formData.xiaohongshu}
              onChange={(e) =>
                setFormData({ ...formData, xiaohongshu: e.target.value })
              }
              placeholder="粘贴小红书笔记文字内容，或描述你的生活方式..."
              className="input min-h-[200px] resize-none"
            />
          </div>

          {/* 模块 2: 文档片段 */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">文档片段</h3>
                <p className="text-xs text-gray-500">思考与逻辑</p>
              </div>
            </div>
            <textarea
              value={formData.feishu}
              onChange={(e) =>
                setFormData({ ...formData, feishu: e.target.value })
              }
              placeholder="粘贴飞书文档内容，或工作笔记、思考记录..."
              className="input min-h-[200px] resize-none"
            />
          </div>

          {/* 模块 3: 随笔感悟 */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <PenTool size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">随笔感悟</h3>
                <p className="text-xs text-gray-500">价值观底线</p>
              </div>
            </div>
            <textarea
              value={formData.thoughts}
              onChange={(e) =>
                setFormData({ ...formData, thoughts: e.target.value })
              }
              placeholder="写下你的故事、感悟和期待，让灵偶听见你的心声..."
              className="input min-h-[200px] resize-none"
            />
          </div>

          {/* 模块 4: 账号同步 */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                <LinkIcon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">账号同步</h3>
                <p className="text-xs text-gray-500">自动采集</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.accountSync}
              onChange={(e) =>
                setFormData({ ...formData, accountSync: e.target.value })
              }
              placeholder="小红书主页链接..."
              className="input mb-3"
            />
            <p className="text-xs text-gray-400 leading-relaxed">
              将自动抓取你的公开笔记内容用于训练
            </p>
          </div>
        </div>

        {/* 底部按钮区域 */}
        <div className="text-center">
          <motion.button
            onClick={handleSubmit}
            disabled={!hasAnyData}
            className="btn-hero"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            点击生成灵魂
          </motion.button>

          <motion.button
            onClick={handleSkip}
            className="skip-button mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            跳过，先随便看看
          </motion.button>

          <p className="text-sm text-gray-500 mt-6">
            数据越多，灵偶越能代表真实的你 · 可以稍后完善
          </p>
        </div>
      </div>
    </div>
  );
}
