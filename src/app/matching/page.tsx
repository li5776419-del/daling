"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PuppetAvatar from "@/components/PuppetAvatar";

interface DialogMessage {
  speaker: "left" | "right";
  content: string;
}

const mockDialogue: DialogMessage[] = [
  { speaker: "left", content: "你好呀～我是小灵的灵偶，听说你也喜欢独立电影？" },
  { speaker: "right", content: "嗯嗯！最近在看侯孝贤的作品，长镜头真的很有魅力" },
  { speaker: "left", content: "侯孝贤！《悲情城市》看了好多遍，每次都有新感受" },
  { speaker: "right", content: "我也是，那种留白的美感，跟写诗很像" },
  { speaker: "left", content: "你也写诗？这个太巧了吧，我最近在读北岛" },
  { speaker: "right", content: "「卑鄙是卑鄙者的通行证，高尚是高尚者的墓志铭」这句一直记到现在" },
  { speaker: "left", content: "看来我们的审美频率真的很接近呢，还有什么共同爱好想聊聊吗？" },
  { speaker: "right", content: "太多了～感觉可以聊通宵那种 😄" },
];

function TypingIndicator() {
  return (
    <span className="inline-flex gap-1 py-1">
      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" />
      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse [animation-delay:300ms]" />
    </span>
  );
}

export default function MatchingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<(DialogMessage & { displayed: string; done: boolean })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Typing animation for a single message
  useEffect(() => {
    if (currentIndex >= mockDialogue.length) {
      setMatchComplete(true);
      return;
    }

    const msg = mockDialogue[currentIndex];

    // Show typing indicator
    setIsTyping(true);
    const typingDelay = setTimeout(() => {
      setIsTyping(false);

      // Add message with empty content
      setMessages((prev) => [
        ...prev,
        { ...msg, displayed: "", done: false },
      ]);

      // Type out character by character
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex++;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            displayed: msg.content.slice(0, charIndex),
            done: charIndex >= msg.content.length,
          };
          return updated;
        });

        if (charIndex >= msg.content.length) {
          clearInterval(interval);
          setTimeout(() => setCurrentIndex((i) => i + 1), 600);
        }
      }, 50);

      return () => clearInterval(interval);
    }, 800 + Math.random() * 600);

    return () => clearTimeout(typingDelay);
  }, [currentIndex]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return (
    <div className="h-screen flex flex-col gradient-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-10 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-10 w-60 h-60 bg-pink-200/20 rounded-full blur-3xl" />

      {/* Header */}
      <div className="glass px-4 py-3 flex items-center justify-between relative z-10">
        <a href="/preference" className="p-2 rounded-full hover:bg-white/40 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </a>
        <h1 className="text-sm font-medium">灵偶匹配中</h1>
        <div className="w-8" />
      </div>

      {/* Puppet Avatars */}
      <div className="relative z-10 flex items-center justify-center gap-8 py-6">
        <div className="text-center space-y-2">
          <PuppetAvatar seed="my-puppet" size={64} personality="emotional" />
          <p className="text-xs text-text-secondary">你的灵偶</p>
        </div>

        {/* Connection animation */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary/40 to-pink-400/40" />
          <div className="w-2 h-2 rounded-full bg-pink-400/40 animate-pulse [animation-delay:300ms]" />
          <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400/40 to-primary/40" />
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse [animation-delay:600ms]" />
        </div>

        <div className="text-center space-y-2">
          <PuppetAvatar seed="match-puppet-1" size={64} personality="deep" />
          <p className="text-xs text-text-secondary">Ta 的灵偶</p>
        </div>
      </div>

      {/* Dialogue area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 relative z-10">
        <div className="max-w-lg mx-auto space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.speaker === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="shrink-0">
                <PuppetAvatar
                  seed={msg.speaker === "left" ? "my-puppet" : "match-puppet-1"}
                  size={32}
                />
              </div>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.speaker === "right"
                    ? "gradient-primary text-white rounded-br-md"
                    : "glass rounded-bl-md"
                }`}
              >
                {msg.displayed}
                {!msg.done && <span className="animate-pulse">|</span>}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && currentIndex < mockDialogue.length && (
            <div
              className={`flex items-end gap-2 ${
                mockDialogue[currentIndex].speaker === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="shrink-0">
                <PuppetAvatar
                  seed={mockDialogue[currentIndex].speaker === "left" ? "my-puppet" : "match-puppet-1"}
                  size={32}
                />
              </div>
              <div
                className={`px-4 py-2.5 rounded-2xl ${
                  mockDialogue[currentIndex].speaker === "right"
                    ? "gradient-primary rounded-br-md"
                    : "glass rounded-bl-md"
                }`}
              >
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Bottom status / result button */}
      <div className="glass px-4 py-4 relative z-10">
        <div className="max-w-lg mx-auto">
          {matchComplete ? (
            <button
              onClick={() => router.push("/results")}
              className="w-full py-3.5 rounded-2xl gradient-primary text-white font-medium text-sm
                         hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              查看匹配结果
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
              <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              灵偶正在深入交流...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
