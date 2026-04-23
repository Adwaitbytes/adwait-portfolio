"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { projects } from "@/lib/data";
import ProjectPoster from "@/components/ProjectPoster";
import { ArrowUpRight } from "lucide-react";

type Kind =
  | "melodex"
  | "stellaray"
  | "tempo-books"
  | "meridian"
  | "neurofocus"
  | "claude-mem"
  | "worldmonitor"
  | "mindwell";

export default function Showcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const n = projects.length;
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const compute = () => {
      // card width + gap (mobile / desktop)
      const vw = window.innerWidth;
      const isMd = vw >= 768;
      const cardW = vw * (isMd ? 0.62 : 0.78);
      const gap = isMd ? 24 : 24; // gap-6 in both
      setShift((n - 1) * (cardW + gap));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [n]);

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const x = useSpring(xRaw, { stiffness: 140, damping: 26, mass: 0.5 });

  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const i = Math.round(v * (n - 1));
      setActive(Math.max(0, Math.min(n - 1, i)));
    });
    return () => unsub();
  }, [scrollYProgress, n]);

  return (
    <section id="showcase" ref={stageRef} className="relative" style={{ height: `${n * 85}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {/* rails */}
        <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex items-center justify-between px-6 md:top-8 md:px-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            02 — Showcase · {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">
            {projects[active].tags.join(" · ")}
          </div>
        </div>

        {/* progress bar */}
        <div className="absolute inset-x-6 top-[68px] z-20 md:inset-x-10 md:top-[72px]">
          <div className="relative h-px w-full overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
          <div className="mt-3 flex gap-1.5">
            {projects.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] flex-1 transition-colors ${
                  i <= active ? "bg-white/80" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* horizontal track */}
        <motion.div
          className="flex h-full items-center gap-6 pl-[11vw] pr-[11vw] pt-24 md:gap-6"
          style={{ x }}
        >
          {projects.map((p, i) => (
            <ShowcaseCard
              key={p.slug}
              index={i}
              total={n}
              project={p}
              active={i === active}
            />
          ))}
        </motion.div>

        {/* bottom rail — full narrative */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/85 to-transparent px-6 pb-6 pt-16 md:px-10 md:pb-10 md:pt-20">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                Now viewing
              </div>
              <motion.div
                key={projects[active].name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1"
              >
                <span className="font-display text-4xl text-white md:text-6xl">
                  {projects[active].name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                  {projects[active].kicker}
                </span>
              </motion.div>
              <motion.p
                key={`s-${projects[active].slug}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/70 md:text-sm"
              >
                {projects[active].summary}
              </motion.p>
            </div>

            <motion.div
              key={`t-${projects[active].slug}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex flex-wrap gap-1.5 md:justify-end"
            >
              {projects[active].stack.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75"
                >
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  project,
  index,
  total,
  active,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
  active: boolean;
}) {
  return (
    <motion.a
      href={project.href ?? "#"}
      target={project.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-cursor="link"
      className="group relative block h-[72vh] w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 md:w-[62vw]"
      animate={{
        scale: active ? 1 : 0.94,
        filter: active ? "brightness(1)" : "brightness(0.55)",
      }}
      transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <ProjectPoster kind={project.slug as Kind} />

      {/* top rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-6 top-5 flex items-center justify-between md:inset-x-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
          P/{String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
          {project.year}
          {project.status ? ` · ${project.status}` : ""}
        </span>
      </div>

      {/* hover CTA */}
      <div className="pointer-events-none absolute right-6 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/40 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 md:right-8 md:h-16 md:w-16">
        <ArrowUpRight size={20} />
      </div>
    </motion.a>
  );
}
