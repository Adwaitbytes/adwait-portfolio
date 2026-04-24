"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import ContactConsole from "@/components/ContactConsole";

export default function Contact() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const read = () => {
      const t = (document.documentElement.dataset.theme as "dark" | "light" | undefined) ?? "dark";
      setTheme(t);
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-[color:var(--color-border)] py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 80%, rgba(244,211,94,0.12), transparent 60%), radial-gradient(50% 60% at 80% 20%, rgba(125,211,252,0.10), transparent 60%)",
        }}
      />

      <div className="container-rail relative">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
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
          <span className="block text-[color:var(--color-ink)]">got something</span>
          <span className="block gradient-text">worth shipping?</span>
        </motion.h2>

        <p className="mt-10 max-w-2xl text-pretty text-lg leading-relaxed text-[color:var(--color-ink-dim)] md:text-xl">
          Founding-engineer roles, applied-AI problems, cryptography at the
          product layer, or a gnarly full-stack scope you can't hand to a
          contractor — those are the conversations I want.
        </p>

        <div className="mt-14 grid items-start gap-10 md:grid-cols-[1.6fr_1fr] md:gap-14">
          <ContactConsole theme={theme} />

          <aside className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-6">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  what a good intro looks like
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-success)]">
                  open
                </span>
              </div>
              <ol className="mt-5 space-y-3.5 text-sm leading-relaxed text-[color:var(--color-ink-dim)]">
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
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  sla
                </span>
                <span className="text-sm text-[color:var(--color-ink)]">
                  reply inside 24h · if real
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                channels
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                <li>
                  <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover-underline text-[color:var(--color-ink)]">
                    github ↗
                  </a>
                </li>
                <li>
                  <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="hover-underline text-[color:var(--color-ink)]">
                    x / twitter ↗
                  </a>
                </li>
                <li>
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover-underline text-[color:var(--color-ink)]">
                    linkedin ↗
                  </a>
                </li>
                <li className="truncate">
                  <a href={`mailto:${profile.email}`} className="hover-underline text-[color:var(--color-ink)]">
                    email ↗
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
