"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("adwait:theme") as Theme | null) ?? "dark";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    document.documentElement.style.setProperty("--theme-cx", `${cx}px`);
    document.documentElement.style.setProperty("--theme-cy", `${cy}px`);

    const commit = () => {
      applyTheme(next);
      setTheme(next);
      localStorage.setItem("adwait:theme", next);
    };

    // Use View Transitions API when available for the cinematic circle-clip
    const startVT = (document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    }).startViewTransition;
    if (typeof startVT === "function") {
      startVT.call(document, commit);
    } else {
      commit();
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Sunrise" : "Nightfall"}
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-ink-dim)] transition-colors hover:bg-[rgba(var(--tone-fg),0.06)] hover:text-[var(--color-ink)]"
    >
      <span className="sr-only">{isDark ? "Light" : "Dark"}</span>
      {isDark ? <Sun size={14} strokeWidth={1.7} /> : <Moon size={14} strokeWidth={1.7} />}
    </button>
  );
}
