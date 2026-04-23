import Marquee from "@/components/Marquee";

const WORDS = [
  "IIT Madras",
  "Bhopal DAO",
  "AarambhLabs",
  "Arweave India",
  "OnchAIn Island",
  "Loops · Hacker House Delhi",
  "ETH Builders Day",
  "AthenaF0SS",
  "Redacted Hackathon",
  "GerminaLabs",
  "Story Protocol",
  "Stellar",
  "Mantle",
];

export default function MarqueeBand() {
  const items = WORDS.map((w, i) => (
    <div key={i} className="flex items-center gap-4 pr-8">
      <span className="font-display text-5xl font-medium tracking-tight text-white md:text-7xl">
        {w}
      </span>
      <span className="h-2 w-2 rounded-full bg-white/30" />
    </div>
  ));

  return (
    <section
      aria-hidden
      className="relative border-y border-white/10 bg-[var(--color-bg)] py-8"
    >
      <Marquee items={items} />
    </section>
  );
}
