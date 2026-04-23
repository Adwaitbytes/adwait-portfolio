"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const statusCopy = {
    live: "live · shipping",
    beta: "public beta",
    wip: "work in progress",
    archived: "archived",
  } as const;

  return (
    <motion.a
      href={project.href ?? "#"}
      target={project.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      style={{
        transformStyle: "preserve-3d",
        rotateX: rx,
        rotateY: ry,
      }}
      data-cursor="link"
      className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-bg-raised)]/80 p-6 transition-colors hover:border-white/25 md:p-7"
    >
      {/* gradient aura */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40",
          project.accent,
        )}
      />
      {/* index */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          P/{String(index + 1).padStart(2, "0")} · {project.year}
        </span>
        {project.status && (
          <span
            className={cn(
              "chip",
              project.status === "live" && "chip-live text-white",
              project.status === "beta" && "text-[var(--color-accent-3)]",
              project.status === "wip" && "text-[var(--color-warn)]",
            )}
          >
            {statusCopy[project.status]}
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="display-title text-3xl text-white md:text-4xl">
            {project.name}
          </h3>
          <div className="mt-1 font-mono text-xs text-white/55">
            {project.kicker}
          </div>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 transition-all group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-white/70 md:text-[15px]">
        {project.summary}
      </p>

      <ul className="mt-5 space-y-1.5 text-xs text-white/60">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/40" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] font-mono text-white/65"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.a>
  );
}
