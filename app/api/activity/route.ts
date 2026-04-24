import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300; // 5 minutes

type Tick = {
  tag: "SHIP" | "COMMIT" | "OSS" | "TALK" | "PR" | "STAR" | "REPO";
  text: string;
  color: string;
  when?: string;
};

type GhEvent = {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
    ref?: string;
    pull_request?: { title: string; merged?: boolean };
  };
  created_at: string;
};

const COLORS: Record<Tick["tag"], string> = {
  SHIP: "text-violet-300",
  COMMIT: "text-amber-300",
  OSS: "text-rose-300",
  TALK: "text-cyan-300",
  PR: "text-sky-300",
  STAR: "text-fuchsia-300",
  REPO: "text-emerald-300",
};

function firstLine(s: string) {
  return s.split("\n")[0].slice(0, 120);
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/Adwaitbytes/events/public?per_page=25",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "adwait-portfolio",
        },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ ok: false, ticks: [] }, { status: 200 });
    }
    const events = (await res.json()) as GhEvent[];
    const ticks: Tick[] = [];

    for (const e of events) {
      const repo = e.repo?.name?.replace(/^Adwaitbytes\//, "") ?? "";
      if (!repo || repo.toLowerCase() === "adwaitbytes") continue;
      if (e.type === "PushEvent" && e.payload.commits?.length) {
        const msg = firstLine(e.payload.commits[0].message);
        ticks.push({
          tag: "COMMIT",
          text: `${repo} · ${msg}`,
          color: COLORS.COMMIT,
          when: e.created_at,
        });
      } else if (e.type === "PullRequestEvent" && e.payload.pull_request) {
        const merged = e.payload.pull_request.merged ? "merged" : (e.payload.action ?? "updated");
        ticks.push({
          tag: "PR",
          text: `${repo} · PR ${merged} — ${firstLine(e.payload.pull_request.title)}`,
          color: COLORS.PR,
          when: e.created_at,
        });
      } else if (e.type === "CreateEvent" && e.payload.ref_type === "repository") {
        ticks.push({
          tag: "REPO",
          text: `new repo · ${repo}`,
          color: COLORS.REPO,
          when: e.created_at,
        });
      } else if (e.type === "WatchEvent") {
        ticks.push({
          tag: "STAR",
          text: `${repo} picked up a star`,
          color: COLORS.STAR,
          when: e.created_at,
        });
      } else if (e.type === "ReleaseEvent") {
        ticks.push({
          tag: "SHIP",
          text: `${repo} · release shipped`,
          color: COLORS.SHIP,
          when: e.created_at,
        });
      }
      if (ticks.length >= 10) break;
    }

    return NextResponse.json({ ok: true, ticks });
  } catch (err) {
    console.error("activity failed", err);
    return NextResponse.json({ ok: false, ticks: [] }, { status: 200 });
  }
}
