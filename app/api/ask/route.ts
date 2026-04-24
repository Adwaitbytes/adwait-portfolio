import { NextResponse } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { profile, projects, craft, timeline, faq } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 30; // Groq is fast; cap at 30s

type Msg = { role: "user" | "assistant"; content: string };

function buildSystemPrompt() {
  const proj = projects
    .map(
      (p) =>
        `- ${p.name} (${p.year}, ${p.status ?? "?"}): ${p.kicker}. ${p.summary} Stack: ${p.stack.join(", ")}. Tags: ${p.tags.join(", ")}. Link: ${p.href ?? "n/a"}.`,
    )
    .join("\n");

  const tl = timeline
    .map((t) => `- ${t.when} · ${t.title} · ${t.org} — ${t.body}`)
    .join("\n");

  const stacks = craft
    .map((c) => `- ${c.title}: ${c.items.join(", ")}`)
    .join("\n");

  const faqBlock = faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return `You are speaking AS Adwait Keshari's portfolio concierge — answering questions from visitors (recruiters, founders, engineers).

VOICE:
- Sharp, terse, confident. First-person when the visitor is asking directly about Adwait ("I built…", "My stack is…"). Third-person only when reporting facts.
- No marketing fluff. No "I'd be happy to help". Get to the answer in the first sentence.
- Max 4 short paragraphs. Usually 1–2 sentences is enough.
- Use markdown sparingly (bold, lists) only when it genuinely helps scanning.
- If something isn't in the grounding data, say "I don't know — ask me ${profile.email}" rather than invent.
- NEVER write disclaimers like "I am an AI" or "as a language model".
- Prefer concrete numbers and links over abstract claims.

GROUNDING:

NAME: ${profile.name}
ROLE: ${profile.role}
LOCATION: ${profile.location}
EMAIL: ${profile.email}
TAGLINE: ${profile.tagline}
SOCIALS: github=${profile.social.github} · twitter=${profile.social.twitter} · linkedin=${profile.social.linkedin}

PROJECTS (priority order, newest first):
${proj}

TIMELINE:
${tl}

STACK SURFACE:
${stacks}

CANNED FAQ (reuse verbatim if a visitor asks any of these):
${faqBlock}

If someone asks what's unique — lead with: real client work (insiders.bot, BackerStage), shipping cadence (9 prod products), and the combination of applied AI + crypto + product instinct.`;
}

export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GROQ_API_KEY missing" },
      { status: 500 },
    );
  }

  let body: { messages?: Msg[]; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Accept either a messages array (chat mode) or a single question string.
  const history: Msg[] =
    body.messages ??
    (body.question ? [{ role: "user", content: String(body.question) }] : []);

  if (history.length === 0) {
    return NextResponse.json({ error: "no_input" }, { status: 400 });
  }

  // Hard-cap total user input to avoid abuse.
  const totalChars = history.reduce((n, m) => n + (m.content?.length ?? 0), 0);
  if (totalChars > 6000) {
    return NextResponse.json({ error: "too_long" }, { status: 413 });
  }

  const groq = createGroq({ apiKey: key });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: buildSystemPrompt(),
    messages: convertToModelMessages(
      history.map((m) => ({
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      })),
    ),
    temperature: 0.5,
    maxOutputTokens: 600,
  });

  return result.toTextStreamResponse();
}
