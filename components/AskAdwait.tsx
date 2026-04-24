"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, X, Square } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What are you working on right now?",
  "What's your best client project?",
  "What stacks do you use for ZK?",
  "Are you open to founding-engineer roles?",
  "Walk me through Prophit in 3 lines.",
];

/**
 * AI concierge grounded in lib/data.ts.
 * Streams from /api/ask (Groq Llama 3.3 70B).
 *
 * Two UIs:
 *  - `mode="inline"` — embedded (FAQ section)
 *  - `mode="floating"` — fixed bottom-left launcher that opens a panel
 */
export default function AskAdwait({ mode = "inline" }: { mode?: "inline" | "floating" }) {
  const [open, setOpen] = useState(mode === "inline");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the *thread* container only (NEVER the page) and only when
  // there are messages. On mount the thread is empty — we must not scroll.
  useEffect(() => {
    if (messages.length === 0) return;
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

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
        setError(`HTTP ${res.status}`);
        setStreaming(false);
        return;
      }
      // Pre-create the assistant message and stream into it.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      // stream loop
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

  const Panel = (
    <div className="flex flex-col gap-4">
      {/* banner */}
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
        <Sparkles size={12} className="text-[color:var(--color-accent)]" />
        ask adwait · streaming · grounded
      </div>

      {/* thread */}
      <div className="relative max-h-[40vh] overflow-y-auto rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] p-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[color:var(--color-ink-dim)]">
              Type a question or pick a starter. Answers are streamed from a
              70B Llama grounded in this site's profile + projects.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-[color:var(--color-border)] px-3 py-1.5 text-[11px] text-[color:var(--color-ink-dim)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-ink)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-3 text-[14px] leading-relaxed">
              <span
                className={`mt-0.5 shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] ${
                  m.role === "user"
                    ? "text-[color:var(--color-ink-mute)]"
                    : "text-[color:var(--color-accent)]"
                }`}
              >
                {m.role === "user" ? "you" : "adwait"}
              </span>
              <div
                className={`whitespace-pre-wrap ${
                  m.role === "user"
                    ? "text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-dim)]"
                }`}
              >
                {m.content || (streaming && i === messages.length - 1 ? <BlinkDot /> : "")}
              </div>
            </div>
          ))}
          <div />
        </div>
      </div>

      {error && (
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-warn)]">
          error: {error}
        </div>
      )}

      {/* composer */}
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="ask anything — work, stack, timelines, scope…"
            disabled={streaming}
            className="w-full rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-fg),0.02)] px-4 py-3 pr-12 text-[14px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-mute)] disabled:opacity-60"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop streaming"
              className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-warn)] text-[color:var(--color-bg)]"
            >
              <Square size={12} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => send()}
              aria-label="Send"
              disabled={!input.trim()}
              className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bg)] disabled:opacity-40"
            >
              <Send size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === "inline") return Panel;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask Adwait"
        className="pointer-events-auto fixed bottom-4 left-4 z-[58] hidden items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.78)] px-3 py-2 backdrop-blur-xl transition-colors hover:bg-[color:rgba(var(--tone-bg),0.92)] md:inline-flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 10 : 0 }}
        style={{ pointerEvents: open ? "none" : "auto" }}
      >
        <Sparkles size={13} className="text-[color:var(--color-accent)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-ink)]">
          Ask Adwait
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
            className="fixed bottom-4 left-4 z-[58] hidden w-[420px] max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:rgba(var(--tone-bg),0.88)] p-4 backdrop-blur-xl md:flex"
            style={{ boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[color:var(--color-accent)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink-mute)]">
                  ask adwait · concierge
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-md text-[color:var(--color-ink-dim)] hover:text-[color:var(--color-ink)]"
                aria-label="Close"
              >
                <X size={12} />
              </button>
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
    <span className="inline-flex items-center gap-1 text-[color:var(--color-ink-mute)]">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)]" />
      thinking…
    </span>
  );
}
