/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCmsLoaded } from "@/components/CmsProvider";

/**
 * Opening animation shown once per full page load.
 *
 * Sequence:
 *  1. loading  – counter 0 → 100% while /api/content is fetched
 *                (LOAD_MIN_MS … LOAD_MAX_MS, forced to 100% at LOAD_MAX_MS)
 *  2. granted  – "access granted" moment: ring flash, shockwaves, welcome text
 *  3. opening  – cinematic gate reveal: light beam ignites through the seam,
 *                sparks burst, 3D gates swing open, light floods the screen
 */
const LOAD_MIN_MS = 2000; // counter never finishes faster than this
const LOAD_MAX_MS = 2600; // hard cap for the counter
const SETTLE_MS = 180; // short pause on "100% · Portal siap"
const GRANTED_MS = 650;
const OPENING_MS = 1500;

const STAGES = [
  { at: 0, label: "Menghubungkan ke server" },
  { at: 20, label: "Memuat data program magang" },
  { at: 48, label: "Menyinkronkan berita & agenda" },
  { at: 78, label: "Menyiapkan portal" },
  { at: 100, label: "Portal siap" },
];

// Deterministic ambient particles (no Math.random → no hydration mismatch)
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

// Spark streaks that burst from the center when the gates ignite
const SPARKS = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 2 ? 0.12 : -0.08);
  const dist = [260, 360, 300, 420][i % 4];
  return {
    angle,
    deg: (angle * 180) / Math.PI,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    len: [18, 26, 14, 22][i % 4],
    delay: (i % 5) * 0.025,
  };
});

const RING_R = 64;
const RING_C = 2 * Math.PI * RING_R;

// Deliberate counting curve: mostly linear with soft ease in/out
const easeCount = (t: number) => 0.45 * t + 0.55 * (-(Math.cos(Math.PI * t) - 1) / 2);

type Phase = "loading" | "granted" | "opening" | "done";

