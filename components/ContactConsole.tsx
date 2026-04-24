"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Check, Copy, Loader2 } from "lucide-react";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const TIMELINES = ["ASAP", "This month", "This quarter", "Exploring"];
const BUDGETS   = ["Equity-only", "< $5k", "$5k – $25k", "$25k+", "Open"];

const SCENE_TITLES: Record<Exclude<Step, 5>, { scene: string; take: string; cue: string }> = {
  0: { scene: "01", take: "NAME",     cue: "who's calling?" },
  1: { scene: "02", take: "SIGNAL",   cue: "best reply-to" },
  2: { scene: "03", take: "SCOPE",    cue: "one line — what are you building?" },
  3: { scene: "04", take: "CONTEXT",  cue: "give me the shape of the thing" },
  4: { scene: "05", take: "SLATE",    cue: "review · mark · action" },
};

export default function ContactConsole({ theme }: { theme?: "dark" | "light" }) {
  const [step, setStep]         = useState<Step>(0);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [scope, setScope]       = useState("");
  const [body, setBody]         = useState("");
  const [timeline, setTimeline] = useState<string>("");
  const [budget, setBudget]     = useState<string>("");
  const [hp, setHp]             = useState(""); // honeypot

  const [sending, setSending] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [ticket, setTicket]   = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);

  const [stats, setStats] = useState<{ total: number; last30: number } | null>(null);

  // live counter
  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.ok) setStats({ total: j.total ?? 0, last30: j.last30 ?? 0 });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const canAdvance =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) ||
    (step === 2 && scope.trim().length >= 2) ||
    (step === 3 && body.trim().length >= 8) ||
    step === 4;

  const next = () => { if (canAdvance && step < 4) setStep((s) => (s + 1) as Step); };
  const back = () => { if (step > 0) setStep((s) => (s - 1) as Step); };

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, scope, body, timeline, budget, theme, hp }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) {
        setError(j?.error ?? "unknown_error");
      } else {
        setTicket(j.ticket);
        setStep(5 as Step);
        setStats((s) => s ? { total: s.total + 1, last30: s.last30 + 1 } : s);
      }
    } catch {
      setError("network_error");
    } finally {
      setSending(false);
    }
  };

  // If we're on the success screen, show only the ticket frame
  if (step === 5 && ticket) {
    return <TicketReceipt ticket={ticket} copied={copied} onCopy={() => {
      navigator.clipboard.writeText(ticket);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }} />;
  }

  const titles = SCENE_TITLES[step as Exclude<Step, 5>];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] backdrop-blur-sm">
      {/* top slate strip */}
      <div className="grid grid-cols-5 border-b border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.03)] font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
        <Slate label="scene" value={titles.scene} />
        <Slate label="take"  value={titles.take} />
        <Slate label="roll"  value={`${step + 1}/5`} />
        <Slate label="fps"   value="24" />
        <Slate label="reel"  value="adwait.build" last />
      </div>

      {/* progress bar */}
      <div className="relative h-[3px] w-full bg-[color:rgba(var(--tone-fg),0.06)]">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[color:var(--color-ink)]"
          animate={{ width: `${((step + 1) / 5) * 100}%` }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      </div>

      {/* stage */}
      <div className="relative min-h-[320px] px-5 pb-5 pt-7 md:px-8 md:pb-8 md:pt-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  action — {titles.cue}
                </div>
              </div>
              {stats && (
                <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)] md:block">
                  {stats.total}{" "}
                  {stats.total === 1 ? "thread" : "threads"} opened · {stats.last30} this month
                </div>
              )}
            </div>

            {step === 0 && (
              <TextField
                autoFocus
                value={name}
                onChange={setName}
                onEnter={next}
                placeholder="Ada Lovelace"
                hint="first name is fine"
              />
            )}
            {step === 1 && (
              <TextField
                autoFocus
                type="email"
                value={email}
                onChange={setEmail}
                onEnter={next}
                placeholder="ada@analytical-engine.co"
                hint="I reply inside 24h — actually"
              />
            )}
            {step === 2 && (
              <TextField
                autoFocus
                value={scope}
                onChange={setScope}
                onEnter={next}
                placeholder="AI agent that prices illiquid NFTs"
                hint="one sentence · the premise"
              />
            )}
            {step === 3 && (
              <div className="space-y-5">
                <TextArea
                  autoFocus
                  value={body}
                  onChange={setBody}
                  placeholder="stage · team · stack · the scope you'd want me to own"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <ChipGroup
                    label="timeline"
                    options={TIMELINES}
                    value={timeline}
                    onChange={setTimeline}
                  />
                  <ChipGroup
                    label="budget"
                    options={BUDGETS}
                    value={budget}
                    onChange={setBudget}
                  />
                </div>
                <HoneyField value={hp} onChange={setHp} />
              </div>
            )}
            {step === 4 && (
              <ReviewSlate
                name={name}
                email={email}
                scope={scope}
                body={body}
                timeline={timeline}
                budget={budget}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* action bar */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-5">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink-dim)] transition-colors hover:text-[color:var(--color-ink)] disabled:opacity-30"
          >
            <ArrowLeft size={12} />
            back
          </button>

          {error && (
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-warn)]">
              error: {error}
            </span>
          )}

          {step < 4 && (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-2.5 text-[11px] font-medium text-[color:var(--color-bg)] transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
            >
              continue
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-6 py-2.5 text-[11px] font-medium text-[color:var(--color-bg)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  sending
                </>
              ) : (
                <>
                  mark · action
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* subtle grain on the whole card */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" aria-hidden />
    </div>
  );
}

/* ───────────────── pieces ───────────────── */

function Slate({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-0.5 px-3 py-2.5 md:px-4 ${
        last ? "" : "border-r border-[color:var(--color-border)]"
      }`}
    >
      <span className="text-[9px] tracking-[0.32em] text-[color:var(--color-ink-mute)]">{label}</span>
      <span className="text-[11px] tracking-[0.2em] text-[color:var(--color-ink)]">{value}</span>
    </div>
  );
}

function TextField({
  value, onChange, onEnter, placeholder, type = "text", autoFocus, hint,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  return (
    <div>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter?.(); } }}
        placeholder={placeholder}
        className="w-full border-b border-[color:var(--color-border)] bg-transparent pb-3 text-2xl text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-mute)] md:text-3xl"
      />
      {hint && (
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
          {hint}
        </div>
      )}
    </div>
  );
}

function TextArea({
  value, onChange, placeholder, autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-4 text-[15px] leading-relaxed text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-mute)]"
    />
  );
}

function ChipGroup({
  label, options, value, onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(active ? "" : o)}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                active
                  ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-bg)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-ink-dim)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-ink)]"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewSlate({
  name, email, scope, body, timeline, budget,
}: {
  name: string; email: string; scope: string; body: string; timeline: string; budget: string;
}) {
  const rows: { k: string; v: string }[] = [
    { k: "operator",   v: "Adwait Keshari" },
    { k: "director",   v: name || "—" },
    { k: "reply-to",   v: email || "—" },
    { k: "premise",    v: scope || "—" },
    { k: "timeline",   v: timeline || "unspecified" },
    { k: "budget",     v: budget || "unspecified" },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
          production slate
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
          {rows.map((r) => (
            <div key={r.k} className="contents font-mono text-[12px]">
              <dt className="text-[10px] uppercase tracking-[0.26em] text-[color:var(--color-ink-mute)]">
                {r.k}
              </dt>
              <dd className="truncate text-[color:var(--color-ink)]">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
          context
        </div>
        <p className="max-h-[180px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">
          {body || "—"}
        </p>
      </div>
    </div>
  );
}

function HoneyField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // invisible to humans, bots will often fill it
  return (
    <input
      type="text"
      name="company-url"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-hidden
      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
    />
  );
}

function TicketReceipt({
  ticket, copied, onCopy,
}: {
  ticket: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const punchedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-7 md:p-10"
    >
      {/* film perforations */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-3 items-center gap-2 px-2" aria-hidden>
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="h-1.5 w-3 rounded-sm bg-[color:rgba(var(--tone-fg),0.12)]" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3 items-center gap-2 px-2" aria-hidden>
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="h-1.5 w-3 rounded-sm bg-[color:rgba(var(--tone-fg),0.12)]" />
        ))}
      </div>

      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-ink-mute)]">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--color-success)]" />
        captured · thread opened
      </div>

      <motion.div
        initial={{ letterSpacing: "0.8em", opacity: 0 }}
        animate={{ letterSpacing: "0.04em", opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1] }}
        className="mt-4 font-display text-4xl text-[color:var(--color-ink)] md:text-6xl"
      >
        {ticket}
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-ink-dim)]">
          <div>punched at <span className="text-[color:var(--color-ink)]">{punchedAt}</span> IST</div>
          <div>eta <span className="text-[color:var(--color-ink)]">&lt; 24h</span> · I will reply to your inbox directly</div>
          <div className="pt-2 text-[10px] text-[color:var(--color-ink-mute)]">
            save this ticket · it is your reference if anything goes missing
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2 text-[11px] text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "copied" : "copy ticket"}
          </button>
          <a
            href="#home"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ink)] px-5 py-2 text-[11px] font-medium text-[color:var(--color-bg)] transition-transform hover:-translate-y-0.5"
          >
            back to top ↑
          </a>
        </div>
      </div>
    </motion.div>
  );
}
