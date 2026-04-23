export const profile = {
  name: "Adwait Keshari",
  handle: "@AdwaitKeshari",
  location: "Bhopal, India",
  role: "Full-Stack Engineer · Web3 Explorer",
  tagline:
    "I build at the seam of AI, cryptography, and product — turning hard primitives into things humans actually want to use.",
  subtagline:
    "Currently shipping from IIT Madras. Midnight debugger. 3× hackathon builder. Community-lead energy.",
  email: "adwaitkeshari288@gmail.com",
  resumeHref: "#contact",
  social: {
    github: "https://github.com/Adwaitbytes",
    twitter: "https://x.com/AdwaitKeshari",
    linkedin: "https://www.linkedin.com/in/adwait-keshari-b5793b294/",
    portfolio: "https://adwaitbytes.github.io/",
  },
  stats: [
    { label: "Shipped prod", value: "11" },
    { label: "Public repos", value: "83+" },
    { label: "Client work", value: "paid" },
    { label: "Midnight", value: "∞" },
  ],
} as const;

export const nav = [
  { id: "home", label: "Index" },
  { id: "showcase", label: "Showcase" },
  { id: "about", label: "About" },
  { id: "craft", label: "Craft" },
  { id: "timeline", label: "Trace" },
  { id: "writing", label: "Signals" },
  { id: "contact", label: "Contact" },
] as const;

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  year: string;
  summary: string;
  highlights: string[];
  stack: string[];
  tags: string[];
  accent: string; // tailwind accent class prefix
  href?: string;
  status?: "live" | "beta" | "archived" | "wip";
};

