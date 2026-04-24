"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Medallion from "@/components/Medallion";
import MagneticText from "@/components/MagneticText";
import { profile } from "@/lib/data";
import { ArrowRight, Github, Linkedin } from "lucide-react";

function useIstTime() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour12: false,
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Hero() {
  const time = useIstTime();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[color:var(--color-bg)] pt-20 md:pt-24"
    >
      {/* subtle backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.14]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55vh]"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 40%, rgba(216,180,254,0.07), transparent 70%)",
        }}
      />

      {/* ═ HEADER RAIL ═ */}
      <div className="container-rail relative z-20 mt-8 grid grid-cols-[1fr_auto] items-center gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/55 md:grid-cols-[1fr_auto_1fr] md:text-[10px] md:tracking-[0.32em]">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="truncate">Vol. 01 · 2026</span>
        </div>
        <div className="hidden justify-self-center text-center text-white/40 md:block">
          ADWAIT · KESHARI — A PORTFOLIO
        </div>
        <div className="justify-self-end truncate text-right text-white/40">
          <span className="hidden sm:inline">{profile.location}</span>
          <span className="sm:hidden">BPL</span>
          {time ? ` · ${time}` : ""}
        </div>
      </div>

      <div
        aria-hidden
        className="container-rail relative z-20 mt-3 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-[color:rgba(var(--tone-fg),0.12)]" />
        <div className="h-px flex-1 bg-[color:rgba(var(--tone-fg),0.12)]" />
      </div>

      {/* ═ MAIN CANVAS ═ */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 md:py-6">
        <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-[0.9fr_1.1fr_0.9fr]">
          {/* Left meta column */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="order-2 md:order-1"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
              / dossier
            </div>
            <ul className="mt-4 space-y-3 text-[13px] text-white/75 md:text-sm">
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-white/35">01</span>
                <span>Full-stack engineer · AI × crypto × product.</span>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-white/35">02</span>
                <span>BS Data Science, IIT Madras.</span>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-white/35">03</span>
                <span>Community Lead — Bhopal DAO, AarambhLabs.</span>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-white/35">04</span>
                <span>Three Web3 products shipped in 2025.</span>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-4">
                <span className="text-white/35">05</span>
                <span>Currently: applied ZK · agent memory.</span>
              </li>
            </ul>

            <div className="mt-10 hidden md:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
                / stats
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
                {profile.stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl leading-none text-white">
                      {s.value}
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* CENTERPIECE — medallion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 1.1, ease: [0.2, 0.9, 0.2, 1] }}
            className="relative order-1 mx-auto aspect-square w-[min(82vw,520px)] md:order-2 md:w-[min(48vw,520px)]"
          >
            {/* shader disc */}
            <div
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{
                boxShadow:
                  "0 30px 120px -30px rgba(216,180,254,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 60px -10px rgba(125,211,252,0.15)",
              }}
            >
              <Medallion />
              {/* chromatic edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, transparent 45%, rgba(0,0,0,0.55) 95%)",
                }}
              />
              {/* inner vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "inset 0 0 80px 10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              {/* monogram */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="select-none font-display text-[min(22vw,130px)] font-medium leading-none text-white/95 mix-blend-screen">
                  AK
                </span>
              </div>
            </div>

            {/* corner ticks */}
            <CornerTicks />

            {/* orbit rings (inside disc footprint, won't collide with cols) */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[2%]">
                <OrbitRingInline
                  text="ADWAIT · KESHARI · FULL-STACK · WEB3 · AI · BHOPAL → WORLD · "
                  duration={44}
                  opacity={0.6}
                />
              </div>
              <div className="absolute inset-[18%]">
                <OrbitRingInline
                  text="THE OPERATOR · THE OPERATOR · "
                  duration={28}
                  opacity={0.32}
                />
              </div>
            </div>
          </motion.div>

          {/* Right meta column */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.2 }}
            className="order-3 md:text-right"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
              / shipping
            </div>
            <ul className="mt-4 space-y-3 text-[13px] text-white/75 md:text-sm">
              {[
                ["Prophit", "AI × Solana markets"],
                ["insiders.bot", "Prediction markets · client"],
                ["BackerStage", "VC MVP · 14d sprint"],
                ["Melodex", "IP × Story Protocol"],
                ["StellaRay", "ZK Auth · Stellar"],
              ].map(([n, k]) => (
                <li
                  key={n}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-3 md:grid-cols-[auto_1fr]"
                >
                  <span className="truncate font-medium text-white md:order-2 md:text-right">
                    {n}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 md:order-1">
                    {k}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 hidden md:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
                / contact
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/50 hover:text-white"
                  aria-label="GitHub"
                >
                  <Github size={14} />
                </a>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/50 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href={profile.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/50 hover:text-white"
                  aria-label="X"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2H21l-6.52 7.47L22 22h-6.828l-4.78-6.26L4.8 22H2l6.996-8.01L2 2h6.914l4.34 5.74L18.244 2Zm-1.196 18h1.83L7.02 4H5.08l11.968 16Z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ═ FOOTER RAIL ═ */}
      <div className="container-rail relative z-20 pb-10 md:pb-12">
        <div
          aria-hidden
          className="mb-6 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-[color:rgba(var(--tone-fg),0.12)]" />
        </div>

        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto_1fr]">
          {/* bottom-left: section label */}
          <div className="order-2 text-center font-mono text-[9px] uppercase tracking-[0.24em] text-white/45 md:order-1 md:text-left md:text-[10px] md:tracking-[0.32em]">
            01 — INDEX
            <span className="mx-3 text-white/20">/</span>
            the operator
          </div>

          {/* centered: name + role */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="order-1 text-center md:order-2"
          >
            <h1 className="display-title text-[13vw] font-medium leading-[0.95] md:text-7xl lg:text-[92px]">
              <MagneticText text="Adwait " className="text-[color:var(--color-ink)]" radius={180} strength={26} />
              <MagneticText text="Keshari" gradient radius={180} strength={26} />
            </h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white/55">
              Full-stack engineer · Web3 explorer · b. 2005, IN
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#showcase"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                Enter showcase
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white/85 transition-colors hover:border-white/50 hover:text-white"
              >
                Hire me →
              </a>
            </div>
          </motion.div>

          {/* bottom-right: scroll cue */}
          <div className="flex items-end justify-end gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/45 md:flex-col md:items-end">
            <span>↓ scroll to enter</span>
            <span className="hidden md:block">Vol. 01 · p.01</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitRingInline({
  text,
  duration,
  opacity,
}: {
  text: string;
  duration: number;
  opacity: number;
}) {
  // scales to the parent box (aspect-square). Uses 100% viewBox.
  return (
    <div
      className="h-full w-full text-[color:var(--color-ink)]"
      style={{ animation: `slow-spin ${duration}s linear infinite`, opacity }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <defs>
          <path
            id={`r-${duration}`}
            d="M 50 50 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0"
          />
        </defs>
        <text
          fill="currentColor"
          fontFamily="var(--font-mono)"
          fontSize="2.5"
          letterSpacing="0.9"
        >
          <textPath href={`#r-${duration}`} startOffset="0">
            {(text + text + text).slice(0, 220)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

function CornerTicks() {
  const corners = [
    "top-0 left-0",
    "top-0 right-0 rotate-90",
    "bottom-0 right-0 rotate-180",
    "bottom-0 left-0 -rotate-90",
  ];
  return (
    <>
      {corners.map((c) => (
        <span
          key={c}
          aria-hidden
          className={`pointer-events-none absolute ${c} h-5 w-5`}
          style={{
            borderTop: "1px solid rgba(var(--tone-fg), 0.22)",
            borderLeft: "1px solid rgba(var(--tone-fg), 0.22)",
          }}
        />
      ))}
    </>
  );
}
