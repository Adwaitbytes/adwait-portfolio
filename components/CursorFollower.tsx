"use client";
import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState<null | "link" | "drag">(null);

  useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) {
      document.body.classList.remove("custom-cursor-on");
      return;
    }
    setEnabled(true);

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let tx = rx;
    let ty = ry;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dx = e.clientX;
      dy = e.clientY;
      const el = e.target as HTMLElement | null;
      if (el) {
        const interactive = el.closest(
          'a, button, [role="button"], input, textarea, [data-cursor="link"]',
        );
        const drag = el.closest('[data-cursor="drag"]');
        if (drag) setHovering("drag");
        else if (interactive) setHovering("link");
        else setHovering(null);
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        data-cursor-mix
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
      <div
        ref={ringRef}
        data-cursor-ring
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-white/60 mix-blend-difference transition-[width,height,border-color,background] duration-200"
        style={{
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          background:
            hovering === "drag"
              ? "rgba(255,255,255,0.85)"
              : hovering === "link"
                ? "rgba(255,255,255,0.12)"
                : "transparent",
          borderColor:
            hovering === "drag" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
        }}
      />
    </>
  );
}
