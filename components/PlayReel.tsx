"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, FastForward, X } from "lucide-react";

/**
 * Play-reel mode.
 *
 * Press SPACE anywhere (outside inputs) to start auto-scrolling the whole
 * page at "film pace." A floating playhead appears bottom-center with
 * play/pause + speed controls. SPACE again or Esc to stop. Any real user
 * scroll input pauses playback automatically.
 *
 * The speeds are tuned so one full scroll takes ~90s at 1x, ~45s at 2x.
 */
const SCENES = [
  { id: "home", label: "Index" },
  { id: "showcase", label: "Showcase" },
  { id: "about", label: "Operator" },
  { id: "craft", label: "Kit" },
  { id: "timeline", label: "Trace" },
  { id: "writing", label: "Signals" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export default function PlayReel() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [scene, setScene] = useState("Index");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const userInterruptRef = useRef(false);

  // mount-gate to avoid hydration mismatch (we render a fixed widget)
  useEffect(() => setVisible(true), []);

  // SPACE / Esc global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "Escape") {
        setPlaying(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    userInterruptRef.current = false;
    lastFrameRef.current = performance.now();

    // Target: full doc in 90s at 1x
    const pxPerSec = 1 * speed * (docHeight() / 90);

    const tick = (t: number) => {
      const dt = (t - lastFrameRef.current) / 1000;
      lastFrameRef.current = t;

      if (userInterruptRef.current) {
        setPlaying(false);
        return;
      }

      const maxY = docHeight() - window.innerHeight;
      const nextY = Math.min(maxY, window.scrollY + pxPerSec * dt);
      window.scrollTo(0, nextY);
      setProgress(maxY > 0 ? nextY / maxY : 0);
      if (nextY >= maxY - 1) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, speed]);

  // Detect user scroll interruption (wheel / touch) — distinct from our programmatic scroll
  useEffect(() => {
    const interrupt = () => {
      if (playing) userInterruptRef.current = true;
    };
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    return () => {
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchmove", interrupt);
    };
  }, [playing]);

  // Scroll-spy for current scene label
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const hit = SCENES.find((s) => s.id === (e.target as HTMLElement).id);
            if (hit) setScene(hit.label);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SCENES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {playing ? (
        <motion.div
          key="reel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-[65] hidden md:flex md:justify-center"
          role="region"
          aria-label="Reel playback"
        >
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.82)] px-2 py-1.5 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)]"
              aria-label="Pause"
              title="Pause (space)"
            >
              <Pause size={14} />
            </button>

            {/* progress bar */}
            <div className="relative h-1 w-48 overflow-hidden rounded-full bg-[color:rgba(var(--tone-fg),0.1)]">
              <div
                className="absolute inset-y-0 left-0 bg-[color:var(--color-ink)] transition-[width] duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-dim)] transition-colors hover:text-[color:var(--color-ink)]"
              title="Toggle speed"
            >
              <FastForward size={11} />
              {speed}×
            </button>

            <div className="mx-1 h-4 w-px bg-[color:var(--color-border)]" />

            <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] sm:flex">
              <span className="text-[color:var(--color-ink)]">{scene}</span>
              <span className="mx-1.5">·</span>
              <span>reel</span>
            </div>

            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="grid h-6 w-6 place-items-center rounded-full text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-ink)]"
              aria-label="Close"
              title="Close (esc)"
            >
              <X size={11} />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="play-pill"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22 }}
          onClick={() => setPlaying(true)}
          type="button"
          aria-label="Play as film reel"
          title="Play the site as a film reel (space)"
          className="pointer-events-auto fixed bottom-4 left-1/2 z-[55] hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.72)] px-3 py-2 backdrop-blur-xl transition-colors hover:bg-[color:rgba(var(--tone-bg),0.88)] md:inline-flex"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)]">
            <Play size={10} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]">
            Play reel
          </span>
          <kbd className="kbd">space</kbd>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function docHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
  );
}
