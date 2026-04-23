"use client";
const TEXT = "AVAILABLE FOR WORK · OPEN TO ROLES · BHOPAL → WORLD · ";

export default function CircleBadge({
  size = 140,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const radius = size / 2 - 10;
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 animate-[slow-spin_26s_linear_infinite]"
        style={{ animationDuration: "26s" }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <defs>
            <path
              id="circle-badge-path"
              d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>
          <text
            fill="currentColor"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.088}
            letterSpacing={size * 0.028}
          >
            <textPath
              href="#circle-badge-path"
              startOffset="0"
              textLength={2 * Math.PI * radius}
            >
              {TEXT + TEXT}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="grid place-items-center rounded-full bg-white text-black"
          style={{ width: size * 0.44, height: size * 0.44, fontSize: size * 0.22 }}
        >
          <svg width={size * 0.22} height={size * 0.22} viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
