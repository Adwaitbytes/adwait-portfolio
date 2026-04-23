"use client";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

function useIstTime() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour12: false,
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function StatusBar() {
  const time = useIstTime();
  return (
    <div className="fixed left-0 right-0 top-0 z-40 hidden h-6 items-center justify-between border-b border-[var(--color-border)] bg-[rgba(5,5,7,0.85)] px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)] backdrop-blur md:flex">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          available · open to roles
        </span>
        <span className="hidden lg:block opacity-70">
          {profile.location} · IST {time || "—"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden lg:block opacity-70">
          v1.0.0 · build edge
        </span>
        <span className="opacity-70">⌘K for commands</span>
      </div>
    </div>
  );
}
