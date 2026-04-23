import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  className,
}: {
  items: React.ReactNode[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div className="marquee">
        {doubled.map((node, i) => (
          <div key={i} className="flex shrink-0 items-center gap-3">
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
