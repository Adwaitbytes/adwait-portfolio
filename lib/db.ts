import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

/**
 * Singleton Neon SQL client. Uses the HTTP serverless driver — zero
 * connection pooling concerns on Vercel Fluid Compute.
 *
 * Usage:
 *   const rows = await sql`SELECT * FROM messages WHERE id = ${id}`;
 */
export function sql(): NeonQueryFunction<false, false> {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (dev) and Vercel env (prod).",
    );
  }
  cached = neon(url);
  return cached;
}
