"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import AnimatedChat from "@/components/AnimatedChat";

// A cursor-reactive, layered 3D scene for the auth screen: the phone mockup
// tilts in real perspective toward the pointer, floating proof-badges drift
// past it at a faster rate (closer = moves more), and background glow orbs
// drift slower still (farther = moves less) — real parallax depth, not a
// single flat card.
export default function AuthVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 120, damping: 20, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  // Depth layers: background moves least, phone moves a little, badges (the
  // "closest" layer) move the most — this is what reads as real depth.
  const bgX = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const bgY = useTransform(y, [-0.5, 0.5], [-10, 10]);

  const phoneRotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const phoneRotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const phoneX = useTransform(x, [-0.5, 0.5], [-14, 14]);
  const phoneY = useTransform(y, [-0.5, 0.5], [-10, 10]);

  const badgeFrontX = useTransform(x, [-0.5, 0.5], [-34, 34]);
  const badgeFrontY = useTransform(y, [-0.5, 0.5], [-26, 26]);
  const badgeBackX = useTransform(x, [-0.5, 0.5], [22, -22]);
  const badgeBackY = useTransform(y, [-0.5, 0.5], [16, -16]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: 1400 }}
    >
      {/* Layer 0 — ambient background glow, drifts slowest */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-white/[0.07] blur-2xl animate-[outer-glow-breathe_5s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-6 w-48 h-48 rounded-full bg-white/[0.06] blur-2xl animate-[outer-glow-breathe_6s_ease-in-out_infinite_0.8s]" />
      </motion.div>

      {/* Layer 2 (back) — small floating rating badge, moves opposite the front badge */}
      <motion.div
        style={{ x: badgeBackX, y: badgeBackY }}
        className="absolute left-2 xl:left-6 bottom-24 z-0 animate-float"
      >
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-2xl shadow-xl px-4 py-2.5">
          <span className="text-amber-500 text-base leading-none">★</span>
          <div className="leading-none">
            <p className="text-[13px] font-serif text-charcoal">4.9 rating</p>
            <p className="text-[10px] text-slate-400">500+ businesses</p>
          </div>
        </div>
      </motion.div>

      {/* Layer 1 (mid) — the phone, real 3D tilt toward the cursor */}
      <motion.div
        style={{
          rotateX: phoneRotateX,
          rotateY: phoneRotateY,
          x: phoneX,
          y: phoneY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-[1]"
      >
        <AnimatedChat />
      </motion.div>

      {/* Layer 2 (front) — booking notification, moves the most: nearest to viewer */}
      <motion.div
        style={{ x: badgeFrontX, y: badgeFrontY }}
        className="absolute right-1 xl:right-4 top-16 z-[2] animate-float"
      >
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl px-4 py-3 max-w-[168px]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-dark animate-[pulse-dot-green_1.8s_ease-in-out_infinite]" />
            <span className="text-[10px] font-medium text-mint-dark uppercase tracking-wide">New booking</span>
          </div>
          <p className="text-[12px] text-charcoal font-medium leading-snug">Classic Facial · 10:00 AM</p>
          <p className="text-[11px] text-slate-400">Amina Hassan</p>
        </div>
      </motion.div>
    </div>
  );
}
