"use client";
import { useEffect, useRef } from "react";

/**
 * Drifting starfield canvas. Fills its parent, respects reduced motion,
 * and uses three parallax layers so the depth feels real. Stars twinkle
 * (alpha oscillation) and pan slowly right-to-left.
 */
export default function Starfield({
  density = 1,
  className = "",
  accent = "rgba(255,255,255,0.85)",
}: {
  density?: number;
  className?: string;
  accent?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    type Star = { x: number; y: number; z: number; r: number; tw: number; phase: number };
    let w = 0;
    let h = 0;
    let stars: Star[] = [];

    const init = () => {
      const parent = canvas.parentElement;
      w = parent ? parent.clientWidth : canvas.clientWidth;
      h = parent ? parent.clientHeight : canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((w * h) / 9000 * density); // scales with area
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.2 + Math.random() * 0.8,         // depth (0 far → 1 near)
        r: 0.4 + Math.random() * 1.2,          // radius
        tw: 0.6 + Math.random() * 1.6,         // twinkle speed
        phase: Math.random() * Math.PI * 2,
      }));
    };

    init();
    const ro = new ResizeObserver(() => init());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let start = performance.now();
    let raf = 0;
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // slow pan right → left, faster for nearer stars
        s.x -= 0.08 * s.z;
        if (s.x < -3) s.x = w + 3;

        // twinkle
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.tw + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = accentWithAlpha(accent, a * s.z);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };
    if (reduce) draw();
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, accent]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

function accentWithAlpha(c: string, a: number): string {
  // accept rgba(r,g,b,_) or rgb(r,g,b) or #rrggbb
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(",").map((s) => parseFloat(s));
    return `rgba(${r || 0},${g || 0},${b || 0},${a})`;
  }
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  return c;
}
