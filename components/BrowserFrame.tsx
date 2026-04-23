export default function BrowserFrame({
  url,
  children,
  accent = "rgba(255,255,255,0.08)",
  className = "",
}: {
  url: string;
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/12 bg-[#0b0b10] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${className}`}
      style={{ outline: `1px solid ${accent}`, outlineOffset: -1 }}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#0f0f15] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c841]" />
        <div className="mx-auto flex min-w-0 max-w-[420px] items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
          <span className="h-1 w-1 rounded-full bg-[var(--color-success)]" />
          <span className="truncate">{url}</span>
        </div>
        <span className="ml-auto font-mono text-[10px] text-white/30">⌘R</span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
