"use client";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";

/**
 * Generative "frame" poster — composes a unique 1080×1350 (4:5) card from
 * the visitor's current moment (time, phase) and downloads as PNG.
 *
 * We render a hidden DOM node, then serialize with html-to-image. The
 * node lives offscreen via `position: fixed; left: -9999px` so it isn't
 * visible to the visitor and doesn't affect layout, but IS reachable by
 * html-to-image (which walks DOM, not the viewport).
 */
export default function PosterExport() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const stamp = () => {
    const d = new Date();
    const ist = d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
    const istHour = Number(d.toLocaleString("en-IN", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
    const phase =
      istHour < 5  ? "MIDNIGHT" :
      istHour < 8  ? "DAWN" :
      istHour < 12 ? "MORNING" :
      istHour < 16 ? "AFTERNOON" :
      istHour < 19 ? "DUSK" :
      istHour < 22 ? "EVENING" : "LATE";
    return { ist, phase };
  };

  async function download() {
    const node = frameRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      const png = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#050507",
      });
      const a = document.createElement("a");
      a.href = png;
      a.download = `adwait-keshari-${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error("poster export failed", e);
    } finally {
      setBusy(false);
    }
  }

  const { ist, phase } = stamp();
  const seed = (Math.random() * 1000 | 0).toString(36).toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={download}
        disabled={busy}
        aria-label="Download this frame as a poster"
        title="Generate & download a unique 4:5 poster of this moment"
        className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--color-ink-dim)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-ink)] disabled:opacity-60"
      >
        {busy ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />}
        {busy ? "exporting" : "print frame"}
      </button>

      {/* Offscreen render target */}
      <div
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          width: 1080,
          height: 1350,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <div
          ref={frameRef}
          style={{
            width: 1080,
            height: 1350,
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(216,180,254,0.22), transparent 70%), radial-gradient(50% 50% at 80% 90%, rgba(125,211,252,0.2), transparent 70%), linear-gradient(135deg, #07060d 0%, #050507 100%)",
            color: "#f7f7f2",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* sprocket strips */}
          <div style={{ position: "absolute", top: 32, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 32px" }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} style={{ width: 26, height: 10, background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 32px" }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} style={{ width: 26, height: 10, background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
            ))}
          </div>

          {/* top rail */}
          <div style={{ position: "absolute", top: 84, left: 64, right: 64, display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 14, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            <span>Vol. 01 · Issue 2026</span>
            <span>Bhopal, IN · {ist} IST</span>
          </div>

          {/* the name, huge */}
          <div style={{ position: "absolute", left: 64, top: 280, right: 64 }}>
            <div style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 16, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 28 }}>
              The Operator — frame / {seed}
            </div>
            <div style={{ fontSize: 200, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.9, color: "#ffffff" }}>
              Adwait
            </div>
            <div
              style={{
                fontSize: 200,
                fontWeight: 500,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                marginTop: 8,
                backgroundImage:
                  "linear-gradient(120deg, #fff 0%, #f4d35e 35%, #7dd3fc 70%, #d8b4fe 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Keshari
            </div>
            <div style={{ marginTop: 40, fontSize: 22, lineHeight: 1.5, color: "rgba(255,255,255,0.72)", maxWidth: 720 }}>
              Full-stack engineer · Web3 explorer. Shipping applied-AI +
              crypto products from Bhopal. Available for founding-engineer
              roles and gnarly full-stack scopes.
            </div>
          </div>

          {/* bottom rail */}
          <div style={{ position: "absolute", bottom: 82, left: 64, right: 64 }}>
            <div style={{ display: "flex", gap: 36, fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 15, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              <span>phase · {phase}</span>
              <span>·</span>
              <span>24 fps</span>
              <span>·</span>
              <span>adwait.build</span>
            </div>
            <div style={{ marginTop: 22, height: 1, background: "linear-gradient(to right, rgba(255,255,255,0.35), transparent)" }} />
            <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 13, letterSpacing: "0.26em", color: "rgba(255,255,255,0.4)" }}>
              <span>IIT MADRAS · BHOPAL DAO · AARAMBH LABS</span>
              <span>ADWAITKESHARI288@GMAIL.COM</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
