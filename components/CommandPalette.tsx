"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { commands } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setQ("");
      setIdx(0);
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.shortcut}`.toLowerCase().includes(needle),
    );
  }, [q]);

  const run = (c: (typeof commands)[number]) => {
    if ("external" in c && c.external) {
      window.open(c.external, "_blank", "noopener,noreferrer");
    } else if ("target" in c && c.target) {
      const el = document.querySelector(c.target);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -12, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -12, scale: 0.985, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/50"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIdx((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIdx((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && filtered[idx]) {
                    run(filtered[idx]);
                  }
                }}
                placeholder="Jump to a section, open a profile, send an email…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <span className="kbd">esc</span>
            </div>
            <div className="max-h-[50vh] overflow-auto py-1">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-white/40">
                  No matches. Try “github”, “mail”, or “work”.
                </div>
              )}
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => run(c)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-white/80",
                    i === idx && "bg-white/[0.06] text-white",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-mono">
                      {c.shortcut}
                    </span>
                    {c.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {"external" in c && c.external ? "open ↗" : "jump"}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span>↑ ↓ navigate</span>
              <span>↵ select</span>
              <span>⌘K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
