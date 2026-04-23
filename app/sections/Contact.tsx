"use client";
import { motion } from "motion/react";
import { profile } from "@/lib/data";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import CircleBadge from "@/components/CircleBadge";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/5 py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 80%, rgba(244,211,94,0.15), transparent 60%), radial-gradient(50% 60% at 80% 20%, rgba(125,211,252,0.12), transparent 60%)",
        }}
      />
      <div className="container-rail relative">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>07 — Let's build</span>
          <span>{profile.email}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9 }}
          className="display-title mt-10 leading-[0.88]"
          style={{
            fontSize: "clamp(2.75rem, 11.5vw, 9rem)",
            letterSpacing: "-0.045em",
            wordBreak: "break-word",
          }}
        >
          <span className="block text-[var(--color-ink)]">got something</span>
          <span className="block gradient-text">worth shipping?</span>
        </motion.h2>

        <div className="mt-16 grid items-start gap-12 md:grid-cols-[1.5fr_1fr] md:gap-20">
          <div>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-white/75 md:text-xl">
              Founding-engineer roles, applied-AI problems, cryptography at
              the product layer, or a gnarly full-stack scope you can't hand
              to a contractor — those are the conversations I want.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}?subject=Let%27s%20build%20something`}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                Start a thread
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(profile.email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-4 text-sm text-white/85 transition-colors hover:border-white/50 hover:text-white"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "copied!" : profile.email}
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-y-3 font-mono text-xs text-white/55 sm:grid-cols-4">
              <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover-underline">
                github ↗
              </a>
              <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="hover-underline">
                x / twitter ↗
              </a>
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover-underline">
                linkedin ↗
              </a>
              <a href={profile.social.portfolio} target="_blank" rel="noopener noreferrer" className="hover-underline">
                old portfolio ↗
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-8">
            <CircleBadge size={180} className="text-white/90" />

            <div className="hairline w-full rounded-2xl p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                What a good intro looks like
              </div>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
                <li className="flex gap-3">
                  <span className="font-mono text-[var(--color-accent)]">01</span>
                  <span>Two sentences on what you're building and why it matters.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[var(--color-accent)]">02</span>
                  <span>The scope you'd want me to own.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-[var(--color-accent)]">03</span>
                  <span>Timeline, team, stage. Clarity &gt; polish.</span>
                </li>
              </ol>
              <div className="divider-dashed my-5" />
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                reply inside 24h · if real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
