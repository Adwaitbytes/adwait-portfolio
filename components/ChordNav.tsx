"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Linear / Vim-style chord nav: press `g` then a letter to jump.
 *   g h → home (index)
 *   g s → showcase
 *   g o → operator / about
 *   g k → kit / craft
 *   g t → trace / timeline
 *   g w → writing / signals
 *   g f → faq
 *   g c → contact
 *   g ? → show help
 *   ? / → open command palette (parity with ⌘K)
 */
const MAP: Record<string, { id?: string; label: string; action?: () => void }> = {
  h: { id: "home",     label: "→ home" },
  s: { id: "showcase", label: "→ showcase" },
  o: { id: "about",    label: "→ operator" },
  k: { id: "craft",    label: "→ kit" },
  t: { id: "timeline", label: "→ trace" },
  w: { id: "writing",  label: "→ signals" },
  f: { id: "faq",      label: "→ faq" },
  c: { id: "contact",  label: "→ contact" },
};

const HINTS: { key: string; label: string }[] = [
  { key: "g h", label: "home" },
  { key: "g s", label: "showcase" },
  { key: "g o", label: "operator" },
  { key: "g k", label: "kit" },
  { key: "g t", label: "trace" },
  { key: "g w", label: "signals" },
  { key: "g f", label: "faq" },
  { key: "g c", label: "contact" },
];

export default function ChordNav() {
  const [pending, setPending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const cancel = () => {
      pendingRef.current = false;
      setPending(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();

      // Help toggle
      if (k === "?" || (e.shiftKey && k === "/")) {
        e.preventDefault();
        setShowHelp((v) => !v);
        cancel();
        return;
      }
      if (k === "escape") {
        setShowHelp(false);
        cancel();
        return;
      }

      if (!pendingRef.current) {
        if (k === "g") {
          e.preventDefault();
          pendingRef.current = true;
          setPending(true);
          timeoutRef.current = window.setTimeout(cancel, 1200);
        }
        return;
      }

      // We're in chord-pending state; resolve the next keystroke
      e.preventDefault();
      const hit = MAP[k];
      if (hit?.id) {
        const el = document.getElementById(hit.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setFlash(hit.label);
          window.setTimeout(() => setFlash(null), 900);
        }
      }
      cancel();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Pending chord indicator (bottom-left) */}
      <AnimatePresence>
        {pending && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none fixed bottom-4 left-4 z-[55] hidden md:flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.85)] px-2.5 py-1.5 backdrop-blur-xl"
          >
            <kbd className="kbd">g</kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
              waiting… press h·s·o·k·t·w·f·c
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash (the destination we just jumped to) */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed left-1/2 top-24 z-[55] -translate-x-1/2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.85)] px-3 py-1 backdrop-blur-xl"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]">
              {flash}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help sheet — press "?" */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm"
            style={{ background: "rgba(var(--tone-bg), 0.72)" }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-raised)] p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ink-mute)]">
                  Keyboard
                </div>
                <kbd className="kbd">esc</kbd>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-y-2.5 gap-x-6">
                {HINTS.map((h) => (
                  <div key={h.key} className="flex items-center justify-between gap-4">
                    <span className="text-[13px] text-[color:var(--color-ink)]">{h.label}</span>
                    <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">{h.key}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[color:var(--color-ink)]">play reel</span>
                  <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">space</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[color:var(--color-ink)]">command palette</span>
                  <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">⌘ k</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[color:var(--color-ink)]">easter egg</span>
                  <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">adwait</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-[color:var(--color-ink)]">this menu</span>
                  <span className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">?</span>
                </div>
              </div>
              <div className="mt-5 border-t border-[color:var(--color-border)] pt-3 text-[11px] leading-relaxed text-[color:var(--color-ink-mute)]">
                Vim / Linear-style chords. Press <kbd className="kbd">g</kbd> then a letter to jump between scenes.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
