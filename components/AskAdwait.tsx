"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, X, Square, RotateCcw } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What are you working on right now?",
  "What's your best client project?",
  "Are you open to founding-engineer roles?",
  "Walk me through Voxa in 3 lines.",
];

const STORAGE_KEY = "adwait:ask:thread";

/**
 * Ask Adwait - AI concierge grounded in lib/data.ts.
 * Streams from /api/ask (Groq Llama 3.3 70B).
 *
 * Two UIs:
 *  - mode="inline"   - embedded (FAQ section)
 *  - mode="floating" - fixed bottom-left launcher + sliding panel
 *
 * Features: autofocus on open, ESC closes, click-outside closes,
 * localStorage thread persistence, "new thread" reset, abort streaming,
 * tiny inline markdown (bold + code + paragraph breaks), auto-hides
 * floater while #showcase is in view to avoid overlap.
 */
export default function AskAdwait({ mode = "inline" }: { mode?: "inline" | "floating" }) {
  const [open, setOpen] = useState(mode === "inline");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showcaseInView, setShowcaseInView] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage exactly once.
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed)) setMessages(parsed.slice(-20));
      }
    } catch {}
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (messages.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {}
  }, [messages, hydrated]);

  // Auto-scroll the thread container only.
  useEffect(() => {
    if (messages.length === 0) return;
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  // Floating launcher hides while Showcase is in view.
  useEffect(() => {
    if (mode !== "floating" || typeof window === "undefined") return;
    const el = document.getElementById("showcase");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setShowcaseInView(e.isIntersecting);
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // ESC closes the floating panel; focus the input when it opens.
  useEffect(() => {
    if (mode !== "floating") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    }
  }, [open]);

  // Click-outside closes the floating panel.
  useEffect(() => {
    if (mode !== "floating" || !open) return;
    const onDown = (e: MouseEvent) => {
      const el = panelRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      // Don't close if the user clicked the launcher itself
      const launcher = document.querySelector("[data-ask-launcher]");
      if (launcher && launcher.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [mode, open]);

  async function send(q?: string) {
    const text = (q ?? input).trim();
    if (!text || streaming) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setError(null);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        let msg = `HTTP ${res.status}`;
        try { const t = await res.text(); if (t) msg = t.slice(0, 240); } catch {}
        setError(msg);
        setStreaming(false);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { ...last, content: last.content + chunk };
          }
          return copy;
        });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message ?? "network_error");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  function reset() {
    abortRef.current?.abort();
    setStreaming(false);
    setMessages([]);
    setError(null);
    setInput("");
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 30);
  }

  const Panel = (
    <div className="flex flex-col gap-3">
      {/* Header — only when inline (floating panel has its own header). */}
      {mode === "inline" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
            <Sparkles size={12} className="text-[color:var(--color-accent)]" />
            ask adwait · streaming · grounded
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-border)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--color-ink-dim)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-ink)]"
              aria-label="New thread"
            >
              <RotateCcw size={10} />
              new
            </button>
          )}
        </div>
      )}

      {/* Thread */}
      <div
        ref={threadRef}
        className="relative max-h-[44vh] min-h-[180px] overflow-y-auto rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">
              Ask anything about my work, stack, or the projects in this site.
              Answers stream from a 70B Llama, grounded in everything you see
              here.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] px-3 py-1.5 text-left text-[11px] leading-tight text-[color:var(--color-ink-dim)] transition-colors hover:border-[color:var(--color-border-strong)] hover:bg-[color:rgba(var(--tone-fg),0.06)] hover:text-[color:var(--color-ink)]"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--color-ink-mute)]">
              powered by groq · llama 3.3 70b · grounded in /lib/data.ts
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((m, i) => {
              const isLastAssistant =
                m.role === "assistant" && i === messages.length - 1;
              return (
                <li key={i} className="grid grid-cols-[44px_1fr] gap-3">
                  <span
                    className={`mt-1 select-none font-mono text-[9px] uppercase tracking-[0.26em] ${
                      m.role === "user"
                        ? "text-[color:var(--color-ink-mute)]"
                        : "text-[color:var(--color-accent)]"
                    }`}
                  >
                    {m.role === "user" ? "you" : "adwait"}
                  </span>
                  <div
                    className={`min-w-0 whitespace-pre-wrap text-[14px] leading-relaxed ${
                      m.role === "user"
                        ? "text-[color:var(--color-ink)]"
                        : "text-[color:var(--color-ink)]"
                    }`}
                  >
                    {m.content
                      ? renderMd(m.content)
                      : isLastAssistant && streaming
                        ? <BlinkDot />
                        : ""}
                    {/* trailing caret while streaming */}
                    {isLastAssistant && streaming && m.content && (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[color:var(--color-accent)]" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-[color:var(--color-warn)]/40 bg-[color:var(--color-warn)]/10 px-3 py-2 font-mono text-[11px] leading-snug text-[color:var(--color-warn)]">
          {error}
        </div>
      )}

      {/* Composer */}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={
            messages.length === 0
              ? "ask anything…"
              : "ask a follow-up…"
          }
          disabled={streaming}
          spellCheck={false}
          className="w-full rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] px-4 py-3 pr-12 text-[14px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-mute)] disabled:opacity-60"
        />
        {streaming ? (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop streaming"
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-warn)] text-[color:var(--color-bg)] transition-transform hover:scale-105"
          >
            <Square size={12} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => send()}
            aria-label="Send"
            disabled={!input.trim()}
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)] transition-all hover:scale-105 disabled:scale-100 disabled:opacity-30"
          >
            <Send size={13} />
          </button>
        )}
      </div>
    </div>
  );

  if (mode === "inline") return Panel;

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        data-ask-launcher
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask Adwait"
        className="pointer-events-auto fixed bottom-4 left-4 z-[58] inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent)]/50 bg-[color:rgba(var(--tone-bg),0.88)] px-3.5 py-2.5 shadow-[0_20px_60px_-20px_rgba(244,211,94,0.45)] backdrop-blur-xl transition-colors hover:bg-[color:rgba(var(--tone-bg),0.96)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: open || showcaseInView ? 0 : 1,
          y: open || showcaseInView ? 12 : 0,
        }}
        transition={{ duration: 0.28 }}
        style={{ pointerEvents: open || showcaseInView ? "none" : "auto" }}
      >
        <span className="relative inline-flex">
          <Sparkles size={14} className="text-[color:var(--color-accent)]" />
          <span
            className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-accent)]/40"
            style={{ animationDuration: "2.2s" }}
          />
        </span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-ink)]">
          Ask&nbsp;Adwait
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--color-ink-mute)] sm:inline">
          ·&nbsp;AI
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.2, 0.9, 0.2, 1] }}
            className="fixed bottom-4 left-4 right-4 z-[58] flex w-auto max-w-[480px] flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.96)] p-4 backdrop-blur-2xl md:right-auto md:w-[460px] md:p-5"
            style={{ boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6)" }}
            role="dialog"
            aria-label="Ask Adwait"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative inline-flex">
                  <Sparkles size={13} className="text-[color:var(--color-accent)]" />
                  {streaming && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-accent)]/40"
                      style={{ animationDuration: "1.4s" }}
                    />
                  )}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]">
                  ask adwait
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  · {streaming ? "thinking…" : messages.length > 0 ? `${messages.length} msg` : "ready"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="New thread"
                    title="New thread"
                    className="grid h-7 w-7 place-items-center rounded-md text-[color:var(--color-ink-dim)] transition-colors hover:bg-[color:rgba(var(--tone-fg),0.06)] hover:text-[color:var(--color-ink)]"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  title="Close (esc)"
                  className="grid h-7 w-7 place-items-center rounded-md text-[color:var(--color-ink-dim)] transition-colors hover:bg-[color:rgba(var(--tone-fg),0.06)] hover:text-[color:var(--color-ink)]"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
            {Panel}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BlinkDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[color:var(--color-ink-mute)]">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)]" />
      <span className="font-mono text-[11px] uppercase tracking-[0.24em]">thinking…</span>
    </span>
  );
}

