"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PuppetAvatar from "@/components/PuppetAvatar";

/* ------------------------------------------------------------------ */
/*  Floating puppet config                                              */
/* ------------------------------------------------------------------ */

type Personality = "rational" | "emotional" | "humorous" | "deep";
const personalities: Personality[] = ["rational", "emotional", "humorous", "deep"];

interface FloatingPuppet {
  seed: string;
  personality: Personality;
  size: number;
  x: number;
  y: number;
  opacity: number;
  duration: number;
  delay: number;
  blur: number;
}

function generatePuppets(count: number): FloatingPuppet[] {
  const puppets: FloatingPuppet[] = [];
  for (let i = 0; i < count; i++) {
    puppets.push({
      seed: `landing-puppet-${i}-${Math.floor(Date.now() / 60000)}`,
      personality: personalities[i % personalities.length],
      size: 50 + (i * 37 % 60),
      x: (i * 17.3 + 5) % 90,
      y: (i * 23.7 + 8) % 85,
      opacity: 0.06 + (i % 5) * 0.03,
      duration: 18 + (i * 7 % 20),
      delay: -(i * 3.7 % 15),
      blur: 2 + (i % 3) * 2,
    });
  }
  return puppets;
}

export default function Home() {
  const puppets = useMemo(() => generatePuppets(7), []);

  return (
    <div className="page-bg relative overflow-hidden">
      {/* ---- Ambient gradient layers ---- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(236,72,153,0.06)_0%,transparent_50%)]" />

      {/* ---- Floating puppet background ---- */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {puppets.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              animation: `float-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          >
            <PuppetAvatar seed={p.seed} size={p.size} personality={p.personality} />
          </div>
        ))}
      </div>

      {/* ---- Center content ---- */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Large puppet logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="puppet-container"
        >
          <PuppetAvatar size={400} seed="daling-logo-main" personality="deep" className="puppet-glow" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-7xl font-bold mt-12 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          搭灵 Darling
        </motion.h1>

        {/* Slogan */}
        <motion.p
          className="text-2xl text-gray-700 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          穿越人海，遇见合适
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-sm text-gray-500 mt-6 max-w-2xl text-center leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          我们不相信冷冰冰的标签，更不愿让真实的魅力被掩埋在乏味的线上尬聊里
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12"
        >
          <Link href="/upload">
            <motion.button
              className="btn-hero"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              唤醒我的灵偶
            </motion.button>
          </Link>
        </motion.div>

        {/* Bottom subtle text */}
        <motion.p
          className="absolute bottom-6 text-[10px] font-mono text-gray-400 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Powered by SecondMe
        </motion.p>
      </div>
    </div>
  );
}
