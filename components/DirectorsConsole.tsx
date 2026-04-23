"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Phase = {
  label: string;
  hue: number;          // 0–360, shifts the ambient accent
  hex: string;          // visual swatch
  blurb: string;
};

function phaseFor(hour: number): Phase {
  if (hour < 5)  return { label: "midnight",  hue: 268, hex: "#7c5bff", blurb: "the world is quiet" };
  if (hour < 8)  return { label: "dawn",      hue: 18,  hex: "#ff9c5b", blurb: "sun crawls up" };
  if (hour < 12) return { label: "morning",   hue: 48,  hex: "#f4d35e", blurb: "shipping window" };
  if (hour < 16) return { label: "afternoon", hue: 198, hex: "#7dd3fc", blurb: "deep work hours" };
  if (hour < 19) return { label: "dusk",      hue: 12,  hex: "#ff7f50", blurb: "amber light" };
  if (hour < 22) return { label: "evening",   hue: 290, hex: "#d8b4fe", blurb: "build mode" };
  return           { label: "late",            hue: 240, hex: "#9aa9ff", blurb: "the deep end" };
}

const SCENES: { id: string; label: string }[] = [
  { id: "home",     label: "01 · Index" },
  { id: "showcase", label: "02 · Showcase" },
  { id: "about",    label: "03 · Operator" },
  { id: "craft",    label: "04 · Kit" },
  { id: "timeline", label: "05 · Trace" },
  { id: "writing",  label: "06 · Signals" },
  { id: "faq",      label: "07 · FAQ" },
  { id: "contact",  label: "08 · Contact" },
];

const KONAMI = ["a", "d", "w", "a", "i", "t"];

export default function DirectorsConsole() {
  const [time, setTime] = useState("");
  const [phase, setPhase] = useState<Phase>(phaseFor(new Date().getHours()));
  const [scene, setScene] = useState("01 · Index");
  const [open, setOpen] = useState(true);
  const [secret, setSecret] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buf = useRef<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // live clock + phase
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = d.toLocaleTimeString("en-IN", {
        hour12: false, timeZone: "Asia/Kolkata",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      setTime(fmt);
      // hour-of-day in IST:
      const istHour = Number(
        d.toLocaleString("en-IN", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }),
      );
      const p = phaseFor(istHour);
      setPhase(p);
      // broadcast as CSS variable so the rest of the site can tint with it
      document.documentElement.style.setProperty("--ambient-hue", String(p.hue));
      document.documentElement.style.setProperty("--ambient-hex", p.hex);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // scroll-spy for which scene we're in
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            const hit = SCENES.find((s) => s.id === id);
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

  // Konami-style buffer: typing "adwait" anywhere unlocks secret mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const k = e.key.toLowerCase();
      if (!/^[a-z]$/.test(k)) {
        buf.current = [];
        return;
      }
      buf.current = [...buf.current, k].slice(-KONAMI.length);
      if (buf.current.join("") === KONAMI.join("")) {
        setSecret(true);
        document.documentElement.classList.add("secret-mode");
        setTimeout(() => {
          setSecret(false);
          document.documentElement.classList.remove("secret-mode");
        }, 8000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] hidden md:block"
      aria-hidden={false}
    >
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.2, 0.9, 0.2, 1] }}
            className="pointer-events-auto w-[260px] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.78)] backdrop-blur-xl"
            style={{
              boxShadow:
                "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(var(--tone-fg), 0.04)",
            }}
          >
            {/* Top strip — title bar */}
            <div className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{
                    background: phase.hex,
                    boxShadow: `0 0 10px ${phase.hex}`,
                  }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[color:var(--color-ink-mute)]">
                  director's console
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Collapse"
                className="grid h-5 w-5 place-items-center rounded-md text-[color:var(--color-ink-dim)] transition-colors hover:bg-[color:rgba(var(--tone-fg),0.06)] hover:text-[color:var(--color-ink)]"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-3 pb-3 pt-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-display text-2xl tabular-nums leading-none text-[color:var(--color-ink)]">
                  {time || "--:--:--"}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
                  IST · BPL
                </div>
              </div>

              {/* phase line */}
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-ink-dim)]">
                <span>{phase.label}</span>
                <span className="text-[color:var(--color-ink-mute)]">{phase.blurb}</span>
              </div>

              {/* phase swatch ribbon */}
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[color:rgba(var(--tone-fg),0.06)]">
                <motion.div
                  key={phase.label}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.4, ease: [0.2, 0.9, 0.2, 1] }}
                  style={{ background: phase.hex, transformOrigin: "left" }}
                  className="h-full"
                />
              </div>

              {/* scene */}
              <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] px-2.5 py-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
                  scene
                </span>
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
                  {scene}
                </span>
              </div>

              {/* hint row */}
              <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--color-ink-mute)]">
                <span>type "adwait" anywhere</span>
                <span className={secret ? "text-[color:var(--color-success)]" : ""}>
                  {secret ? "● UNLOCKED" : "○ locked"}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(true)}
            type="button"
            aria-label="Expand director's console"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.78)] px-3 py-2 backdrop-blur-xl"
          >
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: phase.hex, boxShadow: `0 0 10px ${phase.hex}` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]">
              {time || "—"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
