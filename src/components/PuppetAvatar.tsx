"use client";

import { useRef, useEffect } from "react";

type PersonalityType = "rational" | "emotional" | "humorous" | "deep";

interface PuppetAvatarProps {
  seed: string;
  size?: number;
  personality?: PersonalityType;
  className?: string;
  level?: number;
  animated?: boolean;
}

// --- Deterministic random helpers ---

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// --- Personality-driven style config ---

interface StyleConfig {
  hueRange: [number, number];
  saturation: [number, number];
  lightness: [number, number];
  blobCount: [number, number];
  blobSharpness: number;
  particleCount: [number, number];
  particleTrail: boolean;
  breathSpeed: number;
  coreShape: "radial" | "spiral" | "crystal" | "nebula";
  noiseIntensity: number;
}

const STYLE_MAP: Record<PersonalityType, StyleConfig> = {
  rational: {
    hueRange: [200, 260],
    saturation: [45, 65],
    lightness: [55, 75],
    blobCount: [4, 6],
    blobSharpness: 0.6,
    particleCount: [15, 25],
    particleTrail: false,
    breathSpeed: 0.6,
    coreShape: "crystal",
    noiseIntensity: 0.3,
  },
  emotional: {
    hueRange: [320, 380],
    saturation: [60, 80],
    lightness: [60, 78],
    blobCount: [3, 5],
    blobSharpness: 0.15,
    particleCount: [20, 35],
    particleTrail: true,
    breathSpeed: 1.0,
    coreShape: "radial",
    noiseIntensity: 0.5,
  },
  humorous: {
    hueRange: [30, 70],
    saturation: [65, 85],
    lightness: [60, 80],
    blobCount: [5, 8],
    blobSharpness: 0.35,
    particleCount: [25, 40],
    particleTrail: false,
    breathSpeed: 1.4,
    coreShape: "spiral",
    noiseIntensity: 0.7,
  },
  deep: {
    hueRange: [250, 300],
    saturation: [40, 60],
    lightness: [35, 60],
    blobCount: [3, 4],
    blobSharpness: 0.2,
    particleCount: [10, 18],
    particleTrail: true,
    breathSpeed: 0.45,
    coreShape: "nebula",
    noiseIntensity: 0.6,
  },
};

// --- Simplex-style noise (lightweight 2D) ---

function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = noise2D(ix, iy);
  const b = noise2D(ix + 1, iy);
  const c = noise2D(ix, iy + 1);
  const d = noise2D(ix + 1, iy + 1);
  return a + sx * (b - a) + sy * (c - a) + sx * sy * (a - b - c + d);
}

