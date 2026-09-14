"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import NiraIcon from "@/components/NiraIcon";
import NiraWordmark from "@/components/NiraWordmark";
import AuthVisual from "@/components/AuthVisual";
import { wavePanelPath } from "@/lib/wavePath";

// Desktop cover's wavy edge sits near the right side of its own half of the
// screen (0.95 of its own width, not the whole viewport) — a gentle
// two-and-a-half-cycle wave, not a straight divider. Close to the panel's
// own edge (not 0.88 as first tried) so there's no visible gap of bare
// background between the wave and the boundary with the other half.
const DESKTOP_WAVE = wavePanelPath(100, 100, "right", 0.95, 5, 2.5);

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface AuthCoverRevealProps {
  title: string;
  tagline: string;
  ctaLabel: string;
  switchLabel: string;
  switchHref: string;
  children: React.ReactNode;
}

export default function AuthCoverReveal({ title, tagline, ctaLabel, switchLabel, switchHref, children }: AuthCoverRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-lavender-light via-white to-mint-light overflow-hidden">
      {/* Desktop: left slot = cover panel, then the phone mockup once
          revealed. Right slot = phone mockup first, then the form. Both
          sides genuinely swap as part of the transition — the mockup isn't
          a fixed backdrop, it visibly moves from right to left as the cover
          peels away and the form takes its place on the right.

          h-screen (not min-h-screen) on the outer container + h-full here —
          min-h-screen left a real, reproducible ~85px gap at the bottom
          exposing the site's dark theme body background (confirmed via
          screenshot at multiple viewport heights, not a one-off). Hard-
          capping the height and letting FormPanel's own overflow-y-auto
          handle any mobile form that's taller than the screen avoids it. */}
      <div className="hidden lg:block lg:w-1/2 relative h-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {!revealed ? (
            <CoverPanel key="cover" title={title} tagline={tagline} ctaLabel={ctaLabel} onReveal={() => setRevealed(true)} />
          ) : (
            <VisualPanel key="visual-left" fromSide="right" />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 relative h-full">
        {/* Mobile has no second slot — the cover panel below already
            renders full-width and full-screen under lg, so the desktop
            swap doesn't apply there. */}
        <div className="hidden lg:block absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            {!revealed ? (
              <VisualPanel key="visual-right" fromSide="left" />
            ) : (
              <FormPanel key="form" onBack={() => setRevealed(false)} switchLabel={switchLabel} switchHref={switchHref}>
                {children}
              </FormPanel>
            )}
          </AnimatePresence>
        </div>
        <div className="lg:hidden absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            {!revealed ? (
              <CoverPanel key="cover-m" title={title} tagline={tagline} ctaLabel={ctaLabel} onReveal={() => setRevealed(true)} />
            ) : (
              <FormPanel key="form-m" onBack={() => setRevealed(false)} switchLabel={switchLabel} switchHref={switchHref}>
                {children}
              </FormPanel>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// The phone-mockup illustration side — rendered fresh on whichever side it
// currently belongs to (it has no state worth preserving across the swap),
// with an entrance that slides in from the side it's conceptually "coming
// from" so the swap reads as continuous motion rather than a jump-cut.
function VisualPanel({ fromSide }: { fromSide: "left" | "right" }) {
  const offscreenX = fromSide === "right" ? "6%" : "-6%";
  return (
    <motion.div
      initial={{ opacity: 0, x: offscreenX }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-coral/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-lavender/10 blur-3xl pointer-events-none" />
      <AuthVisual />
    </motion.div>
  );
}

function FloatingSpark({ delay, className }: { delay: number; className: string }) {
  return (
    <motion.div
      className={`absolute text-white/70 pointer-events-none ${className}`}
      animate={{ y: [0, -14, 0], opacity: [0.4, 0.9, 0.4], rotate: [0, 12, 0] }}
      transition={{ duration: 3.2, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles size={18} strokeWidth={1.5} />
    </motion.div>
  );
}

function CoverPanel({
  title,
  tagline,
  ctaLabel,
  onReveal,
}: {
  title: string;
  tagline: string;
  ctaLabel: string;
  onReveal: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-8%", transition: { duration: 0.45, ease: EASE } }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Wavy coral fill — desktop only; mobile's full-screen cover has no
          adjacent panel to wave against, so it's a plain gradient there. */}
      <div className="hidden lg:block absolute inset-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="55%" stopColor="#ff8585" />
              <stop offset="100%" stopColor="#E55555" />
            </linearGradient>
          </defs>
          <path d={DESKTOP_WAVE} fill="url(#coverGradient)" />
        </svg>
      </div>
      <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-coral via-[#ff8585] to-coral-dark" />

      {/* Floating decoration */}
      <div className="absolute inset-0 rounded-full bg-white/[0.06] pointer-events-none" style={{ top: "-15%", right: "-10%", width: 260, height: 260 }} />
      <motion.div
        className="absolute rounded-full bg-white/[0.08] pointer-events-none"
        style={{ bottom: "8%", left: "6%", width: 180, height: 180 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingSpark delay={0} className="top-[18%] right-[16%]" />
      <FloatingSpark delay={0.9} className="bottom-[28%] left-[12%]" />
      <FloatingSpark delay={1.7} className="top-[55%] right-[22%]" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 sm:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 hover:opacity-90 transition-opacity">
            <NiraIcon size={30} variant="white" />
            <NiraWordmark size="lg" variant="mono-white" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          className="font-serif text-[32px] sm:text-[38px] text-white leading-tight mb-3"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
          className="text-white/85 text-[15px] max-w-[280px] mb-10 leading-relaxed"
        >
          {tagline}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReveal}
          className="bg-white text-coral font-medium text-[15px] px-10 h-[52px] rounded-full shadow-lg shadow-black/10"
        >
          {ctaLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}

function FormPanel({
  onBack,
  switchLabel,
  switchHref,
  children,
}: {
  onBack: () => void;
  switchLabel: string;
  switchHref: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "6%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-0 flex flex-col overflow-y-auto"
    >
      {/* Compact coral header — mobile only, keeps brand presence once the
          full-screen cover has slid away (matches the rounded-sheet
          treatment the mobile form already used before this component). */}
      <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-coral via-[#ff8585] to-coral-dark pt-6 pb-14 px-6 flex-shrink-0">
        <div className="absolute -right-14 -top-14 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-white/90 text-[13px] font-medium">
            <ArrowLeft size={15} /> Back
          </button>
          <Link href={switchHref} className="text-white text-[13px] font-medium bg-white/15 px-3.5 py-1.5 rounded-full hover:bg-white/25 transition-colors">
            {switchLabel}
          </Link>
        </div>
        <Link href="/" className="relative z-10 flex items-center gap-2 mt-3 hover:opacity-90 transition-opacity">
          <NiraIcon size={22} variant="white" />
          <NiraWordmark size="md" variant="mono-white" />
        </Link>
      </div>

      {/* Desktop: a real card (border, shadow, generous padding) instead of
          bare text flush against the panel — the plain, un-bordered
          treatment this had before read as unfinished. The top-right
          "Sign in"/"Create account" link is always visible here regardless
          of how tall the form is (the register form runs long enough to
          push a bottom-of-form link below the fold on shorter screens).

          lg:my-auto on this wrapper (not justify-center on the scrollable
          ancestor) is what centers it — auto margins on a flex item center
          it when there's spare room but collapse to 0 instead of going
          negative when content is taller than the viewport, so a long
          form can never push the nav row above the reachable scroll area
          the way justify-center on the outer container did. */}
      <div className="flex-1 flex flex-col lg:flex-none lg:block lg:my-auto">
        <div className="hidden lg:flex items-center justify-between w-full max-w-lg mx-auto px-4 pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-coral text-[13px] font-medium transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <Link href={switchHref} className="text-coral text-[13px] font-medium hover:underline">
            {switchLabel}
          </Link>
        </div>

        <div className="flex-1 lg:flex-none w-full lg:max-w-lg lg:mx-auto bg-white rounded-t-[28px] lg:rounded-3xl -mt-8 lg:mt-0 relative z-10 shadow-[0_-12px_32px_rgba(30,41,59,0.08)] lg:shadow-xl lg:shadow-slate-900/5 lg:border lg:border-slate-100 px-6 pt-8 pb-10 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
