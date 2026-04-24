import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const revalidate = 20; // allow Vercel's Data Cache to hold the answer briefly

export async function GET() {
  try {
    const total = await sql()`SELECT COUNT(*)::int AS n FROM messages;`;
    const month = await sql()`
      SELECT COUNT(*)::int AS n
      FROM messages
      WHERE created_at > NOW() - INTERVAL '30 days';
    `;
    const last = await sql()`
      SELECT created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    return NextResponse.json({
      ok: true,
      total: total[0].n,
      last30: month[0].n,
      lastAt: last[0]?.created_at ?? null,
    });
  } catch (err) {
    console.error("stats failed", err);
    return NextResponse.json({ ok: false, total: 0, last30: 0 }, { status: 200 });
  }
}
