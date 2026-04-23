"use client";
import { motion, useInView } from "motion/react";
import { ElementType, useRef } from "react";
import { cn } from "@/lib/utils";

export default function TextReveal({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)}>
      <span ref={ref} className="inline">
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="inline-block overflow-hidden align-bottom whitespace-nowrap"
            style={{ lineHeight: 1 }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{
                duration: 0.75,
                ease: [0.2, 0.9, 0.2, 1],
                delay: delay + i * stagger,
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
