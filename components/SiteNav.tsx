"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { nav, profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function SiteNav() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={cn(
        "fixed left-1/2 top-10 z-40 -translate-x-1/2 md:top-12",
        "transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full border p-1 pr-2 backdrop-blur-xl",
          "border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.45)]",
          scrolled && "border-[color:var(--color-border-strong)] bg-[color:rgba(var(--tone-bg),0.72)]",
        )}
      >
        <Link
          href="#home"
          className="ml-1 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tracking-tight"
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-4)] text-[10px] font-bold text-black">
            AK
          </span>
          <span className="hidden sm:inline">{profile.name.split(" ")[0]}</span>
        </Link>
        <div className="hidden h-5 w-px bg-[color:var(--color-border)] md:block" />
        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((n) => (
            <Link
              key={n.id}
              href={`#${n.id}`}
              className={cn(
                "relative rounded-full px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]",
                active === n.id && "text-[var(--color-ink)]",
              )}
            >
              {active === n.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-[color:rgba(var(--tone-fg),0.08)]"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative">{n.label}</span>
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <a
          href="#contact"
          className="ml-1 rounded-full bg-[color:var(--color-ink)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-bg)] transition-transform hover:-translate-y-0.5"
        >
          Let's talk →
        </a>
      </div>
    </motion.header>
  );
}
