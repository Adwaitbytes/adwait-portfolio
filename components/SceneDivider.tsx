"use client";
import { motion } from "motion/react";
import ScrambleText from "./ScrambleText";
import Starfield from "./Starfield";

/**
 * Intermission-style divider between scenes. DARK-LOCKED in both themes by
 * design — these are film "cuts." All colors are raw hex/rgba so the global
 * light-mode override cannot flip them.
 */
export default function SceneDivider({
  index,
  title,
  subtitle,
  accent = "rgba(244,211,94,0.45)",
}: {
  index: string;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <section
      aria-hidden
      className="relative overflow-hidden py-14 md:py-20"
      style={{
        backgroundColor: "#050507",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* film sprocket edges */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex h-3 items-center gap-2 px-2"
        aria-hidden
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-3 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
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
            className="h-1.5 w-3 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
          />
        ))}
      </div>

      {/* parallax starfield drifting across the frame */}
      <Starfield density={1.2} accent="rgba(255,255,255,0.85)" />

      {/* central radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at 50% 50%, ${accent}, transparent 70%)`,
          opacity: 0.3,
        }}
      />

      <div className="container-rail relative grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: "rgba(255,255,255,0.55)" }}
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
          <h2
            className="display-title text-[14vw] leading-[0.9] md:text-[8vw] lg:text-[6.5vw]"
            style={{ color: "#ffffff" }}
          >
            <ScrambleText text={title} speed={28} />
          </h2>
          {subtitle && (
            <div
              className="mt-2 font-mono text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              — {subtitle} —
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="flex justify-end gap-3 font-mono text-[11px] uppercase tracking-[0.32em] md:justify-end"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <span>24 fps</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">adwait.reel</span>
        </motion.div>
      </div>
    </section>
  );
}
