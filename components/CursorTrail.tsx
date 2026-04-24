"use client";
import { useEffect, useRef } from "react";

/**
 * Scene-aware cursor ink trail.
 *
 * A full-viewport canvas sits below the custom cursor. On every mousemove we
 * emit a small particle at the cursor position. Each particle carries its own
 * color (sampled from `--ambient-hex` — broadcast by DirectorsConsole and
 * updated based on time-of-day). Particles fade + shrink over ~900ms.
 *
 * Noticeable but not loud. Fully RAF-driven, ~1.5ms per frame on an M1.
 */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number; // ms
  size: number;
  color: string;
};

const MAX_PARTICLES = 220;
const LIFE = 900;

function readAmbient(): string {
  if (typeof window === "undefined") return "#f4d35e";
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--ambient-hex")
    .trim();
  return raw || "#f4d35e";
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Honour reduced-motion preference.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only on devices with a precise pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let lastX = -999;
    let lastY = -999;
    let lastEmit = 0;
    let running = true;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      // Emit at most every 14ms to cap particle count.
      if (now - lastEmit < 14) return;
      lastEmit = now;

      const color = readAmbient();
      const dx = lastX === -999 ? 0 : e.clientX - lastX;
      const dy = lastY === -999 ? 0 : e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      // Faster movement ⇒ more / larger particles ⇒ stronger trail.
      const count = Math.min(3, 1 + Math.floor(speed / 18));

      for (let i = 0; i < count; i++) {
        const jitter = () => (Math.random() - 0.5) * 6;
        particles.push({
          x: e.clientX + jitter(),
          y: e.clientY + jitter(),
          vx: dx * 0.04 + (Math.random() - 0.5) * 0.6,
          vy: dy * 0.04 + (Math.random() - 0.5) * 0.6,
          born: now,
          life: LIFE + Math.random() * 300,
          size: 4 + Math.random() * 4 + Math.min(6, speed / 12),
          color,
        });
      }

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (!running) return;
      const now = performance.now();

      // Additive-ish feel via "lighter"; clear each frame.
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.born;
        const t = age / p.life;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        const alpha = (1 - t) * 0.55;
        const r = p.size * (1 - t * 0.6);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, withAlpha(p.color, alpha));
        grad.addColorStop(1, withAlpha(p.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45]"
    />
  );
}

/** Mix an alpha into a color string. Accepts #rrggbb and rgb()/rgba(). */
function withAlpha(c: string, a: number): string {
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s));
    return `rgba(${parts[0] || 0},${parts[1] || 0},${parts[2] || 0},${a})`;
  }
  return c;
}
