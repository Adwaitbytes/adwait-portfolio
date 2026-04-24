"use client";
import { useEffect } from "react";

/**
 * Scroll-velocity driven RGB split.
 *
 * Tracks scroll delta/ms, smooths it, and sets a CSS custom property
 * `--aberration` (0..1) on <html>. A drop-shadow filter on <main>
 * reads that variable to separate the red + cyan channels slightly.
 *
 * Tasteful: max separation 2–3px. Respects prefers-reduced-motion.
 */
export default function ScrollAberration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let lastT = performance.now();
    let target = 0;
    let cur = 0;
    let raf = 0;

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - last);
      const dt = Math.max(1, now - lastT);
      // 6 px/ms → full effect. Smaller than medallion's 4 so UI splits subtler.
      target = Math.min(1, dy / dt / 6);
      last = window.scrollY;
      lastT = now;
    };

    const tick = () => {
      target *= 0.92;
      cur += (target - cur) * 0.2;
      document.documentElement.style.setProperty("--aberration", cur.toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--aberration");
    };
  }, []);

  return null;
}
