"use client";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "▓█░▒@#%*+=-_/\\<>ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function ScrambleText({
  text,
  className,
  speed = 40,
  trigger = "view",
}: {
  text: string;
  className?: string;
  speed?: number;
  trigger?: "view" | "mount" | "hover";
}) {
  const [out, setOut] = useState<string>(text);
  const ref = useRef<HTMLSpanElement>(null);
  const running = useRef(false);

  const scramble = () => {
    if (running.current) return;
    running.current = true;
    const len = text.length;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const revealed = Math.min(len, Math.floor(i / 1.2));
      const scrambled = text
        .split("")
        .map((ch, idx) => {
          if (idx < revealed) return ch;
          if (ch === " ") return " ";
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setOut(scrambled);
      if (revealed >= len) {
        clearInterval(interval);
        setOut(text);
        running.current = false;
      }
    }, speed);
  };

  useEffect(() => {
    if (trigger === "mount") {
      scramble();
      return;
    }
    if (trigger === "view") {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              scramble();
              io.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
    >
      {out}
    </span>
  );
}
