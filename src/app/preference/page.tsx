"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  tags: string[];
}

const categories: Category[] = [
  {
    id: "career",
    emoji: "💼",
    title: "搞事业",
    subtitle: "找个能帮我开天眼的人",
    tags: [
      "找工作", "资源交换", "寻找导师", "行业洞察",
      "产品思维", "认知升级", "职场解惑", "副业探索", "跨界合作",
    ],
  },
  {
    id: "dating",
    emoji: "💕",
    title: "找对象",
    subtitle: "找个真心想结婚的",
    tags: [
      "认真谈恋爱", "长期关系", "双向奔赴", "认真结婚",
      "稳定陪伴", "慢慢了解", "追求真诚", "审美一致",
      "共同生活", "快乐恋爱",
    ],
  },
  {
    id: "soul",
    emoji: "✨",
    title: "碰灵魂",
    subtitle: "想找个频率一致的",
    tags: [
      "深度对话", "对抗孤独", "精神共鸣", "频率一致",
      "找搭子", "情绪树洞", "小众爱好",
    ],
  },
];

export default function PreferencePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function selectCategory(id: string) {
    if (selectedCategory === id) return;
    setSelectedCategory(id);
    setSelectedTags(new Set());
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  async function handleSubmit() {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push("/matching-live");
  }

  return (
    <div className="page-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-200/25 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-10 w-80 h-80 bg-violet-200/25 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-20 space-y-8 page-transition">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold gradient-text">你想认识谁？</h2>
          <p className="text-text-secondary text-sm">
            定义你的社交诉求，灵偶将精准寻觅
          </p>
        </div>

        {/* 3-column category cards */}
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`card !p-4 text-center cursor-pointer ${
                  isActive
                    ? "!ring-2 !ring-primary !shadow-lg !shadow-primary/10"
                    : "hover:!shadow-md"
                }`}
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <h3 className={`font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                  {cat.title}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">{cat.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Expandable tags area */}
        {activeCategory && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">细化需求标签</h3>
              <div className="flex flex-wrap gap-2">
                {activeCategory.tags.map((t) => {
                  const isTagSelected = selectedTags.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`tag cursor-pointer ${isTagSelected ? "tag-selected" : ""}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                用一句话描述<span className="text-text-secondary font-normal">（可选）</span>
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：能聊深度话题，不止于表面寒暄的人..."
                rows={3}
                className="input-field text-sm resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory || isSubmitting}
          className="btn-primary w-full text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner !w-4 !h-4 !border-2 !border-white !border-t-transparent" />
              灵偶准备中...
            </>
          ) : (
            "让灵偶出发匹配"
          )}
        </button>
      </div>
    </div>
  );
}
