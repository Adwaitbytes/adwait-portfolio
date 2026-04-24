"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav, profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function SiteNav() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      const y = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.width = "100%";
      return () => {
        const top = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(top || "0") * -1);
      };
    }
  }, [menuOpen]);

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
          className="ml-1 hidden rounded-full bg-[color:var(--color-ink)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-bg)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          Let's talk →
        </a>
        {/* mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="ml-1 grid h-8 w-8 place-items-center rounded-full text-[color:var(--color-ink)] md:hidden"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* mobile menu sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[80] md:hidden"
            style={{ background: "rgba(var(--tone-bg), 0.92)", backdropFilter: "blur(16px)" }}
          >
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 mt-20 rounded-3xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.96)] p-5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ink-mute)]">
                  menu
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--color-ink-dim)]"
                >
                  <X size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {nav.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`#${n.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-base transition-colors",
                        active === n.id
                          ? "bg-[color:rgba(var(--tone-fg),0.06)] text-[color:var(--color-ink)]"
                          : "text-[color:var(--color-ink-dim)] hover:text-[color:var(--color-ink)]",
                      )}
                    >
                      <span>{n.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
                        #{n.id}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-ink)] px-4 py-3 text-sm font-medium text-[color:var(--color-bg)]"
              >
                Let's talk →
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
