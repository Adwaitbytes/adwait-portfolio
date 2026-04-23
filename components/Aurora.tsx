export default function Aurora({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-1/3 left-1/4 h-[60vw] w-[60vw] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "conic-gradient(from 120deg at 50% 50%, rgba(244,211,94,0.6), rgba(255,127,80,0.3), rgba(216,180,254,0.4), rgba(125,211,252,0.5), rgba(244,211,94,0.6))",
          animation: "aurora-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] h-[45vw] w-[45vw] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(125,211,252,0.7), rgba(125,211,252,0) 60%)",
          animation: "aurora-drift 30s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
