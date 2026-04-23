"use client";
export default function OrbitRing({
  size = 520,
  text = "FULL-STACK · WEB3 · AI · CRYPTOGRAPHY · ",
  duration = 30,
  fontSize,
  opacity = 0.85,
}: {
  size?: number;
  text?: string;
  duration?: number;
  fontSize?: number;
  opacity?: number;
}) {
  const r = size / 2 - 6;
  const fs = fontSize ?? Math.max(10, size * 0.028);
  const c = size / 2;
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: `slow-spin ${duration}s linear infinite`,
        opacity,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <path
            id={`ring-${size}`}
            d={`M ${c}, ${c} m -${r}, 0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        <text
          fill="currentColor"
          fontFamily="var(--font-mono)"
          fontSize={fs}
          letterSpacing={fs * 0.28}
        >
          <textPath href={`#ring-${size}`} startOffset="0">
            {(text + text + text).slice(0, 400)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
