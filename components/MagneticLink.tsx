"use client";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  strength?: number;
};

export default function MagneticLink({
  href,
  children,
  className,
  external,
  strength = 18,
}: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  const common = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: reset,
    onBlur: reset,
    className: cn("magnetic-hover inline-flex items-center gap-1.5", className),
  } as const;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...common}>
      {children}
    </Link>
  );
}
