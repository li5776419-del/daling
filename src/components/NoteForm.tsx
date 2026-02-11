"use client";

import { useState } from "react";

export default function NoteForm() {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/secondme/note/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const result = await res.json();
      if (result.code === 0) {
        setFeedback("已记住啦~");
        setContent("");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback("发送失败，请重试");
      }
    } catch {
      setFeedback("网络错误");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="告诉 AI 关于你的事情，比如：我喜欢在雨天喝咖啡..."
        className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border
                   text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20
                   placeholder:text-text-secondary/60"
        rows={3}
      />
      <div className="flex items-center justify-between">
        {feedback && (
          <span
            className={`text-sm ${
              feedback.includes("失败") || feedback.includes("错误")
                ? "text-red-500"
                : "text-primary"
            }`}
          >
            {feedback}
          </span>
        )}
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="ml-auto px-5 py-2 rounded-full text-sm font-medium text-white
                     gradient-primary disabled:opacity-40
                     hover:shadow-md hover:shadow-primary/20
                     transition-shadow duration-200"
        >
          {sending ? "发送中..." : "让 TA 记住"}
        </button>
      </div>
    </form>
  );
}
