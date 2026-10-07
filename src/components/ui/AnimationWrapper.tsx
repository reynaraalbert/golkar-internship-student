"use client";

import React from "react";
import { motion } from "framer-motion";

// ─── Reusable Animation Variants ───────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Reveal: generic scroll-triggered fade-up wrapper ──────────────────────
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}
export function Reveal({ children, className = "", delay = 0, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerList: wraps a list of children with stagger ────────────────────
export function StaggerList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeCard: individual animated card inside a StaggerList ───────────────
export function FadeCard({
  children,
  className = "",
  index = 0,
  hover = true,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={index}
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn: slide from left or right ─────────────────────────────────────
export function SlideIn({
  children,
  className = "",
  direction = "left",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={direction === "left" ? slideLeft : slideRight}
    >
      {children}
    </motion.div>
  );
}

// ─── SectionHeading: animated section title block ──────────────────────────
export function SectionHeading({
  tag,
  title,
  subtitle,
  center = true,
  className = "",
}: {
  tag?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`${center ? "text-center" : ""} max-w-3xl ${center ? "mx-auto" : ""} space-y-3 ${className}`}>
      {tag && (
        <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest flex items-center gap-1.5 justify-center">
          {tag}
        </span>
      )}
      <div className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
        {title}
      </div>
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">{subtitle}</p>
      )}
    </Reveal>
  );
}
