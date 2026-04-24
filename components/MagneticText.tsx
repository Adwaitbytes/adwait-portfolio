"use client";
import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

/**
 * Per-letter magnetic text.
 *
 * Splits text into spans. On global mousemove, each letter computes its
 * distance from the cursor and translates toward it — stronger the closer
 * the cursor gets. Spring-physics driven via motion/react so the letters
 * feel physical (overshoot + settle).
 *
 * - radius: how close before a letter reacts (px)
 * - strength: maximum displacement at the tightest distance (px)
 * - gradient: when true, each letter gets its own background-clip gradient
 */
export default function MagneticText({
  text,
  radius = 160,
  strength = 22,
  gradient = false,
  className = "",
}: {
  text: string;
  radius?: number;
  strength?: number;
  gradient?: boolean;
  className?: string;
}) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <MagneticChar key={`${c}-${i}`} char={c} radius={radius} strength={strength} gradient={gradient} />
      ))}
    </span>
  );
}

function MagneticChar({
  char,
  radius,
  strength,
  gradient,
}: {
  char: string;
  radius: number;
  strength: number;
  gradient: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, { stiffness: 250, damping: 18, mass: 0.6 });
  const y = useSpring(yRaw, { stiffness: 250, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let pending = false;
    let mx = 0;
    let my = 0;

    const compute = () => {
      pending = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        xRaw.set(0);
        yRaw.set(0);
        return;
      }
      const t = 1 - dist / radius; // 0..1
      // non-linear falloff so the closest pull feels punchy
      const pull = t * t * strength;
      const ux = (dx / (dist || 1)) * pull;
      const uy = (dy / (dist || 1)) * pull;
      xRaw.set(ux);
      yRaw.set(uy);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(compute);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [radius, strength, xRaw, yRaw]);

  // Preserve whitespace visually.
  if (char === " ") return <span>&nbsp;</span>;

  return (
    <motion.span
      ref={ref}
      className="inline-block will-change-transform"
      style={{
        x,
        y,
        ...(gradient
          ? {
              backgroundImage:
                "linear-gradient(120deg, var(--color-ink) 0%, var(--color-accent) 35%, var(--color-accent-3) 70%, var(--color-accent-4) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }
          : undefined),
      }}
    >
      {char}
    </motion.span>
  );
}
