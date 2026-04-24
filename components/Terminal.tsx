"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, profile } from "@/lib/data";

type Line = { kind: "in" | "out" | "sys"; text: string };

const HELP = `Available commands:

  ls [projects|stack]      list projects or stack
  cat <slug|about|craft>   print a project README or profile
  open <slug>              open the project's live URL in a new tab
  go <scene>               scroll to a scene (home, showcase, about, craft, trace, signals, faq, contact)
  ask <question>           stream an answer from the AI concierge
  theme [dark|light]       switch theme
  play                     toggle the film-reel playback
  clear                    clear the screen
  exit / esc               close the terminal

Press \` again any time to re-open.`;

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      // Ignore if typing into another input/textarea
      if (!open && (tag === "input" || tag === "textarea" || t?.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
  }, [open]);

  useEffect(() => {
    if (open) {
      // focus input, seed with banner if empty
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 20);
      if (lines.length === 0) {
        setLines([
          { kind: "sys", text: "adwait.os · v0.1 · llama-powered" },
          { kind: "sys", text: "type `help` to see commands · `esc` to close" },
        ]);
      }
    }
  }, [open, lines.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, busy]);

  async function run(raw: string) {
    const line = raw.trim();
    if (!line) return;
    setLines((L) => [...L, { kind: "in", text: line }]);
    setHistory((H) => [line, ...H].slice(0, 40));
    setHIdx(-1);

    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ").trim();

    switch (cmd.toLowerCase()) {
      case "help":
      case "?":
        return emit(HELP);

      case "ls":
        if (!arg || arg === "projects") {
          return emit(
            projects
              .map((p, i) => `${String(i + 1).padStart(2, "0")}  ${p.slug.padEnd(14)} ${p.year}  ${p.kicker}`)
              .join("\n"),
          );
        }
        if (arg === "stack") {
          return emit(
            "Languages, Frontend, Backend & Data, AI/Agents, Web3 & Crypto, Cloud — run `cat craft` for details.",
          );
        }
        return emit(`ls: unknown target '${arg}'. Try: ls projects · ls stack`);

      case "cat": {
        if (!arg) return emit("cat: missing target. Try: cat <slug|about|craft>");
        if (arg === "about") {
          return emit(
            `${profile.name} — ${profile.role}\n${profile.location}\n\n${profile.tagline}\n\n` +
              `github: ${profile.social.github}\nx:      ${profile.social.twitter}\nmail:   ${profile.email}`,
          );
        }
        const p = projects.find((x) => x.slug === arg);
        if (!p) return emit(`cat: no such project '${arg}'. Try: ls projects`);
        return emit(
          `# ${p.name}  (${p.year} · ${p.status ?? "?"})\n${p.kicker}\n\n${p.summary}\n\n` +
            `Highlights:\n${p.highlights.map((h) => `  • ${h}`).join("\n")}\n\n` +
            `Stack: ${p.stack.join(", ")}\nLink:  ${p.href ?? "n/a"}${p.repo ? `\nRepo:  ${p.repo}` : ""}`,
        );
      }

      case "open": {
        const p = projects.find((x) => x.slug === arg);
        if (!p?.href) return emit(`open: no such project '${arg}'. Try: ls projects`);
        window.open(p.href, "_blank", "noopener,noreferrer");
        return emit(`→ opened ${p.name}`);
      }

      case "go": {
        const id = arg.toLowerCase();
        const MAP: Record<string, string> = {
          home: "home", index: "home",
          showcase: "showcase", work: "showcase",
          about: "about", operator: "about",
          craft: "craft", kit: "craft",
          timeline: "timeline", trace: "timeline",
          signals: "writing", writing: "writing",
          faq: "faq",
          contact: "contact",
        };
        const target = MAP[id];
        if (!target) return emit(`go: unknown scene '${arg}'`);
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
        return;
      }

      case "theme": {
        const want = (arg === "light" ? "light" : arg === "dark" ? "dark" : null) as "light" | "dark" | null;
        if (!want) return emit("theme: pass `dark` or `light`.");
        document.documentElement.dataset.theme = want;
        try { localStorage.setItem("adwait:theme", want); } catch {}
        return emit(`→ theme: ${want}`);
      }

      case "play": {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", key: " " }));
        return emit("→ toggled reel playback");
      }

      case "ask": {
        if (!arg) return emit("ask: give me a question. Example: ask what's your best client project?");
        return askAI(arg);
      }

      case "clear":
      case "cls":
        setLines([]);
        return;

      case "exit":
      case "quit":
      case "close":
        setOpen(false);
        return;

      default:
        emit(`${cmd}: command not found. Try \`help\`.`);
    }
  }

  function emit(text: string) {
    setLines((L) => [...L, { kind: "out", text }]);
  }

  async function askAI(q: string) {
    setBusy(true);
    // reserve a streaming line
    setLines((L) => [...L, { kind: "out", text: "" }]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok || !res.body) {
        replaceLast(`[ask failed: HTTP ${res.status}]`);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        replaceLast(acc);
      }
    } catch (e) {
      replaceLast(`[ask error: ${(e as Error).message}]`);
    } finally {
      setBusy(false);
    }
  }

  function replaceLast(text: string) {
    setLines((L) => {
      const copy = [...L];
      copy[copy.length - 1] = { kind: "out", text };
      return copy;
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(history.length - 1, hIdx + 1);
      if (history[ni] != null) {
        setHIdx(ni);
        setInput(history[ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(-1, hIdx - 1);
      setHIdx(ni);
      setInput(ni === -1 ? "" : history[ni]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="term"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[6vh] backdrop-blur-sm"
          style={{ background: "rgba(0, 0, 0, 0.72)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -14, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -14, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
            style={{ background: "#0a0a12", height: "min(72vh, 640px)" }}
          >
            {/* titlebar */}
            <div className="flex items-center justify-between border-b border-white/8 bg-[#111118] px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c841]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
                adwait.os — zsh — {lines.length} lines
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                esc to close
              </span>
            </div>

            {/* body */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-white/90">
              {lines.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {l.kind === "in" ? (
                    <span>
                      <span className="text-emerald-300">adwait@os</span>
                      <span className="text-white/40"> ~ </span>
                      <span className="text-sky-300">$</span> {l.text}
                    </span>
                  ) : l.kind === "sys" ? (
                    <span className="text-white/45">{l.text}</span>
                  ) : (
                    <span className="text-white/75">{l.text}</span>
                  )}
                </div>
              ))}
              {busy && <span className="text-white/40">…</span>}
            </div>

            {/* prompt */}
            <div className="flex items-center gap-2 border-t border-white/8 bg-[#08080f] px-4 py-3 font-mono text-[13px]">
              <span className="text-emerald-300">adwait@os</span>
              <span className="text-white/40">~</span>
              <span className="text-sky-300">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
                placeholder='try: help · ls · cat prophit · ask "what are you building?"'
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
