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
  const discSize = size * 0.44;
  const iconSize = Math.round(discSize * 0.48);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* rotating label ring */}
      <div
        className="absolute inset-0"
        style={{ animation: "slow-spin 26s linear infinite" }}
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

      {/* center disc with arrow — theme-aware via tokens so it inverts cleanly */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="grid place-items-center rounded-full"
          style={{
            width: discSize,
            height: discSize,
            backgroundColor: "var(--color-ink)",
            color: "var(--color-bg)",
            boxShadow:
              "0 10px 30px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(var(--tone-fg),0.08)",
          }}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M7 17 L17 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 7 H17 V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
