/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Desktop-only custom cursor: GIS logo head + glowing comet trail.
 * - Only active on devices with a fine pointer + hover (mouse/trackpad).
 * - Animated with requestAnimationFrame and direct DOM transforms (no React re-renders).
 * - Click hotspot is the center of the logo.
 */

// Trail orbs: closest to the head first. Gold → amber → rose → lavender glow.
const TRAIL = [
  { size: 26, opacity: 0.85, rgb: "255,236,160" },
  { size: 23, opacity: 0.75, rgb: "250,214,90" },
  { size: 20, opacity: 0.66, rgb: "245,197,24" },
  { size: 18, opacity: 0.56, rgb: "236,170,40" },
  { size: 16, opacity: 0.46, rgb: "224,140,60" },
  { size: 14, opacity: 0.38, rgb: "210,120,95" },
  { size: 12, opacity: 0.3, rgb: "190,110,135" },
  { size: 10, opacity: 0.22, rgb: "165,110,175" },
];

const FOLLOW = 0.36; // per-frame follow strength at 60fps (higher = tighter tail)

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input[type='submit'], input[type='button'], input[type='checkbox'], input[type='radio'], label, select, summary, [data-cursor='hover']";

export default function CustomCursor() {
  const pathname = usePathname();
  const disabled = pathname?.startsWith("/admin") ?? false;

  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Enable only on desktop-style pointers
  useEffect(() => {
    if (disabled) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [disabled]);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const headEl = headRef.current;
    if (!root || !headEl) return;

    const html = document.documentElement;
    html.classList.add("gis-cursor-on");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mouse = { x: -100, y: -100 };
    const pts = TRAIL.map(() => ({ x: -100, y: -100 }));
    let scale = 1;
    let visible = false;
    let hovering = false;
    let pressed = false;
    let last = performance.now();
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      root.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        pts.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
        setVisible(true);
      }
      const target = e.target as Element | null;
      const isHover = !!target?.closest?.(INTERACTIVE_SELECTOR);
      if (isHover !== hovering) {
        hovering = isHover;
        headEl.dataset.hover = isHover ? "1" : "0";
      }
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.667); // frame-rate independent

      // Head sits exactly on the pointer for precise clicking
      const targetScale = pressed ? 0.82 : hovering ? 1.28 : 1;
      scale += (targetScale - scale) * (1 - Math.pow(1 - 0.25, dt / 16.667));
      headEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

      // Each orb chases the one in front of it → comet tail
      let prevX = mouse.x;
      let prevY = mouse.y;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (reduceMotion) {
          p.x = mouse.x;
          p.y = mouse.y;
        } else {
          p.x += (prevX - p.x) * k;
          p.y += (prevY - p.y) * k;
        }
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        prevX = p.x;
        prevY = p.y;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      html.classList.remove("gis-cursor-on");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="gis-cursor-root" style={{ opacity: 0 }}>
      {/* Render tail back-to-front so orbs nearer the head sit on top */}
      {TRAIL.map((_, idx) => {
        const i = TRAIL.length - 1 - idx;
        const t = TRAIL[i];
        return (
          <span
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="gis-cursor-orb"
            style={{
              width: t.size,
              height: t.size,
              opacity: t.opacity,
              background: `radial-gradient(circle, rgba(${t.rgb},1) 0%, rgba(${t.rgb},0.65) 42%, rgba(${t.rgb},0) 72%)`,
            }}
          />
        );
      })}

      <div ref={headRef} className="gis-cursor-head" data-hover="0">
        <img src="/images/golkar-internship-trans.png" alt="" draggable={false} />
      </div>
    </div>
  );
}
