"use client";
import { motion } from "motion/react";
import { signals } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Signals() {
  return (
    <section id="writing" className="relative border-t border-white/5 py-28 md:py-40">
      <div className="container-rail">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>06 — Signals</span>
          <span>Public bets · fresh takes</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="display-title mt-10 text-balance text-[12vw] leading-[0.88] md:text-[9vw] lg:text-[7vw]"
        >
          Where the world <br />
          is <span className="italic text-white/55 font-normal">clearly</span> wrong.
        </motion.h2>

        <div className="mt-20 divide-y divide-white/10 border-y border-white/10">
          {signals.map((s, i) => (
            <motion.a
              key={s.title}
              href="#contact"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group grid grid-cols-1 gap-4 py-10 transition-colors md:grid-cols-[140px_1fr_auto] md:gap-10"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
                  {s.tag} · {s.year}
                </span>
              </div>
              <div>
                <h3 className="display-title text-3xl leading-tight text-white transition-transform group-hover:translate-x-2 md:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
                  {s.blurb}
                </p>
              </div>
              <div className="self-end md:self-center">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white/60 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
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
