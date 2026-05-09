"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { projects } from "@/lib/data";
import ProjectPoster from "@/components/ProjectPoster";
import TiltCard from "@/components/TiltCard";
import { ArrowUpRight } from "lucide-react";

type Kind =
  | "voxa"
  | "prophit"
  | "insiders"
  | "backerstage"
  | "melodex"
  | "stellaray"
  | "tempo-books"
  | "meridian"
  | "neurofocus"
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
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[color:var(--color-bg)]">
        {/* rails */}
        <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 md:top-8 md:px-10">
          <div className="min-w-0 truncate font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--color-ink-dim)] sm:text-[10px] sm:tracking-[0.3em]">
            02 — Showcase · {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)] md:block">
            {projects[active].tags.join(" · ")}
          </div>
        </div>

        {/* progress bar */}
        <div className="absolute inset-x-4 top-[60px] z-20 sm:inset-x-6 sm:top-[68px] md:inset-x-10 md:top-[72px]">
          <div className="relative h-px w-full overflow-hidden bg-[color:rgba(var(--tone-fg),0.12)]">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[color:var(--color-ink)]"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
          <div className="mt-3 flex gap-1.5">
            {projects.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] flex-1 transition-colors ${
                  i <= active
                    ? "bg-[color:rgba(var(--tone-fg),0.82)]"
                    : "bg-[color:rgba(var(--tone-fg),0.15)]"
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
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-5 pt-12 sm:px-6 sm:pb-6 sm:pt-16 md:px-10 md:pb-10 md:pt-20"
          style={{
            background:
              "linear-gradient(to top, rgba(var(--tone-veil), 1) 0%, rgba(var(--tone-veil), 0.88) 55%, transparent 100%)",
          }}
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div className="min-w-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] sm:text-[10px] sm:tracking-[0.3em]">
                Now viewing
              </div>
              <motion.div
                key={projects[active].name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:gap-x-4"
              >
                <span className="font-display text-3xl text-[color:var(--color-ink)] sm:text-4xl md:text-6xl">
                  {projects[active].name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-dim)] sm:text-[11px] sm:tracking-[0.22em]">
                  {projects[active].kicker}
                </span>
              </motion.div>
              <motion.p
                key={`s-${projects[active].slug}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 max-w-2xl text-[12px] leading-relaxed text-[color:var(--color-ink-dim)] sm:mt-3 sm:text-[13px] md:text-sm"
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
              {projects[active].stack.slice(0, 4).map((s, i) => (
                <span
                  key={s}
                  className={`rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.04)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-ink-dim)] sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.2em] ${i >= 3 ? "hidden sm:inline-block" : ""}`}
                >
                  {s}
                </span>
              ))}
              {projects[active].stack.slice(4, 6).map((s) => (
                <span
                  key={s}
                  className="hidden rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.04)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-dim)] sm:inline-block"
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
  // Show the exact destination so the user knows where clicking leads.
  const dest = destLabel(project);
  return (
    <motion.a
      href={project.href ?? "#"}
      target={project.href ? "_blank" : undefined}
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={`${project.name} — ${dest.verb} ${dest.domain}`}
      title={`${dest.verb}: ${project.href ?? ""}`}
      className="group relative block h-[72vh] w-[78vw] shrink-0 md:w-[62vw]"
      animate={{
        scale: active ? 1 : 0.94,
        filter: active ? "brightness(1)" : "brightness(0.55)",
      }}
      transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
      style={{ perspective: 1200 }}
    >
      <TiltCard
        max={active ? 8 : 0}
        className="relative h-full w-full overflow-hidden rounded-3xl border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
      >
        <ProjectPoster kind={project.slug as Kind} />

        {/* top rail — slim gradient over the card's own dark mockup chrome */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent"
        />
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-2 sm:inset-x-6 sm:top-5 md:inset-x-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 sm:text-[10px] sm:tracking-[0.3em]">
            P/{String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 sm:text-[10px] sm:tracking-[0.3em]">
            {project.year}
            {project.status ? ` · ${project.status}` : ""}
          </span>
        </div>

        {/* destination pill — ground truth for where this link points */}
        <div className="pointer-events-none absolute inset-x-4 bottom-24 z-10 flex justify-start sm:inset-x-6 sm:bottom-28 md:inset-x-8">
          <span
            className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 backdrop-blur sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.24em]"
            style={{ transform: "translateZ(40px)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  dest.kind === "live" ? "#72efc0" : dest.kind === "case-study" ? "#f4d35e" : "#d8b4fe",
              }}
            />
            {dest.verb} · {dest.domain}
          </span>
        </div>

        {/* hover CTA */}
        <div
          className="pointer-events-none absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-3 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 md:right-8"
          style={{ transform: "translateZ(55px)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
            {dest.verb}
          </span>
          <ArrowUpRight size={16} />
        </div>
      </TiltCard>
    </motion.a>
  );
}

function destLabel(p: (typeof projects)[number]): {
  verb: "Open live" | "View source" | "View case";
  domain: string;
  kind: "live" | "repo" | "case-study";
} {
  const kind = p.linkType ?? (p.href?.includes("github.com") ? "repo" : "live");
  const domain = prettyDomain(p.href ?? "");
  const verb =
    kind === "live" ? "Open live" : kind === "case-study" ? "View case" : "View source";
  return { verb, domain, kind };
}

function prettyDomain(href: string) {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "github.com") {
      // github.com/owner/repo → repo
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[1] ? `github · ${parts[1]}` : "github";
    }
    return host;
  } catch {
    return href;
  }
}
