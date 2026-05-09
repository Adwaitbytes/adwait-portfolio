"use client";
import { motion } from "motion/react";
import { signals } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Signals() {
  return (
    <section id="writing" className="relative border-t border-[color:var(--color-border)] py-20 md:py-40">
      <div className="container-rail">
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
          <span>06 - Signals</span>
          <span className="text-right">Public bets · fresh takes</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="display-title mt-10 text-balance text-[12vw] leading-[0.88] md:text-[9vw] lg:text-[7vw]"
        >
          Where the world <br />
          is <span className="italic text-[color:var(--color-ink-dim)] font-normal">clearly</span> wrong.
        </motion.h2>

        <div className="mt-12 divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)] md:mt-20">
          {signals.map((s, i) => (
            <motion.a
              key={s.title}
              href="#contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group grid grid-cols-1 gap-3 py-7 transition-colors md:grid-cols-[140px_1fr_auto] md:gap-10 md:py-10"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-h-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-dim)]">
                  {s.tag} · {s.year}
                </span>
              </div>
              <div>
                <h3 className="display-title text-2xl leading-tight text-[color:var(--color-ink)] transition-transform group-hover:translate-x-2 sm:text-3xl md:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-ink-dim)]">
                  {s.blurb}
                </p>
              </div>
              <div className="self-start md:self-center">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-ink-dim)] transition-all group-hover:border-[color:var(--color-ink)] group-hover:bg-[color:var(--color-ink)] group-hover:text-[color:var(--color-bg)] md:h-12 md:w-12">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
