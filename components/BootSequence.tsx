"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  "init     → adwait.reel / vol. 01",
  "auth     → identity verified · adwait.keshari",
  "load     → manifest: projects[11] · signals[4]",
  "connect  → solana devnet · prophit online",
  "connect  → insiders.bot · 81 markets live",
  "boot     → cinematic mode · 24fps",
  "ready    → ⌘K for commands · scroll to enter",
];

export default function BootSequence() {
  const [show, setShow] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("adwait:booted");
    if (seen) {
      setShow(false);
      return;
    }
    const tick = setInterval(() => {
      setIdx((i) => {
        if (i >= LINES.length - 1) {
          clearInterval(tick);
          setTimeout(() => {
            sessionStorage.setItem("adwait:booted", "1");
            setShow(false);
          }, 560);
          return i;
        }
        return i + 1;
      });
    }, 180);
    return () => clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          className="fixed inset-0 z-[999] flex items-end justify-start bg-[var(--color-bg)] p-6 md:p-10"
        >
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative z-10 w-full max-w-xl font-mono text-xs leading-relaxed text-[var(--color-ink-dim)]">
            <div className="mb-6 flex items-center gap-3 text-[var(--color-ink)]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="tracking-[0.3em] uppercase text-[10px] text-[var(--color-ink-mute)]">
                adwait.keshari
              </span>
            </div>
            {LINES.slice(0, idx + 1).map((l, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className={i === idx ? "text-[var(--color-ink)]" : ""}
              >
                <span className="text-[var(--color-accent)]">›</span> {l}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
