import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  scope?: string;
  timeline?: string;
  budget?: string;
  body?: string;
  theme?: "dark" | "light";
  hp?: string; // honeypot
};

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

function mkTicket() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, 3).toUpperCase();
  return `AK-${mm}${dd}-${rand}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let data: Body;
  try {
    data = (await req.json()) as Body;
  } catch {
    return bad("invalid_json");
  }

  // honeypot — bots fill this, humans don't see it
  if (data.hp && data.hp.trim().length > 0) {
    return NextResponse.json({ ok: true, ticket: mkTicket() }); // fake success
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim().toLowerCase();
  const scope = (data.scope ?? "").trim();
  const body = (data.body ?? "").trim();
  const timeline = (data.timeline ?? "").trim().slice(0, 40) || null;
  const budget = (data.budget ?? "").trim().slice(0, 40) || null;
  const theme = data.theme === "light" ? "light" : "dark";

  if (name.length < 1 || name.length > 80)   return bad("name_invalid");
  if (!EMAIL_RE.test(email))                  return bad("email_invalid");
  if (scope.length < 2 || scope.length > 120) return bad("scope_invalid");
  if (body.length < 8 || body.length > 4000)  return bad("body_too_short_or_long");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 200);
  const source = `${ip} · ${ua}`;

  // Soft rate-limit: max 3 inserts per IP in last 60s
  try {
    const recent = await sql()`
      SELECT COUNT(*)::int AS n
      FROM messages
      WHERE source LIKE ${ip + " · %"}
        AND created_at > NOW() - INTERVAL '60 seconds';
    `;
    if (recent[0]?.n >= 3) return bad("rate_limited", 429);
  } catch {
    // if the rate-limit query fails, don't block the submission
  }

  const ticket = mkTicket();
  try {
    await sql()`
      INSERT INTO messages (ticket, name, email, scope, timeline, budget, body, source, theme)
      VALUES (${ticket}, ${name}, ${email}, ${scope}, ${timeline}, ${budget}, ${body}, ${source}, ${theme});
    `;
  } catch (err) {
    console.error("contact insert failed", err);
    return bad("db_error", 500);
  }

  return NextResponse.json({ ok: true, ticket });
}