export default function PuppetAvatar({
  seed,
  size = 120,
  personality = "emotional",
  className = "",
  level = 1,
  animated = true,
}: PuppetAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const style = STYLE_MAP[personality];

    // Level adjusts complexity
    const complexityMultiplier = Math.min(1 + (level - 1) * 0.15, 2);

    const timeSalt = Math.floor(Date.now() / 60000);
    const h = hashCode(seed + timeSalt);
    const rand = seededRandom(h);

    const cx = size / 2;
    const cy = size / 2;

    // --- Generate palette ---
    const hueBase = style.hueRange[0] + rand() * (style.hueRange[1] - style.hueRange[0]);
    const hues = [
      hueBase % 360,
      (hueBase + 25 + rand() * 40) % 360,
      (hueBase + 140 + rand() * 60) % 360,
    ];
    const sat = style.saturation[0] + rand() * (style.saturation[1] - style.saturation[0]);
    const lit = style.lightness[0] + rand() * (style.lightness[1] - style.lightness[0]);

    // --- Generate organic blob shapes ---
    const blobCount = Math.round(
      (style.blobCount[0] + Math.floor(rand() * (style.blobCount[1] - style.blobCount[0]))) * complexityMultiplier
    );

    interface Blob {
      cx: number; cy: number; baseRadius: number; points: number;
      radii: number[]; hue: number; phase: number; rotSpeed: number;
    }

    const blobs: Blob[] = Array.from({ length: blobCount }, (_, i) => {
      const points = 64;
      const baseRadius = (0.18 + rand() * 0.14) * size;
      const radii: number[] = [];
      for (let p = 0; p < points; p++) {
        const angle = (p / points) * Math.PI * 2;
        const n = smoothNoise(
          Math.cos(angle) * 2 + rand() * 100,
          Math.sin(angle) * 2 + rand() * 100
        ) * style.blobSharpness;
        radii.push(1 + n * 0.4);
      }
      return {
        cx: cx + (rand() - 0.5) * size * 0.3,
        cy: cy + (rand() - 0.5) * size * 0.3,
        baseRadius, points, radii,
        hue: hues[i % hues.length],
        phase: rand() * Math.PI * 2,
        rotSpeed: (0.1 + rand() * 0.2) * (rand() > 0.5 ? 1 : -1),
      };
    });

    // --- Generate particles (scaled by level) ---
    const particleCount = Math.round(
      (style.particleCount[0] + Math.floor(rand() * (style.particleCount[1] - style.particleCount[0]))) * complexityMultiplier
    );

    interface Particle {
      angle: number; dist: number; r: number; phase: number;
      speed: number; hue: number; orbitSpeed: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      angle: rand() * Math.PI * 2,
      dist: 0.15 + rand() * 0.35,
      r: 0.8 + rand() * 2.2,
      phase: rand() * Math.PI * 2,
      speed: 0.3 + rand() * 0.8,
      hue: hues[Math.floor(rand() * hues.length)],
      orbitSpeed: (0.05 + rand() * 0.15) * (rand() > 0.5 ? 1 : -1),
    }));

    let prevParticlePositions: { x: number; y: number }[] = particles.map(() => ({ x: 0, y: 0 }));

    let startTime: number | null = null;

    function draw(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const t = ((timestamp - startTime!) / 1000) * style.breathSpeed;

      ctx!.clearRect(0, 0, size, size);

      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx!.clip();

      // --- Background gradient ---
      const bgGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
      bgGrad.addColorStop(0, `hsla(${hues[0]}, ${sat * 0.6}%, ${Math.min(lit + 25, 95)}%, 0.9)`);
      bgGrad.addColorStop(0.7, `hsla(${hues[1]}, ${sat * 0.5}%, ${Math.min(lit + 20, 92)}%, 0.6)`);
      bgGrad.addColorStop(1, `hsla(${hues[2]}, ${sat * 0.4}%, ${Math.min(lit + 15, 90)}%, 0.3)`);
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, size, size);

      // --- Core shape ---
      drawCoreShape(ctx!, style.coreShape, t, cx, cy, size, hues, sat, lit);

      // --- Organic blobs ---
      blobs.forEach((blob) => {
        const breathe = Math.sin(t * 0.8 + blob.phase) * 0.08;
        const drift = smoothNoise(t * 0.3, blob.phase) * size * 0.02 * style.noiseIntensity;
        const bx = blob.cx + drift;
        const by = blob.cy + Math.cos(t * 0.5 + blob.phase) * size * 0.015;

        ctx!.beginPath();
        for (let p = 0; p <= blob.points; p++) {
          const idx = p % blob.points;
          const angle = (idx / blob.points) * Math.PI * 2 + t * blob.rotSpeed;
          const noiseOffset = smoothNoise(
            Math.cos(angle) * 2 + t * 0.4,
            Math.sin(angle) * 2 + blob.phase
          ) * style.noiseIntensity * 0.15;
          const r = blob.baseRadius * (blob.radii[idx] + breathe + noiseOffset);
          const px = bx + Math.cos(angle) * r;
          const py = by + Math.sin(angle) * r;
          if (p === 0) ctx!.moveTo(px, py);
          else ctx!.lineTo(px, py);
        }
        ctx!.closePath();

        const grad = ctx!.createRadialGradient(bx, by, 0, bx, by, blob.baseRadius * 1.3);
        grad.addColorStop(0, `hsla(${blob.hue}, ${sat}%, ${lit}%, 0.55)`);
        grad.addColorStop(0.6, `hsla(${blob.hue}, ${sat * 0.8}%, ${lit + 10}%, 0.25)`);
        grad.addColorStop(1, `hsla(${blob.hue}, ${sat * 0.6}%, ${lit + 15}%, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fill();
      });

      // --- Particles ---
      particles.forEach((p, i) => {
        const currentAngle = p.angle + t * p.orbitSpeed;
        const breathDist = p.dist + Math.sin(t * p.speed + p.phase) * 0.04;
        const px = cx + Math.cos(currentAngle) * breathDist * size;
        const py = cy + Math.sin(currentAngle) * breathDist * size;
        const alpha = 0.3 + Math.sin(t * p.speed + p.phase) * 0.25;

        if (style.particleTrail && prevParticlePositions[i]) {
          const prev = prevParticlePositions[i];
          if (prev.x !== 0 || prev.y !== 0) {
            ctx!.beginPath();
            ctx!.moveTo(prev.x, prev.y);
            ctx!.lineTo(px, py);
            ctx!.strokeStyle = `hsla(${p.hue}, ${sat}%, ${lit + 10}%, ${alpha * 0.3})`;
            ctx!.lineWidth = p.r * 0.6;
            ctx!.stroke();
          }
        }
        prevParticlePositions[i] = { x: px, y: py };

        const pGrad = ctx!.createRadialGradient(px, py, 0, px, py, p.r * 2.5);
        pGrad.addColorStop(0, `hsla(${p.hue}, ${sat}%, ${lit + 15}%, ${alpha})`);
        pGrad.addColorStop(1, `hsla(${p.hue}, ${sat}%, ${lit + 15}%, 0)`);
        ctx!.beginPath();
        ctx!.arc(px, py, p.r * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = pGrad;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(px, py, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, ${sat + 10}%, ${lit + 20}%, ${alpha + 0.2})`;
        ctx!.fill();
      });

      // --- Center breathing glow ---
      const glowPulse = Math.sin(t * 0.6) * 0.3 + 0.7;
      const glowR = size * 0.18 * glowPulse;
      const glowGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glowGrad.addColorStop(0, `hsla(${hues[0]}, ${sat + 10}%, ${lit + 20}%, ${0.4 * glowPulse})`);
      glowGrad.addColorStop(0.5, `hsla(${hues[0]}, ${sat}%, ${lit + 15}%, ${0.15 * glowPulse})`);
      glowGrad.addColorStop(1, `hsla(${hues[0]}, ${sat}%, ${lit}%, 0)`);
      ctx!.beginPath();
      ctx!.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx!.fillStyle = glowGrad;
      ctx!.fill();

      ctx!.restore();

      // --- Subtle border ring ---
      ctx!.beginPath();
      ctx!.arc(cx, cy, size / 2 - 0.5, 0, Math.PI * 2);
      ctx!.strokeStyle = `hsla(${hues[0]}, ${sat * 0.5}%, ${lit + 20}%, 0.15)`;
      ctx!.lineWidth = 1;
      ctx!.stroke();

      if (animated) {
        animationRef.current = requestAnimationFrame(draw);
      }
    }

    animationRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationRef.current);
  }, [seed, size, personality, level, animated]);

  return (
    <div className="puppet-container" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        className={`rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 ${Math.max(4, size * 0.025)}px ${Math.max(10, size * 0.075)}px rgba(124, 58, 237, 0.2))`,
        }}
      />
      {level > 1 && (
        <div
          className="absolute bottom-0 right-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "var(--gradient-main)" }}
        >
          Lv.{level}
        </div>
      )}
    </div>
  );
}

