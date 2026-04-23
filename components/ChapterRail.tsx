"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const CHAPTERS = [
  { id: "home", label: "01 · Index" },
  { id: "showcase", label: "02 · Showcase" },
  { id: "about", label: "03 · Operator" },
  { id: "craft", label: "04 · Kit" },
  { id: "timeline", label: "05 · Trace" },
  { id: "writing", label: "06 · Signals" },
  { id: "faq", label: "07 · FAQ" },
  { id: "contact", label: "08 · Contact" },
];

export default function ChapterRail() {
  const [active, setActive] = useState("home");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <div className="relative flex flex-col items-start gap-3">
        {CHAPTERS.map((c) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="pointer-events-auto group relative flex items-center gap-3"
            >
              <span
                className={`relative h-px bg-white/35 transition-all duration-300 ${isActive ? "w-8 bg-white" : "w-3 group-hover:w-6"}`}
              />
              <span
                className="pointer-events-none whitespace-nowrap rounded-md bg-black/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/0 opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur transition-all duration-300 group-hover:text-white group-hover:opacity-100"
              >
                {c.label}
              </span>
            </a>
          );
        })}
        {/* progress rail */}
        <div className="absolute left-0 top-0 h-full w-px bg-white/10" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 w-px origin-top bg-white"
          style={{ scaleY: progress, height: "100%" }}
        />
      </div>
    </aside>
  );
}