export default function SplashScreen() {
  const pathname = usePathname();
  const skip = pathname?.startsWith("/admin") ?? false;

  const loaded = useCmsLoaded();
  const loadedRef = useRef(loaded);
  const loadedAtRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>(skip ? "done" : "loading");

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
        // Data is in → glide to 100% (respecting the minimum duration)
        const end = Math.min(LOAD_MAX_MS, Math.max(LOAD_MIN_MS, loadedAtRef.current + 400));
        target = easeCount(Math.min(1, t / end)) * 100;
      } else {
        // Still waiting on data → keep counting but hold below 90%
        target = Math.min(90, easeCount(t / LOAD_MAX_MS) * 100);
      }

      shown = Math.max(shown, shown + (target - shown) * 0.2);
      if ((target >= 100 && 100 - shown < 0.6) || t >= LOAD_MAX_MS + 150) shown = 100;

      setProgress(Math.round(shown));

      if (shown >= 100 && !finished) {
        finished = true;
        timers.push(setTimeout(() => setPhase("granted"), SETTLE_MS));
        timers.push(setTimeout(() => setPhase("opening"), SETTLE_MS + GRANTED_MS));
        timers.push(setTimeout(() => setPhase("done"), SETTLE_MS + GRANTED_MS + OPENING_MS));
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

  const granted = phase === "granted" || phase === "opening";
  const opening = phase === "opening";
  const stage = [...STAGES].reverse().find((s) => progress >= s.at) ?? STAGES[0];

  const gateEase = [0.65, 0, 0.15, 1] as [number, number, number, number];
  const gateTransition = { duration: 1.05, ease: gateEase, delay: opening ? 0.2 : 0 };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto"
      style={{ perspective: "1600px" }}
      role="status"
      aria-live="polite"
      aria-label={`Memuat portal Golkar Internship Student ${progress}%`}
      initial={false}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.35, delay: opening ? 1.15 : 0, ease: "easeOut" }}
    >
      {/* ── Gates ─────────────────────────────────────────────── */}
      <motion.div
        className="gis-splash-door absolute inset-y-0 left-0 w-[calc(50%+1px)]"
        style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
        initial={false}
        animate={opening ? { rotateY: 88, x: "-14%" } : { rotateY: 0, x: "0%" }}
        transition={gateTransition}
      >
        <span className="gis-splash-door-frame" />
        <motion.span
          className="gis-splash-door-edge right-0"
          initial={false}
          animate={{ opacity: granted ? 1 : 0.45 }}
          transition={{ duration: 0.35 }}
        />
        <motion.span
          className="absolute inset-0 bg-black"
          initial={false}
          animate={{ opacity: opening ? 0.75 : 0 }}
          transition={gateTransition}
        />
      </motion.div>

      <motion.div
        className="gis-splash-door gis-splash-door--right absolute inset-y-0 right-0 w-[calc(50%+1px)]"
        style={{ transformOrigin: "right center", backfaceVisibility: "hidden" }}
        initial={false}
        animate={opening ? { rotateY: -88, x: "14%" } : { rotateY: 0, x: "0%" }}
        transition={gateTransition}
      >
        <span className="gis-splash-door-frame" />
        <motion.span
          className="gis-splash-door-edge left-0"
          initial={false}
          animate={{ opacity: granted ? 1 : 0.45 }}
          transition={{ duration: 0.35 }}
        />
        <motion.span
          className="absolute inset-0 bg-black"
          initial={false}
          animate={{ opacity: opening ? 0.75 : 0 }}
          transition={gateTransition}
        />
      </motion.div>

      {/* ── Opening light effects ─────────────────────────────── */}
      <AnimatePresence>
        {opening && (
          <>
            {/* Beam halo – widens as the gates part */}
            <motion.div
              key="beam-halo"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-[80px] z-20"
              style={{
                marginLeft: -40,
                background: "linear-gradient(90deg, transparent 0%, rgba(245,197,24,0.55) 35%, rgba(255,246,214,0.95) 50%, rgba(245,197,24,0.55) 65%, transparent 100%)",
                filter: "blur(10px)",
              }}
              initial={{ scaleY: 0, scaleX: 0.4, opacity: 0 }}
              animate={{ scaleY: [0, 1, 1, 1], scaleX: [0.4, 0.6, 3, 9], opacity: [0, 1, 0.9, 0] }}
              transition={{ duration: 1.15, times: [0, 0.22, 0.5, 1], ease: "easeOut" }}
            />
            {/* Beam core */}
            <motion.div
              key="beam-core"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-[3px] z-20 bg-white"
              style={{ marginLeft: -1.5, boxShadow: "0 0 18px 4px rgba(255,236,160,0.9), 0 0 60px 18px rgba(245,197,24,0.45)" }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, times: [0, 0.28, 1], ease: "easeOut" }}
            />
            {/* Light flood */}
            <motion.div
              key="flood"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full z-20"
              style={{
                width: "140vmax",
                height: "140vmax",
                marginLeft: "-70vmax",
                marginTop: "-70vmax",
                background: "radial-gradient(circle, rgba(255,250,232,0.95) 0%, rgba(255,232,150,0.6) 18%, rgba(245,197,24,0.22) 38%, transparent 62%)",
              }}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [0.1, 1, 1.8], opacity: [0, 0.95, 0] }}
              transition={{ duration: 1.05, delay: 0.22, times: [0, 0.35, 1], ease: "easeOut" }}
            />
            {/* Spark burst */}
            {SPARKS.map((s, i) => (
              <motion.span
                key={`spark-${i}`}
                className="pointer-events-none absolute left-1/2 top-1/2 z-30 rounded-full"
                style={{
                  width: s.len,
                  height: 2,
                  marginLeft: -s.len / 2,
                  marginTop: -1,
                  rotate: s.deg,
                  background: "linear-gradient(90deg, rgba(255,236,160,0) 0%, rgba(255,246,214,1) 100%)",
                  boxShadow: "0 0 8px rgba(245,197,24,0.9)",
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.6, 1.2, 0.3] }}
                transition={{ duration: 0.85, delay: 0.04 + s.delay, ease: [0.1, 0.7, 0.3, 1] }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ── Content layer ─────────────────────────────────────── */}
      <motion.div
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={
          opening
            ? { opacity: 0, scale: 1.35, filter: "blur(10px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: opening ? 0.5 : 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 w-[520px] h-[520px] max-w-[120vw] max-h-[120vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0.06)_40%,transparent_70%)]"
          style={{ x: "-50%", y: "-50%" }}
          initial={false}
          animate={{ scale: granted ? 1.35 : 1, opacity: granted ? 1 : 0.85 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-amber-300"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, boxShadow: "0 0 8px rgba(245,197,24,0.8)" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: -24 }}
            transition={{ duration: 2.2, delay: p.d * 0.8, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* Emblem with progress ring */}
        <motion.div
          className="relative w-[148px] h-[148px] sm:w-[168px] sm:h-[168px] flex items-center justify-center"
          initial={false}
          animate={{ scale: granted ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          {/* Shockwaves on access granted */}
          {granted &&
            [0, 0.16, 0.32].map((d) => (
              <motion.span
                key={`wave-${d}`}
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-300"
                style={{ boxShadow: "0 0 24px rgba(245,197,24,0.55), inset 0 0 24px rgba(245,197,24,0.35)" }}
                initial={{ scale: 1, opacity: 0.85 }}
                animate={{ scale: 3.4, opacity: 0 }}
                transition={{ duration: 1.1, delay: d, ease: [0.2, 0.6, 0.3, 1] }}
              />
            ))}

          {/* Rotating dashed outer ring */}
          <motion.div
            className="absolute -inset-3 rounded-full border border-dashed border-amber-400/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          />
          {/* Conic sweep */}
          <motion.div
            className="absolute inset-0 rounded-full gis-splash-sweep"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
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
              strokeWidth={granted ? 4.5 : 3.5}
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress / 100)}
              style={{
                filter: granted
                  ? "drop-shadow(0 0 12px rgba(255,236,160,0.95))"
                  : "drop-shadow(0 0 6px rgba(245,197,24,0.6))",
                transition: "stroke-width 0.3s ease, filter 0.3s ease",
              }}
            />
          </svg>

          {/* Logo */}
          <motion.div
            className="relative w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] rounded-full bg-[#0D1626] border border-amber-400/30 flex items-center justify-center overflow-hidden"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              boxShadow: granted
                ? "0 0 70px -4px rgba(245,197,24,0.85)"
                : "0 0 40px -6px rgba(212,175,55,0.55)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          >
            <img
              src="/images/golkar-internship-trans.png"
              alt="Golkar Internship Student"
              className="w-[70%] h-[70%] object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
            />
            {/* Flash on access granted */}
            {granted && (
              <motion.span
                className="absolute inset-0 rounded-full bg-amber-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.75, 0] }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
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
          initial={{ opacity: 0, y: 10, letterSpacing: "0.14em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        >
          GOLKAR INTERNSHIP STUDENT
        </motion.p>
        <motion.p
          className="mt-1 text-center text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Program Magang Resmi Fraksi Partai Golkar DPR RI
        </motion.p>

        {/* Progress ↔ Welcome */}
        <div className="mt-8 w-full max-w-[300px] sm:max-w-[360px] h-[52px] relative">
          <AnimatePresence mode="wait">
            {!granted ? (
              <motion.div
                key="progress"
                className="absolute inset-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, delay: 0 }}
              >
                <div className="flex items-end justify-between mb-2">
                  <div className="h-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={stage.label}
                        className="block text-[11px] font-semibold text-slate-300"
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.22 }}
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
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.span
                  className="text-lg sm:text-2xl font-black text-white uppercase"
                  initial={{ letterSpacing: "0.6em", opacity: 0 }}
                  animate={{ letterSpacing: "0.22em", opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  style={{ textShadow: "0 0 24px rgba(245,197,24,0.65)" }}
                >
                  Selamat Datang
                </motion.span>
                <motion.span
                  className="mt-1 text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-amber-300 uppercase"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                >
                  Akses Portal Dibuka
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Portal Resmi · Golkar Internship Student
        </p>
      </motion.div>
    </motion.div>
  );
}
