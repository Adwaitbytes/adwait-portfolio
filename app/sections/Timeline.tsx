"use client";
import { motion } from "motion/react";
import { timeline } from "@/lib/data";

export default function Timeline() {
  return (
    <section id="timeline" className="relative border-t border-white/5 py-28 md:py-40">
      <div className="container-rail">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>05 — Trace</span>
          <span>A log of shipping</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="display-title mt-10 text-balance text-[12vw] leading-[0.88] md:text-[9vw] lg:text-[7vw]"
        >
          Forward motion, <br />
          <span className="text-white/50">one commit at a time.</span>
        </motion.h2>

        <div className="mt-20 space-y-2">
          {timeline.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group grid gap-6 border-t border-white/8 py-8 md:grid-cols-[160px_220px_1fr] md:gap-12"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
                  {t.when}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                  {t.org}
                </div>
              </div>
              <h3 className="display-title text-3xl text-white md:text-4xl">
                {t.title}
              </h3>
              <p className="max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
