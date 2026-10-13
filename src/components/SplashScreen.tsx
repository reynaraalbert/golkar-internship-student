/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCmsLoaded } from "@/components/CmsProvider";

/**
 * Opening animation shown once per full page load.
 *
 * Timing budget (total ≤ 2000ms):
 *  - Loading 0 → 100%  : max LOAD_MAX_MS (forced to 100% even if data is still loading)
 *  - Hold at 100%      : HOLD_MS
 *  - Portal opening    : EXIT_MS
 */
const LOAD_MIN_MS = 850; // never flash by too quickly
const LOAD_MAX_MS = 1300; // hard cap for the counter
const HOLD_MS = 80;
const EXIT_MS = 520;

const STAGES = [
  { at: 0, label: "Menghubungkan ke server" },
  { at: 22, label: "Memuat data program magang" },
  { at: 50, label: "Menyinkronkan berita & agenda" },
  { at: 80, label: "Menyiapkan portal" },
  { at: 100, label: "Portal siap" },
];

// Deterministic particles (no Math.random → no hydration mismatch)
const PARTICLES = [
  { x: 12, y: 22, s: 3, d: 0 },
  { x: 84, y: 18, s: 2, d: 0.4 },
  { x: 22, y: 76, s: 2, d: 0.8 },
  { x: 72, y: 82, s: 3, d: 0.2 },
  { x: 92, y: 52, s: 2, d: 0.6 },
  { x: 6, y: 50, s: 2, d: 1 },
  { x: 38, y: 12, s: 2, d: 0.3 },
  { x: 62, y: 90, s: 2, d: 0.9 },
  { x: 50, y: 6, s: 3, d: 0.5 },
  { x: 30, y: 92, s: 2, d: 0.7 },
];

