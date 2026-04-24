#!/usr/bin/env node
// One-shot schema bootstrap. Run with:  node --env-file=.env.local scripts/init-db.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — aborting.");
  process.exit(1);
}

const sql = neon(url);

const ddl = `
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  ticket      TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  scope       TEXT NOT NULL,
  timeline    TEXT,
  budget      TEXT,
  body        TEXT NOT NULL,
  source      TEXT,
  theme       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const idx = `CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);`;

try {
  await sql.query(ddl);
  await sql.query(idx);
  const rows = await sql`SELECT COUNT(*)::int AS n FROM messages;`;
  console.log("OK — messages table ready. Current rows:", rows[0].n);
} catch (err) {
  console.error("FAILED:", err);
  process.exit(1);
}