/**
 * Minimal inline markdown for chat replies. Handles **bold** + `code`,
 * paragraph breaks via blank lines, and strips stray single-* artifacts
 * from streaming. Intentionally NOT a full markdown lib — answers are
 * short and the system prompt forbids markdown anyway; this is just a
 * safety net.
 */
function renderMd(src: string): React.ReactNode {
  // Split into paragraphs first so blank lines render visually.
  const paragraphs = src.split(/\n{2,}/);
  return paragraphs.map((para, pi) => (
    <span key={pi} className={pi > 0 ? "mt-2 block" : "block"}>
      {renderInline(para)}
    </span>
  ));
}

function renderInline(src: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < src.length) {
    if (src.startsWith("**", i)) {
      const end = src.indexOf("**", i + 2);
      if (end !== -1) {
        out.push(
          <strong key={`b${key++}`} className="font-semibold text-[color:var(--color-ink)]">
            {src.slice(i + 2, end)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }
    if (src[i] === "`") {
      const end = src.indexOf("`", i + 1);
      if (end !== -1) {
        out.push(
          <code
            key={`c${key++}`}
            className="rounded bg-[color:rgba(var(--tone-fg),0.06)] px-1 py-0.5 font-mono text-[12px] text-[color:var(--color-ink)]"
          >
            {src.slice(i + 1, end)}
          </code>,
        );
        i = end + 1;
        continue;
      }
    }
    // strip stray single-asterisk
    if (src[i] === "*" && src[i + 1] !== "*") {
      i += 1;
      continue;
    }
    let j = i;
    while (j < src.length && !src.startsWith("**", j) && src[j] !== "`" && src[j] !== "*") j++;
    out.push(<span key={`t${key++}`}>{src.slice(i, j)}</span>);
    i = j;
  }
  return out;
}
