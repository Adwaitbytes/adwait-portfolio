"use client";
import { motion } from "motion/react";
import { timeline } from "@/lib/data";

export default function Timeline() {
  return (
    <section id="timeline" className="relative border-t border-[color:var(--color-border)] py-20 md:py-40">
      <div className="container-rail">
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
          <span>05 — Trace</span>
          <span className="text-right">A log of shipping</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="display-title mt-10 text-balance text-[12vw] leading-[0.88] md:text-[9vw] lg:text-[7vw]"
        >
          Forward motion, <br />
          <span className="text-[color:var(--color-ink-dim)]">one commit at a time.</span>
        </motion.h2>

        <div className="mt-12 space-y-2 md:mt-20">
          {timeline.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group grid gap-3 border-t border-[color:var(--color-border)] py-7 md:grid-cols-[160px_220px_1fr] md:gap-12 md:py-8"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-ink-dim)]">
                  {t.when}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ink-mute)]">
                  {t.org}
                </div>
              </div>
              <h3 className="display-title text-2xl leading-tight text-[color:var(--color-ink)] sm:text-3xl md:text-4xl">
                {t.title}
              </h3>
              <p className="max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-ink-dim)] md:text-base">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
