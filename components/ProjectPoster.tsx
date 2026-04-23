"use client";
import { motion } from "motion/react";
import BrowserFrame from "./BrowserFrame";

type Kind =
  | "prophit"
  | "insiders"
  | "backerstage"
  | "melodex"
  | "stellaray"
  | "tempo-books"
  | "meridian"
  | "neurofocus"
  | "claude-mem"
  | "worldmonitor"
  | "mindwell";

/* ───────── Prophit ───────── */
function Prophit() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 30%, rgba(192,132,252,0.4), transparent 55%), radial-gradient(90% 70% at 80% 90%, rgba(125,211,252,0.3), transparent 60%), linear-gradient(135deg,#10031b,#03020a)",
      }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <BrowserFrame
          url="prophit-solana.vercel.app/app/explore"
          accent="rgba(192,132,252,0.3)"
          className="w-full max-w-[88%]"
        >
          <div className="flex min-h-[260px] flex-col gap-3 bg-[#0b061a] p-4 md:min-h-[340px] md:p-5">
            {/* topbar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-400 via-fuchsia-400 to-sky-400" />
                <span className="font-display text-base font-medium text-white">
                  PROPHIT
                </span>
              </div>
              <span className="ml-auto flex items-center gap-2 rounded-full bg-violet-400/12 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
                <span className="h-1 w-1 animate-pulse rounded-full bg-violet-300" />
                solana devnet · live
              </span>
              <span className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/70 md:inline">
                phantom · 7Hk…aP9
              </span>
            </div>

            {/* hero create-an-agent input */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                Thesis → autonomous agent
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[12px] text-white/85">
                  &ldquo;BTC closes above $112K by Friday — Fed minutes will be dovish.&rdquo;
                </div>
                <button className="rounded-md bg-white px-3 py-2 text-[11px] font-medium text-black">
                  Fund $50 →
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded-full bg-violet-400/12 px-2 py-0.5 font-mono uppercase tracking-[0.18em] text-violet-200">
                  parsed: BTC · YES · short-term
                </span>
                <span className="rounded-full bg-emerald-400/12 px-2 py-0.5 font-mono uppercase tracking-[0.18em] text-emerald-200">
                  reasoning: bullish
                </span>
              </div>
            </div>

            {/* market cards grid */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {[
                { q: "BTC > $112K · Fri", y: 64, n: 36, ext: "PM 61%", v: "$8.2k" },
                { q: "ETH > $3.4K · Sat", y: 41, n: 59, ext: "MAN 44%", v: "$3.1k" },
                { q: "Fed cut May FOMC?", y: 28, n: 72, ext: "PM 31%", v: "$14k" },
                { q: "SOL > $200 · Mon", y: 70, n: 30, ext: "PM 67%", v: "$5.5k" },
              ].map((m, i) => (
                <motion.div
                  key={m.q + i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: 0.05 * i }}
                  className="flex flex-col gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] p-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[12px] text-white/85">{m.q}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                      {m.v}
                    </span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-violet-400"
                      style={{ width: `${m.y}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-emerald-300">YES {m.y}%</span>
                    <span className="text-rose-300">NO {m.n}%</span>
                    <span className="text-violet-300">{m.ext}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* bottom alpha feed */}
            <div className="mt-auto flex items-center gap-3 border-t border-white/8 pt-3 font-mono text-[10px] text-white/55">
              <span className="rounded-full bg-violet-400/15 px-2 py-0.5 uppercase tracking-[0.2em] text-violet-200">
                alpha
              </span>
              <span className="truncate">
                agent <span className="text-white">@conviction-7</span> opened
                YES on <span className="text-white">BTC&gt;112K</span> · ${"42"}
                .50 USDC · royalty → @parent
              </span>
              <span className="ml-auto text-emerald-300">+2.4%</span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── BackerStage ───────── */
function BackerStage() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 70% 25%, rgba(99,102,241,0.4), transparent 55%), linear-gradient(135deg,#0a0a18,#04030a)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <BrowserFrame
          url="backerstage.capital · invite only"
          accent="rgba(129,140,248,0.28)"
          className="w-full max-w-[88%]"
        >
          <div className="flex min-h-[260px] flex-col gap-3 bg-[#080816] p-4 md:min-h-[340px] md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-indigo-400 to-violet-500 font-mono text-[10px] font-bold text-white">
                  B
                </span>
                <span className="font-display text-base text-white">
                  BackerStage Capital
                </span>
              </div>
              <div className="flex gap-2 text-[10px] text-white/55">
                <span className="rounded-md bg-indigo-400/12 px-2 py-1 text-indigo-200">
                  Deal-flow
                </span>
                <span className="rounded-md border border-white/10 px-2 py-1">
                  Portfolio
                </span>
                <span className="rounded-md border border-white/10 px-2 py-1">
                  LP room
                </span>
              </div>
            </div>

            {/* hero metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                ["$148M", "AUM"],
                ["32", "active deals"],
                ["7", "GP partners"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-lg border border-white/8 bg-white/[0.02] p-3"
                >
                  <div className="font-display text-2xl text-indigo-100">
                    {v}
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* deal pipeline */}
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 rounded-md font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>company</span>
              <span>thesis</span>
              <span>round</span>
              <span>status</span>
            </div>
            {[
              ["Stratafold", "AI infra", "Seed · $4M", "diligence"],
              ["Lumen Bio", "longevity dx", "A · $12M", "term sheet"],
              ["Helio Mesh", "edge AI", "Pre-seed · $1.5M", "passed"],
              ["Quanto Sports", "creator betting", "Seed · $6M", "active"],
            ].map(([c, th, r, st], i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
              >
                <span className="text-[12px] text-white">{c}</span>
                <span className="truncate text-[12px] text-white/65">{th}</span>
                <span className="font-mono text-[10px] text-white/55">{r}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${
                    st === "term sheet"
                      ? "bg-emerald-400/15 text-emerald-200"
                      : st === "passed"
                        ? "bg-rose-400/15 text-rose-200"
                        : st === "active"
                          ? "bg-indigo-400/15 text-indigo-200"
                          : "bg-amber-400/15 text-amber-200"
                  }`}
                >
                  {st}
                </span>
              </motion.div>
            ))}

            <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              <span>shipped in 14 days · MVP sprint</span>
              <span className="text-indigo-200">@ AarambhLabs</span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── insiders.bot ───────── */
function Insiders() {
  const markets = [
    { a: "BTC", q: "Up or Down · 6PM ET", up: 71, down: 29, vol: "$48k" },
    { a: "ETH", q: "Up or Down · 6PM ET", up: 97, down: 3, vol: "$6.1k" },
    { a: "SOL", q: "Up or Down · 7PM ET", up: 52, down: 48, vol: "$2.0k" },
    { a: "DOGE", q: "Up or Down · 7PM ET", up: 62, down: 38, vol: "$71" },
  ];
  const politics = [
    { q: "US × Iran diplomatic meeting by May 15?", y: 49, n: 51, vol: "$82k" },
    { q: "Strait of Hormuz traffic returns to normal?", y: 18, n: 82, vol: "$132k" },
  ];
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 20% 30%, rgba(52,211,153,0.35), transparent 55%), radial-gradient(90% 70% at 85% 95%, rgba(244,211,94,0.25), transparent 60%), linear-gradient(135deg,#04170f,#050508)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <BrowserFrame url="insiders.bot/markets" accent="rgba(52,211,153,0.25)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] flex-col gap-3 bg-[#070a0c] p-4 md:min-h-[340px] md:p-5">
            {/* top app bar */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-emerald-200">
                INSIDERS.BOT
              </span>
              <div className="ml-2 hidden items-center gap-3 text-[11px] text-white/45 md:flex">
                <span className="text-white">Home</span>
                <span>Signals</span>
                <span>Wallets</span>
                <span>Copy</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/12 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                  <span className="h-1 w-1 rounded-full bg-emerald-300 animate-pulse" />
                  live · 81
                </span>
                <span className="hidden rounded-md border border-white/10 px-2 py-1 text-white/70 md:inline">
                  Deposit
                </span>
                <span className="rounded-md bg-blue-500 px-2 py-1 text-white">
                  Get Pro
                </span>
              </div>
            </div>

            {/* market grid */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {markets.map((m, i) => (
                <motion.div
                  key={m.a + i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg border border-white/8 bg-white/[0.02] p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-sm text-white">
                        {m.a} · {m.q.split("·")[0]}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                        {m.q.split("·")[1]?.trim()}
                      </div>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                      {m.vol}
                    </span>
                  </div>
                  <div className="mt-2.5 flex h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${m.up}%` }}
                    />
                    <div
                      className="h-full bg-rose-400/80"
                      style={{ width: `${m.down}%` }}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
                    <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-center font-mono uppercase tracking-[0.14em] text-emerald-200">
                      UP · {m.up}%
                    </span>
                    <span className="rounded-md bg-rose-400/15 px-2 py-1 text-center font-mono uppercase tracking-[0.14em] text-rose-200">
                      DOWN · {m.down}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* politics row */}
            <div className="mt-1 grid grid-cols-1 gap-2 md:grid-cols-2">
              {politics.map((p, i) => (
                <motion.div
                  key={p.q}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-lg border border-white/8 bg-gradient-to-r from-amber-400/6 to-transparent px-3 py-2.5"
                >
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-amber-200">
                    politics
                  </span>
                  <span className="flex-1 truncate text-[12px] text-white/85">
                    {p.q}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-300">
                    YES {p.y}%
                  </span>
                  <span className="font-mono text-[10px] text-rose-300">
                    NO {p.n}%
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>zero-delay · copy-trade enabled</span>
              <span className="text-emerald-300">
                81 markets · 34m : 23s till next settle
              </span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}


/* ───────── Melodex ───────── */
function Melodex() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 20% 30%, rgba(244,114,182,0.55), transparent 58%), radial-gradient(90% 70% at 85% 95%, rgba(244,211,94,0.35), transparent 60%), linear-gradient(135deg,#2a0b1e,#090616)",
      }}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="melodex.xyz/register" accent="rgba(244,114,182,0.25)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] gap-3 p-4 md:min-h-[320px] md:gap-5 md:p-6">
            <aside className="hidden w-40 shrink-0 flex-col gap-2 md:flex">
              {["Register IP", "Marketplace", "Royalties", "Settings"].map((x, i) => (
                <div
                  key={x}
                  className={`rounded-lg px-3 py-2 text-[11px] ${i === 0 ? "bg-white/10 text-white" : "text-white/50"}`}
                >
                  {x}
                </div>
              ))}
            </aside>
            <div className="flex flex-1 flex-col gap-3 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg text-white">
                  Register Creative IP
                </div>
                <span className="rounded-full bg-rose-400/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-rose-200">
                  Story Protocol
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Image", "Audio", "Story"].map((k, i) => (
                  <div
                    key={k}
                    className={`aspect-[4/3] rounded-lg border ${i === 0 ? "border-rose-300/50" : "border-white/8"}`}
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg,rgba(244,114,182,0.4),rgba(244,211,94,0.2))"
                          : "rgba(255,255,255,0.02)",
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                <div className="font-mono text-[10px] text-white/55">
                  asset uri · ipfs://bafybei...
                </div>
                <div className="font-mono text-[10px] text-rose-200">pinned ✓</div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  royalty 7.5% · auto
                </div>
                <motion.div
                  className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  Mint ⟶
                </motion.div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── StellaRay ───────── */
function StellaRay() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 60% 50%, rgba(56,189,248,0.5), transparent 55%), linear-gradient(135deg,#05101f,#06020d)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle
            key={i}
            cx="400"
            cy="250"
            r={30 + i * 18}
            fill="none"
            stroke="rgba(125,211,252,0.15)"
            strokeDasharray={`${4 + i} ${6 + i}`}
            strokeWidth="1"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${i * 10} 400 250`}
              to={`${i * 10 + 360} 400 250`}
              dur={`${18 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="stellaray.auth/login" accent="rgba(125,211,252,0.25)" className="w-full max-w-[520px]">
          <div className="flex min-h-[260px] flex-col items-stretch gap-4 p-6 md:min-h-[320px] md:gap-5 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-sky-300 to-blue-500" />
                <span className="font-display text-base text-white">StellaRay</span>
              </div>
              <span className="rounded-full border border-sky-300/25 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200">
                Protocol 25
              </span>
            </div>

            <div className="mt-2">
              <div className="font-display text-xl text-white md:text-2xl">
                Sign in. Get a wallet.
              </div>
              <div className="mt-1 text-[13px] text-white/55">
                No seed phrase. No extension.
              </div>
            </div>

            <button className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-white">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="#4285F4">
                  <path d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.33Z"/>
                  <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H3.08v2.58A10 10 0 0 0 12 22Z"/>
                  <path fill="#FBBC05" d="M6.41 13.89a6 6 0 0 1 0-3.79V7.52H3.08a10 10 0 0 0 0 8.96l3.33-2.59Z"/>
                  <path fill="#EA4335" d="M12 5.95c1.47-.02 2.88.53 3.95 1.54L18.8 4.6A10 10 0 0 0 3.08 7.52l3.33 2.58c.8-2.38 3-4.15 5.59-4.15Z"/>
                </svg>
              </span>
              Continue with Google
            </button>

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 rounded-xl border border-white/8 bg-white/[0.015] p-4 font-mono text-[10px] text-white/55">
              <span className="text-sky-300">→</span>
              <span>Poseidon hash of OAuth identity</span>
              <span className="text-sky-300">→</span>
              <span>deterministic wallet — same Google = same address</span>
              <span className="text-sky-300">→</span>
              <span>identity never touches chain</span>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span>verify · $0.03</span>
              <span className="text-sky-300">ready ●</span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── Tempo Books ───────── */
function Tempo() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 20% 80%, rgba(45,212,191,0.45), transparent 55%), linear-gradient(135deg,#051b19,#030608)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="app.tempo.books/invoices" accent="rgba(45,212,191,0.25)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] flex-col gap-3 p-4 md:min-h-[320px] md:p-6">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg text-white">Invoices</div>
              <div className="flex gap-2 text-[11px] text-white/55">
                <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-200">
                  + New
                </span>
                <span className="rounded-md border border-white/10 px-2 py-1">
                  Batch payout
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>#</span>
              <span>client</span>
              <span>amount</span>
              <span>status</span>
            </div>
            {[
              ["AK-2041", "arweave.india", "$4,800", "reconciled"],
              ["AK-2042", "aarambh.labs", "$12,000", "reconciled"],
              ["AK-2043", "meridian.fi", "$8,250", "pending"],
              ["AK-2044", "storycorp", "$3,400", "reconciled"],
              ["AK-2045", "onchain.isl", "$19,760", "reconciled"],
            ].map(([id, c, amt, st], i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5 text-[12px] text-white/85"
              >
                <span className="font-mono text-emerald-200">{id}</span>
                <span className="truncate">{c}</span>
                <span className="font-display tabular-nums">{amt}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] ${
                    st === "reconciled"
                      ? "bg-emerald-400/12 text-emerald-200"
                      : "bg-amber-400/10 text-amber-200"
                  }`}
                >
                  {st === "reconciled" ? "● auto" : "○ wait"}
                </span>
              </motion.div>
            ))}
            <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                5 settled · 1 pending
              </span>
              <span className="font-display text-xl text-white">
                $48,210{" "}
                <span className="font-mono text-[10px] text-emerald-300">USDC</span>
              </span>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── Meridian ───────── */
function Meridian() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 80% 20%, rgba(251,146,60,0.4), transparent 55%), linear-gradient(135deg,#1a0b05,#060305)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 26 }).map((_, i) => {
          const y = 40 + i * 22;
          const cy = Math.round((20 + i * 22 + Math.sin(i) * 36) * 100) / 100;
          return (
            <path
              key={i}
              d={`M 0 ${y} Q 200 ${cy} 400 ${y} T 800 ${y}`}
              fill="none"
              stroke={`rgba(251,146,60,${0.04 + (i % 3) * 0.09})`}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="meridian.fi/vaults" accent="rgba(251,146,60,0.25)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] flex-col gap-4 p-4 md:min-h-[320px] md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-rose-500" />
                <span className="font-display text-lg text-white">Meridian</span>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-orange-200/20 bg-orange-300/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-orange-200">
                <span className="h-1 w-1 rounded-full bg-orange-300" />
                ZK-KYC verified
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                ["T-Bills Vault", "8.92%", "$4.2M"],
                ["Private Credit", "11.4%", "$1.8M"],
                ["Trade Fin.", "7.1%", "$6.0M"],
              ].map(([n, a, t], i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: 0.08 * i }}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {n}
                  </div>
                  <div className="mt-2 font-display text-3xl text-orange-100">
                    {a}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-white/40">
                    TVL {t}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-white/8 bg-white/[0.015] px-3 py-2.5">
              <div className="font-mono text-[11px] text-white/65">
                <span className="text-orange-200">zk.prove</span>{" "}
                accreditation + jurisdiction →{" "}
                <span className="text-emerald-300">vault unlocked</span>
              </div>
              <button className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
                Deposit
              </button>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── NeuroFocus ───────── */
function NeuroFocus() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, rgba(167,139,250,0.4), transparent 55%), linear-gradient(135deg,#0f0724,#05030e)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="twitter.com · focus mode ON" accent="rgba(167,139,250,0.28)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] gap-3 p-4 md:min-h-[320px] md:p-6">
            <div className="flex flex-1 flex-col gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-3"
                  style={i !== 1 ? { filter: i === 0 ? "blur(6px)" : "blur(10px)" } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-white/80">
                        user_{i + 314}
                      </span>
                      <span className="font-mono text-[9px] text-white/35">
                        trending · for you
                      </span>
                    </div>
                    <span className="ml-auto rounded-full bg-violet-400/20 px-2 py-0.5 font-mono text-[9px] text-violet-200">
                      {i === 1 ? "allowed" : "blocked"}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-[85%] rounded-full bg-white/10" />
                  <div className="mt-1.5 h-2 w-[60%] rounded-full bg-white/6" />
                </div>
              ))}
            </div>
            <aside className="hidden w-48 shrink-0 flex-col gap-2 md:flex">
              <div className="rounded-xl border border-white/10 bg-violet-400/10 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-200/80">
                  focus mode
                </div>
                <div className="mt-2 font-display text-lg text-white">
                  23:41
                </div>
                <div className="mt-1 text-[11px] text-white/55">
                  session time left
                </div>
              </div>
              <div className="rounded-xl border border-white/8 p-3 text-[11px] text-white/55">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                  blocked today
                </div>
                <div className="grid grid-cols-2 gap-1 text-white/70">
                  <span>feed · 18</span>
                  <span>autoplay · 7</span>
                  <span>trending · 12</span>
                  <span>shorts · 4</span>
                </div>
              </div>
            </aside>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── claude-mem ───────── */
function ClaudeMem() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 80% 80%, rgba(226,232,240,0.12), transparent 55%), linear-gradient(135deg,#0a0a10,#04040a)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="~/adwait · zsh · claude-mem" accent="rgba(226,232,240,0.2)" className="w-full max-w-[720px]">
          <div className="min-h-[260px] p-5 font-mono text-[12px] leading-[1.7] text-white/70 md:min-h-[320px] md:p-6 md:text-[13px]">
            <div>
              <span className="text-white/30">adwait@mac</span>{" "}
              <span className="text-emerald-400">~/dev/portfolio</span>{" "}
              <span className="text-white/30">%</span>{" "}
              <span className="text-white">cm capture --session last</span>
            </div>
            <div className="text-white/45">
              → reading 4.2k tokens · topic-aware chunking…
            </div>
            <div className="text-emerald-300">
              ✓ compacted to 512 tokens across 7 topics
            </div>
            <div className="mt-3">
              <span className="text-white/30">%</span>{" "}
              <span className="text-white">cm rehydrate --topic auth</span>
            </div>
            <div className="text-white/45">→ injecting 7 relevant memories</div>
            <div className="text-emerald-300">
              ✓ context ready · next turn primed
            </div>
            <div className="mt-4 rounded-md border border-white/8 bg-white/[0.02] p-3 text-[11px] text-white/55">
              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                memory graph (last 7d)
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-8 w-2 rounded-sm bg-white/10"
                    style={{ opacity: 0.25 + ((i * 17) % 75) / 100 }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 text-white/35">
              // agents that remember — finally.
            </div>
            <div className="mt-2">
              <span className="text-white/30">%</span>{" "}
              <motion.span
                className="inline-block h-[1.1em] w-2 align-[-2px] bg-white/85"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── worldmonitor ───────── */
function WorldMonitor() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 40% 40%, rgba(132,204,22,0.3), transparent 60%), linear-gradient(135deg,#0b1403,#030602)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="worldmonitor.ai/board" accent="rgba(190,242,100,0.22)" className="w-full max-w-[88%]">
          <div className="flex min-h-[260px] gap-3 p-4 md:min-h-[320px] md:p-6">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg text-white">
                  Global feed
                </div>
                <span className="flex items-center gap-2 rounded-full bg-lime-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-lime-200">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-lime-300" />
                  live · 2,410 sources
                </span>
              </div>
              {[
                ["IN · 04:12", "Bhopal DAO ships v2 onchain identity module"],
                ["US · 04:10", "Fed minutes hint at rate-cut window"],
                ["EU · 04:07", "ETH gas fees dip below 5 gwei"],
                ["JP · 04:02", "Soroban testnet latency up 8%"],
              ].map(([t, h], i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.06 }}
                  className="grid grid-cols-[90px_1fr] items-start gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-200/75">
                    {t}
                  </span>
                  <span className="text-[12px] text-white/85">{h}</span>
                </motion.div>
              ))}
            </div>
            <aside className="hidden w-44 shrink-0 flex-col gap-2 md:flex">
              <div className="rounded-xl border border-white/10 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                  Map
                </div>
                <div className="mt-2 grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const a = Math.round(((i * 37) % 100) / 100 * 1000) / 1000;
                    return (
                      <span
                        key={i}
                        className="aspect-square rounded-[2px]"
                        style={{ background: `rgba(190,242,100,${0.1 + a * 0.4})` }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 p-3 text-[11px] text-white/65">
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                  Latency
                </div>
                <div className="font-display text-2xl text-lime-200">
                  132ms
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-white/40">
                  p95 · last 5m
                </div>
              </div>
            </aside>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

/* ───────── mindwell ───────── */
function Mindwell() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 60%, rgba(244,114,182,0.5), transparent 55%), linear-gradient(135deg,#2a0b20,#0a030a)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 160 }).map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const layer = Math.floor(i / 40);
          const r = 140 + layer * 45 + Math.sin(i * 0.5) * 20;
          const x = Math.round((400 + Math.cos(angle) * r) * 100) / 100;
          const y = Math.round((250 + Math.sin(angle) * r * 0.55) * 100) / 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2 + (layer % 2)}
              fill={`rgba(253,164,175,${0.4 + layer * 0.15})`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
        <BrowserFrame url="mindwell.care" accent="rgba(244,114,182,0.22)" className="w-full max-w-[720px]">
          <div className="min-h-[260px] bg-[#140613] p-6 md:min-h-[320px] md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-200/80">
              An IITM Sahyog Club initiative
            </div>
            <div className="mt-3 font-display text-3xl leading-tight text-white md:text-5xl">
              It gets better —
              <br />
              <span className="text-white/60">and you're not alone.</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-white/65">
              {["talk to someone", "breathing tools", "resources", "find a peer"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

export default function ProjectPoster({ kind }: { kind: Kind }) {
  const Map: Record<Kind, React.ComponentType> = {
    prophit: Prophit,
    insiders: Insiders,
    backerstage: BackerStage,
    melodex: Melodex,
    stellaray: StellaRay,
    "tempo-books": Tempo,
    meridian: Meridian,
    neurofocus: NeuroFocus,
    "claude-mem": ClaudeMem,
    worldmonitor: WorldMonitor,
    mindwell: Mindwell,
  };
  const C = Map[kind];
  return <C />;
}
