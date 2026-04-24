"use client";
import { motion } from "motion/react";
import ScrambleText from "./ScrambleText";

export default function SceneDivider({
  index,
  title,
  subtitle,
  accent = "rgba(244,211,94,0.45)",
}: {
  index: string; // "SCENE 02"
  title: string; // "SHOWCASE"
  subtitle?: string;
  accent?: string;
}) {
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-white/8 bg-[#050507] py-14 md:py-20"
    >
      {/* film sprocket edges */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex h-3 items-center gap-2 px-2"
        aria-hidden
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-3 rounded-sm bg-white/12"
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3 items-center gap-2 px-2"
        aria-hidden
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-3 rounded-sm bg-white/12"
          />
        ))}
      </div>

      {/* central radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at 50% 50%, ${accent}, transparent 70%)`,
          opacity: 0.25,
        }}
      />

      <div className="container-rail relative grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/50"
        >
          {index}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden text-center"
        >
          <h2 className="display-title text-[14vw] leading-[0.9] text-white md:text-[8vw] lg:text-[6.5vw]">
            <ScrambleText text={title} speed={28} />
          </h2>
          {subtitle && (
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.32em] text-white/45">
              — {subtitle} —
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="flex justify-end gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white/50 md:justify-end"
        >
          <span>24 fps</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">adwait.reel</span>
        </motion.div>
      </div>
    </section>
  );
}