export const projects: Project[] = [
  {
    slug: "prophit",
    name: "Prophit",
    kicker: "AI-native prediction markets on Solana",
    year: "2026",
    summary:
      "A single sentence of conviction becomes a capital-allocating autonomous agent. Users fund an AI agent with a thesis; it trades YES/NO on Solana-native markets 24/7 — with live reference prices from Polymarket and Manifold.",
    highlights: [
      "Solana Anchor program (13 instructions) with commit-reveal resolution, TVL caps, 2% slippage guard, 30% drawdown auto-pause and on-chain copy royalties",
      "Groq Llama 3.3 70B thesis parser + 60s trading worker with reasoning logs and house counter-agent for liquidity",
      "Phantom SIWS auth, live alpha feed (SSE), View-Transitions theming, 35+ mirrored Polymarket + Manifold markets",
    ],
    stack: [
      "Solana Anchor",
      "Next.js 14",
      "Groq",
      "Neon + Drizzle",
      "Phantom SIWS",
      "Framer Motion",
    ],
    tags: ["Solana", "AI", "DeFi"],
    accent: "from-fuchsia-400 via-violet-400 to-sky-400",
    href: "https://prophit-solana.vercel.app/app/explore",
    status: "live",
  },
  {
    slug: "insiders",
    name: "insiders.bot",
    kicker: "Prediction markets · client work @ AarambhLabs",
    year: "2026",
    summary:
      "Zero-delay prediction-market platform for crypto, politics, sports and creators. UP/DOWN markets, copy-trading, wallet-native deposits and an always-on live feed. Shipped for a paying client under AarambhLabs.",
    highlights: [
      "Live-markets grid with sub-minute refresh across 80+ active markets",
      "Wallet-native deposits + copy-trading engine with follower-delay mitigation",
      "Multi-category markets (price, politics, sports, creator metrics) unified under one orderbook UI",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Node",
      "Viem",
      "Postgres",
      "Websockets",
    ],
    tags: ["Fintech", "Web3", "Client work"],
    accent: "from-emerald-300 via-lime-400 to-amber-300",
    href: "https://insiders.bot",
    status: "live",
  },
  {
    slug: "backerstage",
    name: "BackerStage Capital",
    kicker: "14-day MVP sprint · big VC firm · @ AarambhLabs",
    year: "2025",
    summary:
      "MVP Sprint for a major VC firm — complete platform shipped end-to-end in 14 days. Core deal-flow surfaces, invite-only access, and a production deployment on Vercel. Built as the engineering lead under AarambhLabs.",
    highlights: [
      "Concept → production in 14 days with a senior-led team of 3",
      "Core deal-flow + invite surfaces with auth, admin, and analytics built in",
      "Shipped against a fixed scope for a named VC firm — real client, real revenue",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    tags: ["MVP", "Client work", "VC"],
    accent: "from-indigo-400 via-violet-400 to-fuchsia-400",
    href: "https://www.aarambhlabs.tech/work",
    status: "live",
  },
  {
    slug: "melodex",
    name: "Melodex",
    kicker: "Programmable-IP · Story Protocol",
    year: "2025",
    summary:
      "Universal creative-IP registry and marketplace. Mint, license and automate royalties on-chain — with AI tooling to generate art and metadata at registration time.",
    highlights: [
      "One-click registration via Story Protocol SDK with cryptographic proof-of-creation",
      "Multi-provider AI stack (Stability, Gemini, Replicate) with automatic failover",
      "Glass-morphism creator dashboard + admin moderation panel",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Story Protocol",
      "Wagmi / Viem",
      "IPFS",
      "Framer Motion",
    ],
    tags: ["Web3", "AI", "Product"],
    accent: "from-fuchsia-400 via-pink-400 to-rose-400",
    href: "https://github.com/Adwaitbytes/Programmable-IP",
    status: "live",
  },
  {
    slug: "stellaray",
    name: "StellaRay",
    kicker: "ZK Auth · Stellar Protocol 25",
    year: "2025",
    summary:
      "Sign in with Google, receive a self-custodial wallet. No seed phrases, no extensions. Zero-knowledge proofs bridge Web2 identity to deterministic Stellar addresses.",
    highlights: [
      "Poseidon hashing + Circom circuits so the same Google identity → same wallet, but unlinkable on-chain",
      "Dropped per-login verification cost from ~$0.50 → $0.03 using native EC ops",
      "Streaming payments, payment links, Shamir-based recovery",
    ],
    stack: ["TypeScript", "Rust", "Soroban", "Circom", "Stellar"],
    tags: ["Cryptography", "Web3", "Infra"],
    accent: "from-cyan-300 via-sky-400 to-blue-500",
    href: "https://github.com/Adwaitbytes/StellaRay",
    status: "beta",
  },
  {
    slug: "tempo-books",
    name: "Tempo Books",
    kicker: "QuickBooks, for on-chain money",
    year: "2025",
    summary:
      "Full-stack accounting & invoicing for stablecoin-first businesses. Auto-reconciles on-chain payments, splits tax reserves, dispatches 50+ payouts in under a second.",
    highlights: [
      "Invoice memo-ID system auto-matches `transferWithMemo` payments",
      "Batch payouts using Tempo's 2D nonce architecture",
      "Recurring invoices, DEX swaps, period-based reporting, CSV export",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Prisma",
      "Neon Postgres",
      "Privy",
      "Tempo SDK",
    ],
    tags: ["Fintech", "Web3", "Full-stack"],
    accent: "from-emerald-300 via-teal-400 to-cyan-500",
    href: "https://github.com/Adwaitbytes/Tempo-Book",
    status: "live",
  },
  {
    slug: "meridian",
    name: "Meridian Protocol",
    kicker: "Private RWA infra on Mantle",
    year: "2025",
    summary:
      "Mantle-native platform tokenizing real-world assets with privacy-first ZK-KYC and composable yield strategies. Institutions onboard without leaking PII on-chain.",
    highlights: [
      "ZK-KYC gating that proves jurisdiction + accreditation without revealing identity",
      "Composable yield vaults with per-asset risk primitives",
      "Designed for regulated deployments from day one",
    ],
    stack: ["TypeScript", "Solidity", "Mantle", "ZK", "Hardhat"],
    tags: ["DeFi", "ZK", "Compliance"],
    accent: "from-amber-300 via-orange-400 to-rose-500",
    href: "https://github.com/Adwaitbytes/MERIDIAN-Protocol",
    status: "beta",
  },
  {
    slug: "neurofocus",
    name: "NeuroFocus",
    kicker: "Context-aware distraction blocker",
    year: "2025",
    summary:
      "Chrome extension built for neurodivergent users. Algorithmically blurs attention-hijacking UI (infinite feeds, autoplay, doomscroll patterns) while leaving useful surfaces intact.",
    highlights: [
      "Heuristic detection of feeds vs. intent-surfaces — not a blanket blocklist",
      "Respects your focus mode; adapts over a session",
      "Zero telemetry: runs entirely on-device",
    ],
    stack: ["TypeScript", "Chrome APIs", "MV3"],
    tags: ["Accessibility", "AI", "Chrome"],
    accent: "from-violet-300 via-purple-400 to-indigo-500",
    href: "https://github.com/Adwaitbytes/NeuroFocus",
    status: "live",
  },
  {
    slug: "claude-mem",
    name: "claude-mem",
    kicker: "Memory for Claude coding sessions",
    year: "2026",
    summary:
      "Plugin that captures coding sessions, compresses them with AI, and rehydrates relevant context into future conversations — so the assistant stops forgetting.",
    highlights: [
      "Session-level compaction with topic-aware chunking",
      "Works across repos; zero-config install",
      "Designed for the long tail of `why did we do it this way?`",
    ],
    stack: ["TypeScript", "Claude", "Node"],
    tags: ["Developer tools", "AI", "OSS"],
    accent: "from-slate-200 via-zinc-300 to-slate-400",
    href: "https://github.com/Adwaitbytes/claude-mem",
    status: "wip",
  },
  {
    slug: "worldmonitor",
    name: "worldmonitor",
    kicker: "AI global-intelligence dashboard",
    year: "2025",
    summary:
      "Live situational-awareness board combining news aggregation, geopolitical monitoring and infrastructure tracking into one dense, defensible view.",
    highlights: [
      "Multi-source fusion with dedup + stance detection",
      "Latency-first architecture — the point is being early",
      "Extensible `feed` primitive for new data sources",
    ],
    stack: ["TypeScript", "Next.js", "LLMs", "Vector search"],
    tags: ["AI", "Data", "Product"],
    accent: "from-green-300 via-lime-400 to-yellow-400",
    href: "https://github.com/Adwaitbytes/worldmonitor",
    status: "beta",
  },
  {
    slug: "mindwell",
    name: "mindwell",
    kicker: "Cinematic mental-health landing",
    year: "2024",
    summary:
      "A Three.js-powered mental health awareness site that treats the subject with the weight it deserves. Scroll-driven 3D scenes, soft typography, careful motion.",
    highlights: [
      "GPU-accelerated Three.js scenes tied to scroll progress",
      "Accessibility-first copy reviewed with domain experts",
      "Shipped to production for a campus initiative",
    ],
    stack: ["Next.js", "Three.js", "Framer Motion"],
    tags: ["Web", "3D", "Design"],
    accent: "from-pink-200 via-rose-300 to-fuchsia-400",
    href: "https://github.com/Adwaitbytes/mindwell",
    status: "live",
  },
];

export const craft = [
  {
    title: "Languages",
    items: [
      "TypeScript",
      "Rust",
      "Python",
      "Go",
      "Solidity",
      "C++",
      "Java",
    ],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Tailwind", "Three.js", "Framer Motion", "shadcn/ui"],
  },
  {
    title: "Backend & Data",
    items: [
      "Node.js",
      "FastAPI",
      "GraphQL",
      "PostgreSQL / Neon",
      "Prisma",
      "Redis",
      "MongoDB",
    ],
  },
  {
    title: "AI / Agents",
    items: [
      "Claude Code",
      "Agent SDKs",
      "Vector search",
      "Retrieval pipelines",
      "Browser Use",
      "Replicate / Gemini",
    ],
  },
  {
    title: "Web3 & Crypto",
    items: [
      "Story Protocol",
      "Stellar / Soroban",
      "Mantle",
      "Hardhat",
      "Viem / Wagmi",
      "Circom / ZK",
      "IPFS",
    ],
  },
  {
    title: "Cloud & DevOps",
    items: ["Vercel", "AWS", "GCP", "Docker", "Kubernetes", "GitHub Actions"],
  },
] as const;

export const timeline = [
  {
    when: "2026",
    title: "Prophit · AI-native prediction markets",
    org: "Solana · live",
    body: "Shipped a full Solana Anchor program + AI trading worker. One sentence of conviction becomes a capital-allocating autonomous agent trading 24/7.",
  },
  {
    when: "2026",
    title: "insiders.bot",
    org: "Client work · AarambhLabs",
    body: "Zero-delay prediction-market platform for crypto, politics, sports and creators. 80+ live markets, copy-trading, wallet-native deposits.",
  },
  {
    when: "2026",
    title: "claude-mem + agent-teams tooling",
    org: "Open source",
    body: "Developer tools that make coding agents actually remember — and coordinate — across sessions.",
  },
  {
    when: "2025 · Q4",
    title: "Meridian Protocol · OnchAIn Island",
    org: "Hacker house",
    body: "Selected for the OnchAIn Island hacker house. Shipped Meridian, a ZK-KYC RWA platform on Mantle.",
  },
  {
    when: "2025 · Q3",
    title: "Melodex · Tempo Books · StellaRay",
    org: "Shipping streak",
    body: "Three production-grade products in a quarter: IP on-chain, stablecoin accounting, ZK auth for Stellar.",
  },
  {
    when: "2025",
    title: "BackerStage Capital · MVP Sprint",
    org: "Client work · AarambhLabs",
    body: "14-day MVP Sprint for a major VC firm: deal-flow platform, auth, admin — concept to live production.",
  },
  {
    when: "2024 — now",
    title: "Community Lead",
    org: "Bhopal DAO · AarambhLabs",
    body: "Running ETH Builders Day (Bhopal), workshops, and shipping MVPs with the Aarambh team. 100+ products shipped org-wide.",
  },
  {
    when: "2024",
    title: "Hacker",
    org: "Arweave India · GerminaLabs",
    body: "Permanent-web and decentralized-infra builds. First paid Web3 contracts.",
  },
  {
    when: "Ongoing",
    title: "BS, Data Science & Applications",
    org: "IIT Madras",
    body: "Foundations in stats, ML and systems. BDM capstone shipped. Sahyog Club workshops organized.",
  },
] as const;

export const signals = [
  {
    title: "Wallets shouldn't require a manual",
    blurb:
      "The wallet UX debt is holding crypto back more than any throughput number. StellaRay is my argument that it doesn't have to.",
    tag: "Essay",
    year: "2025",
  },
  {
    title: "On-chain accounting is a product, not a feature",
    blurb:
      "Stablecoin payroll is here. The spreadsheet reconciliation isn't. Tempo Books is what it looks like when you treat the ledger like a real app surface.",
    tag: "Note",
    year: "2025",
  },
  {
    title: "Agents that remember are a different product",
    blurb:
      "Most coding-agent demos fall apart at turn 20. The missing piece is memory — not a bigger context window, but structured recall. That's what claude-mem is trying to prove.",
    tag: "Note",
    year: "2026",
  },
  {
    title: "Building in Bhopal",
    blurb:
      "You don't need to be in SF to ship. We've been running Bhopal DAO and ETH Builders Day to prove that — and the pipeline of builders coming out is real.",
    tag: "Talk",
    year: "2025",
  },
] as const;

export const faq = [
  {
    q: "What are you actually optimizing for?",
    a: "Shipping things that force a decision. Either the product is good enough that people reorganize their workflow around it, or the feedback is sharp enough that the next thing is obvious.",
  },
  {
    q: "What stack do you reach for first?",
    a: "Next.js + TypeScript + Postgres for product, Rust for the hot path, Solidity/Circom when on-chain state actually matters. I try hard not to pick the stack before I've understood the user.",
  },
  {
    q: "Are you looking for work?",
    a: "Open to founding-engineer / full-stack / applied-AI roles where I can own a surface end-to-end. Also open to contract work where scope is unambiguous and the product is real.",
  },
  {
    q: "Why the midnight-debugger thing?",
    a: "Because the best code of the day gets written after the Slack goes quiet.",
  },
] as const;

export const commands = [
  { id: "work", label: "View work", shortcut: "W", target: "#showcase" },
  { id: "craft", label: "Craft & stack", shortcut: "S", target: "#craft" },
  { id: "timeline", label: "Timeline", shortcut: "T", target: "#timeline" },
  { id: "signals", label: "Signals & writing", shortcut: "N", target: "#writing" },
  { id: "contact", label: "Contact", shortcut: "C", target: "#contact" },
  {
    id: "github",
    label: "Open GitHub",
    shortcut: "G",
    external: profile.social.github,
  },
  {
    id: "twitter",
    label: "Open X / Twitter",
    shortcut: "X",
    external: profile.social.twitter,
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    shortcut: "L",
    external: profile.social.linkedin,
  },
  {
    id: "mail",
    label: "Send an email",
    shortcut: "M",
    external: `mailto:${profile.email}`,
  },
] as const;