// --- Core shape renderers ---

function drawCoreShape(
  ctx: CanvasRenderingContext2D,
  shape: StyleConfig["coreShape"],
  t: number, cx: number, cy: number, size: number,
  hues: number[], sat: number, lit: number
) {
  switch (shape) {
    case "crystal": drawCrystal(ctx, t, cx, cy, size, hues, sat, lit); break;
    case "spiral": drawSpiral(ctx, t, cx, cy, size, hues, sat, lit); break;
    case "nebula": drawNebula(ctx, t, cx, cy, size, hues, sat, lit); break;
    case "radial":
    default: drawRadial(ctx, t, cx, cy, size, hues, sat, lit); break;
  }
}

function drawCrystal(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, size: number, hues: number[], sat: number, lit: number) {
  const sides = 6;
  const layers = 3;
  for (let l = layers; l >= 1; l--) {
    const r = (size * 0.2 * l) / layers;
    const rotation = t * 0.15 * (l % 2 === 0 ? 1 : -1);
    const alpha = 0.12 + Math.sin(t * 0.5 + l) * 0.06;
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rotation;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${hues[l % hues.length]}, ${sat}%, ${lit + 15}%, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawSpiral(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, size: number, hues: number[], sat: number, lit: number) {
  const arms = 3;
  for (let a = 0; a < arms; a++) {
    ctx.beginPath();
    const startAngle = (a / arms) * Math.PI * 2 + t * 0.3;
    for (let i = 0; i < 60; i++) {
      const frac = i / 60;
      const angle = startAngle + frac * Math.PI * 3;
      const r = frac * size * 0.3;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    const alpha = 0.1 + Math.sin(t * 0.7 + a) * 0.05;
    ctx.strokeStyle = `hsla(${hues[a % hues.length]}, ${sat}%, ${lit + 10}%, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawNebula(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, size: number, hues: number[], sat: number, lit: number) {
  const clouds = 5;
  for (let c = 0; c < clouds; c++) {
    const angle = (c / clouds) * Math.PI * 2 + t * 0.08;
    const dist = size * 0.12 + Math.sin(t * 0.3 + c * 2) * size * 0.04;
    const nx = cx + Math.cos(angle) * dist;
    const ny = cy + Math.sin(angle) * dist;
    const r = size * 0.12 + Math.sin(t * 0.4 + c) * size * 0.03;
    const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
    const alpha = 0.15 + Math.sin(t * 0.35 + c * 1.5) * 0.08;
    grad.addColorStop(0, `hsla(${hues[c % hues.length]}, ${sat}%, ${lit}%, ${alpha})`);
    grad.addColorStop(1, `hsla(${hues[c % hues.length]}, ${sat}%, ${lit}%, 0)`);
    ctx.beginPath();
    ctx.arc(nx, ny, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

function drawRadial(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, size: number, hues: number[], sat: number, lit: number) {
  const rays = 8;
  for (let r = 0; r < rays; r++) {
    const angle = (r / rays) * Math.PI * 2 + t * 0.1;
    const len = size * 0.22 + Math.sin(t * 0.6 + r * 0.8) * size * 0.05;
    const endX = cx + Math.cos(angle) * len;
    const endY = cy + Math.sin(angle) * len;
    const alpha = 0.08 + Math.sin(t * 0.5 + r) * 0.04;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = `hsla(${hues[r % hues.length]}, ${sat}%, ${lit + 15}%, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}
