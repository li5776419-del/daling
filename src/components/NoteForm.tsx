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
        className="input-field w-full resize-none"
        rows={3}
      />
      <div className="flex items-center justify-between">
        {feedback && (
          <span
            className={`text-sm ${
              feedback.includes("失败") || feedback.includes("错误")
                ? "text-red-500"
                : "gradient-text font-medium"
            }`}
          >
            {feedback}
          </span>
        )}
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="ml-auto btn-primary !py-2 !px-6 text-sm"
        >
          {sending ? "发送中..." : "让 TA 记住"}
        </button>
      </div>
    </form>
  );
}
