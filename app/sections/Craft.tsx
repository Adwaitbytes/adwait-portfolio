"use client";
import { motion } from "motion/react";
import { craft } from "@/lib/data";

export default function Craft() {
  return (
    <section id="craft" className="relative border-t border-white/5 py-28 md:py-40">
      <div className="container-rail">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>04 — The kit</span>
          <span>seven tiers · ~40 tools</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="display-title mt-10 text-balance text-[12vw] leading-[0.9] md:text-[9vw] lg:text-[7.5vw]"
        >
          Opinionated, <br />
          not dogmatic.
        </motion.h2>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/55">
          Boring frame, sharp edges. Next.js where it fits, Rust where it
          matters, Solidity when on-chain state actually changes the product
          shape. I pick the stack after I pick the user.
        </p>

        <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
          {craft.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="group grid grid-cols-1 gap-6 py-6 transition-colors hover:bg-white/[0.01] md:grid-cols-[160px_200px_1fr] md:gap-10"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                  {c.items.length} tools
                </span>
              </div>
              <h3 className="display-title text-3xl text-white md:text-4xl">
                {c.title}
              </h3>
              <ul className="flex flex-wrap gap-1.5 md:justify-end">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] font-mono text-white/75"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