const RING_R = 64;
const RING_C = 2 * Math.PI * RING_R;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function SplashScreen() {
  const pathname = usePathname();
  const skip = pathname?.startsWith("/admin") ?? false;

  const loaded = useCmsLoaded();
  const loadedRef = useRef(loaded);
  const loadedAtRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit" | "done">(skip ? "done" : "loading");

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  // Lock scrolling while the splash is visible
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [phase]);

  // Progress driver
  useEffect(() => {
    if (skip) return;

    const start = performance.now();
    let shown = 0;
    let raf = 0;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const tick = (now: number) => {
      const t = now - start;

      if (loadedRef.current && loadedAtRef.current === null) loadedAtRef.current = t;

      let target: number;
      if (t >= LOAD_MAX_MS) {
        target = 100;
      } else if (loadedAtRef.current !== null) {
        // Data is in → glide to 100% (but respect the minimum duration)
        const end = Math.min(LOAD_MAX_MS, Math.max(LOAD_MIN_MS, loadedAtRef.current + 300));
        target = easeOutCubic(Math.min(1, t / end)) * 100;
      } else {
        // Still waiting on data → creep up but hold below 90%
        target = Math.min(90, easeOutCubic(t / LOAD_MAX_MS) * 100);
      }

      shown = Math.max(shown, shown + (target - shown) * 0.28);
      if ((target >= 100 && 100 - shown < 0.6) || t >= LOAD_MAX_MS + 60) shown = 100;

      setProgress(Math.round(shown));

      if (shown >= 100 && !finished) {
        finished = true;
        timers.push(setTimeout(() => setPhase("exit"), HOLD_MS));
        timers.push(setTimeout(() => setPhase("done"), HOLD_MS + EXIT_MS));
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [skip]);

  if (phase === "done") return null;

  const exiting = phase === "exit";
  const stage = [...STAGES].reverse().find((s) => progress >= s.at) ?? STAGES[0];
  const doorEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto"
      role="status"
      aria-live="polite"
      aria-label={`Memuat portal Golkar Internship Student ${progress}%`}
    >
      {/* ── Portal doors ───────────────────────────────────────── */}
      <motion.div
        className="gis-splash-door absolute inset-y-0 left-0 w-1/2"
        initial={false}
        animate={{ x: exiting ? "-100%" : "0%" }}
        transition={{ duration: 0.44, ease: doorEase, delay: exiting ? 0.06 : 0 }}
      >
        <span className="absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-amber-300/70 to-transparent" />
      </motion.div>
      <motion.div
        className="gis-splash-door gis-splash-door--right absolute inset-y-0 right-0 w-1/2"
        initial={false}
        animate={{ x: exiting ? "100%" : "0%" }}
        transition={{ duration: 0.44, ease: doorEase, delay: exiting ? 0.06 : 0 }}
      >
        <span className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-amber-300/70 to-transparent" />
      </motion.div>

      {/* Light burst through the seam when the portal opens */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            key="seam"
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-amber-200"
            style={{ boxShadow: "0 0 40px 12px rgba(245,197,24,0.55), 0 0 120px 40px rgba(212,175,55,0.25)" }}
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: [0, 1, 0], scaleY: [0.2, 1, 1] }}
            transition={{ duration: 0.45, times: [0, 0.35, 1], ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Content layer ─────────────────────────────────────── */}
      <motion.div
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={exiting ? { opacity: 0, scale: 1.08, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: exiting ? 0.3 : 0.35, ease: "easeOut" }}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] max-w-[120vw] max-h-[120vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0.06)_40%,transparent_70%)]" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-amber-300"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, boxShadow: "0 0 8px rgba(245,197,24,0.8)" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: -24 }}
            transition={{ duration: 1.8, delay: p.d * 0.6, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* Emblem with progress ring */}
        <div className="relative w-[148px] h-[148px] sm:w-[168px] sm:h-[168px] flex items-center justify-center">
          {/* Rotating dashed outer ring */}
          <motion.div
            className="absolute -inset-3 rounded-full border border-dashed border-amber-400/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          />
          {/* Conic sweep */}
          <motion.div
            className="absolute inset-0 rounded-full gis-splash-sweep"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
          />

          {/* Progress ring */}
          <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full -rotate-90">
            <defs>
              <linearGradient id="gis-splash-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE885" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={RING_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
            <circle
              cx="70"
              cy="70"
              r={RING_R}
              fill="none"
              stroke="url(#gis-splash-ring)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress / 100)}
              style={{ filter: "drop-shadow(0 0 6px rgba(245,197,24,0.6))" }}
            />
          </svg>

          {/* Logo */}
          <motion.div
            className="relative w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] rounded-full bg-[#0D1626] border border-amber-400/30 flex items-center justify-center shadow-[0_0_40px_-6px_rgba(212,175,55,0.55)]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          >
            <img
              src="/images/golkar-internship-trans.png"
              alt="Golkar Internship Student"
              className="w-[70%] h-[70%] object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
            />
          </motion.div>
        </div>

        {/* Badge */}
        <motion.div
          className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-amber-300 uppercase">
            Portal E-Magang
          </span>
        </motion.div>

        {/* Title */}
        <motion.p
          className="mt-3 text-center text-xl sm:text-3xl font-black tracking-tight text-gradient-gold leading-tight"
          initial={{ opacity: 0, y: 10, letterSpacing: "0.12em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          GOLKAR INTERNSHIP STUDENT
        </motion.p>
        <motion.p
          className="mt-1 text-center text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Program Magang Resmi Fraksi Partai Golkar DPR RI
        </motion.p>

        {/* Progress */}
        <div className="mt-8 w-full max-w-[300px] sm:max-w-[360px]">
          <div className="flex items-end justify-between mb-2">
            <div className="h-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stage.label}
                  className="block text-[11px] font-semibold text-slate-300"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {stage.label}
                  {progress < 100 && <span className="gis-splash-dots" />}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-2xl sm:text-3xl font-black tabular-nums text-white leading-none">
              {progress}
              <span className="text-sm sm:text-base text-amber-300 ml-0.5">%</span>
            </span>
          </div>

          <div className="relative h-[5px] w-full rounded-full bg-white/[0.07] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(245,197,24,0.7)]"
              style={{ width: `${progress}%` }}
            >
              <span className="gis-splash-shimmer absolute inset-0" />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Portal Resmi · Golkar Internship Student
        </p>
      </motion.div>
    </div>
  );
}
