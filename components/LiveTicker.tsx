"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Tick = {
  tag: string;
  text: string;
  color: string;
};

const FEED: Tick[] = [
  {
    tag: "SHIP",
    text: "Prophit · agent @conviction-7 opened YES on BTC>112K · $42.50 USDC",
    color: "text-violet-300",
  },
  {
    tag: "CLIENT",
    text: "insiders.bot · 81 markets live · zero-delay copy-trade enabled",
    color: "text-emerald-300",
  },
  {
    tag: "DEPLOY",
    text: "prophit-solana.vercel.app · seed:demo · worker heartbeat: 1.2s",
    color: "text-sky-300",
  },
  {
    tag: "COMMIT",
    text: "meridian / main · ZK-KYC proof gen latency −38% · vault v0.4",
    color: "text-amber-300",
  },
  {
    tag: "OSS",
    text: "Adwaitbytes/83 repos · YOLO + Pull Shark · 100+ midnight contributions",
    color: "text-rose-300",
  },
  {
    tag: "TALK",
    text: "ETH Builders Day · Bhopal Edition · 120+ builders · workshop series",
    color: "text-cyan-300",
  },
  {
    tag: "AGENT",
    text: "StellaRay · verify cost $0.03 · Poseidon hash · 0 leaks on-chain",
    color: "text-fuchsia-300",
  },
  {
    tag: "CLIENT",
    text: "BackerStage Capital · MVP Sprint · 14 days · ship ✓",
    color: "text-indigo-300",
  },
];

export default function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [live, setLive] = useState<Tick[]>([]);

  // pull live GitHub activity once on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/activity", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.ok && Array.isArray(j.ticks)) setLive(j.ticks);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Interleave: real event, curated event, real, curated, ...
  const feed: Tick[] =
    live.length > 0
      ? Array.from({ length: Math.max(FEED.length, live.length) * 2 }, (_, i) =>
          i % 2 === 0 ? live[(i / 2) % live.length] : FEED[(Math.floor(i / 2)) % FEED.length],
        )
      : FEED;

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % feed.length), 3200);
    return () => clearInterval(id);
  }, [feed.length]);

  const item = feed[idx % feed.length];

  return (
    <section
      aria-label="Live activity ticker"
      className="relative z-10 border-y border-white/8 bg-[var(--color-bg-raised)]/80 py-3 backdrop-blur"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 8px, rgba(255,255,255,0.08) 8px 9px)",
        }}
      />
      <div className="container-rail relative flex items-center gap-6">
        <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          live · now
        </div>
        <div className="h-4 w-px bg-white/15" />
        <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
              className="absolute inset-0 flex items-center gap-3 whitespace-nowrap"
            >
              <span
                className={`rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${item.color}`}
              >
                {item.tag}
              </span>
              <span className="truncate text-[13px] text-white/85">
                {item.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="hidden shrink-0 items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:flex">
          <span>{String((idx % feed.length) + 1).padStart(2, "0")}/{String(feed.length).padStart(2, "0")}</span>
          <span className="flex items-center gap-0.5">
            {feed.slice(0, Math.min(feed.length, 12)).map((_, i) => (
              <span
                key={i}
                className={`block h-[2px] w-3 ${i === idx % Math.min(feed.length, 12) ? "bg-white" : "bg-white/20"}`}
              />
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
