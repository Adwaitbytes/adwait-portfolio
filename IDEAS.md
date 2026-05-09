# Portfolio — feature backlog

> Wild / never-seen features to push this site beyond "polished portfolio"
> into something people screenshot and share. Every item below is shippable
> with the existing stack (Next.js 15, Tailwind v4, motion/react, Groq Llama
> via @ai-sdk/groq, Neon Postgres, html-to-image, raw WebGL). External
> dependencies are noted where they apply.
>
> Effort estimates are rough engineering hours assuming the current
> codebase structure.

---

## Tier 0 — wild, never-seen-on-portfolios

### 1. Live visitor cursors
**~6h · needs Pusher / Partykit free tier**

See other people's cursors moving on YOUR site in real time. Each visitor
gets a random color + first 6 chars of their session ID + an inferred city
(via geo-IP). People wave at each other across the world. Aggressively
viral.

- WebSocket channel keyed by URL path
- Throttle cursor broadcasts to 30 Hz max
- Show "12 people exploring now" badge in Director's Console

### 2. AI Interviewer mode
**~4h · uses our existing Groq endpoint**

Flip the contact form. Instead of the visitor filling fields, the AI asks
THEM questions in a chat:
- "What are you building?"
- "What's the scope you'd want Adwait to own?"
- "Timeline?"
- "Budget shape?"

When the conversation feels complete, AI summarizes into a structured
ticket and drops it into Neon. Auto-vetted leads, much higher signal than
a form.

### 3. Voice mode
**~6h · ElevenLabs voice clone (~$5/mo) OR free browser TTS**

Click a mic button, speak your question, hear the AI answer back in
Adwait's actual voice (clone via ElevenLabs) or generic browser TTS.
Real "talk to Adwait" experience.

- Web Speech API for STT
- Existing /api/ask for response
- ElevenLabs TTS for output (cached per response)

### 4. GitHub commit heatmap as 3D city
**~5h · uses existing GitHub events API**

The classic GitHub contribution graph rendered as a WebGL 3D city —
skyscrapers for days you committed most. Camera pans through. Click a
building to see that day's commits. Genuinely never-seen on a portfolio.

### 5. Audience modes (Recruiter / Founder / Engineer)
**~4h · uses our Groq endpoint**

Single toggle (top-right of nav) re-skins the entire site:
- Reorders sections (Recruiter → About first, Founder → Showcase first,
  Engineer → Craft first)
- AI rewrites the Hero tagline per audience
- Different stat labels surface (Recruiter sees years, Engineer sees stack
  depth, Founder sees shipping velocity)

Persists in localStorage.

---

## Tier 1 — visually striking, low effort

### 6. Live "Now Playing" from Spotify
**~2h · Spotify Web API**

Pull the currently-playing track from Adwait's Spotify account, show in
Director's Console. Updates every 30s. Adds a subtle "this is a real
person right now" signal.

### 7. Real Bhopal weather as ambient particles
**~3h · OpenWeather free tier**

Fetch weather in Bhopal, render rain / snow / fog / clear behind everything
as canvas particles. Live atmosphere — site feels physically tied to where
Adwait actually is.

### 8. Tilt the medallion on mobile (gyroscope)
**~2h · DeviceOrientation API**

On phones, device gyroscope drives the WebGL medallion's `uMouse` uniform.
The medallion physically tilts when you tilt your phone. Every mobile
visitor goes "oh shit."

- requestPermission() flow on iOS
- Smooth tilt with exponential decay

### 9. Scratch-to-reveal projects
**~4h · canvas + masking**

Showcase tiles start blurred / pixelated. Cursor "scratches" them clear
like a lottery ticket. Each card reveals progressively as you sweep
across it. Tactile delight.

### 10. Star map of Bhopal sky right now
**~3h · astronomy library**

Replace SceneDivider's random stars with REAL constellations visible from
Bhopal at this very moment. Use a star-position library (e.g.
astronomy-engine npm). Stars rise/set with actual sidereal time.

---

## Tier 2 — AI / data flex

### 11. Auto-tailored PDF resume
**~6h · html-to-image + jsPDF**

Vectorize each section, track scroll dwell-time per section in
sessionStorage. AI generates a 1-page PDF that LEADS with what the visitor
cared about most. Download from Director's Console.

### 12. AI judgment demo
**~3h · uses existing Groq endpoint**

Open the terminal (backtick), type `review <paste code>`. Groq reviews it
in Adwait's voice ("this is fine but I'd kill the abstraction here").
Demonstrates his taste / judgment, not just shipping.

### 13. Live commit ticker → Twitter
**~3h · X API**

Every push to a public repo auto-tweets via Adwait's X account ("just
shipped X to <repo>"). The site IS the marketing channel. Compounds his
distribution.

### 14. Radically open analytics
**~3h · Vercel Analytics or self-hosted Plausible**

Brutalist sidebar showing live site stats: "47 visits today · 12 engaged ·
3 ticketed · top scene: showcase." Transparency as flex.

### 15. Wakatime hours this week
**~1h · Wakatime API**

Actual coding hours pulled from Wakatime API, shown as a mono-font streak
in Director's Console: "this week: 47.3h · last week: 52.1h." Shows
he actually grinds.

---

## Tier 3 — interaction / game

### 16. Play-your-portfolio mini-game
**~10h · canvas / Three.js**

Fly a spaceship through the Showcase. Each project is a planet. Land on
one to "open" it (= open the project URL). Gamified discovery for the
patient visitor.

### 17. Konami → 8-bit DOS mode
**~5h · CSS reskin**

Konami code triggers full pixel-art retro reskin (lasts 30s). Site
becomes a green-on-black DOS interface. Pure flex.

### 18. Drag-and-rearrange Showcase
**~3h · @dnd-kit/core or framer-motion drag**

Visitor reorders project cards. Their layout persists in localStorage.
Tiny ownership signal that hooks engagement.

### 19. Pet companion (pixel saara)
**~4h · canvas sprite**

Pixel-art "Saara" mascot follows the cursor at a delay. Reacts to clicks
(small jump). Gets sleepy / shows a "Z" if idle for 30s. Lives between
sessions.

### 20. Letter from Adwait
**~2h · typing animation**

A new section between Timeline and FAQ: an 800-word personal essay that
types itself out at human reading speed (~60wpm) when the section enters
viewport. Intimate, slow, deliberate. Doesn't try to "sell" — just talks.

---

## Tier 4 — moonshots

### 21. AR project preview
**~12h · WebXR · mobile-only**

Point phone camera at any flat surface. Projects float in 3D space as
holographic cards you can walk around. WebXR.

### 22. "Time machine" slider
**~10h · git history + pre-rendered snapshots**

Drag a slider to see the portfolio at any point in the last 12 months.
Pre-render snapshots from git tags. Watch Adwait's career compress into
a 5-second swipe.

### 23. Voice-clone narrated tour
**~6h · ElevenLabs**

90-second guided audio tour. AI-Adwait walks you through the site (Hero →
Voxa → Prophit → Contact). Auto-syncs to scroll position. Hit play once,
sit back.

### 24. Co-sign wall
**~6h · GitHub / Twitter OAuth + Neon**

Anyone can leave a public endorsement after Twitter or GitHub OAuth
("verified human"). Shows on a wall section. Becomes social proof at
zero cost.

### 25. "Buy an hour of Adwait"
**~5h · Stripe + Cal.com**

Stripe-powered "buy 1 hour of Adwait consult" button → calendar slot
picker → Zoom link auto-issued → booking persists in Neon. Direct
revenue from the site.

---

## Already shipped (so we don't re-build)

- WebGL medallion shader (domain-warped FBM noise + scroll-velocity warp)
- Magnetic letters on Hero name (per-letter motion springs)
- Cursor ink trail (scene-aware color via Director's Console phase)
- 3D perspective tilt on Showcase cards
- Play Reel auto-scroll mode (1x / 2x / 4x, SPACE to toggle)
- Director's Console (live IST clock, time-of-day phase, scene scroll-spy)
- ChordNav (Vim-style g+h/s/o/k/t/w/f/c shortcuts, ? help sheet)
- Command palette (⌘K)
- Terminal mode (backtick → adwait.os shell with ls / cat / open / ask /
  go / theme / play / clear / exit)
- Ask Adwait AI concierge (Groq Llama 3.3 70B, streaming, persisted in
  localStorage, ESC + click-outside close, markdown renderer, abort)
- Live GitHub activity feed (in LiveTicker, /api/activity, 5min cache)
- Print Frame poster export (html-to-image, downloadable 1080x1350 PNG)
- Light/dark mode with View Transitions API circle-clip toggle
- Boot sequence (sessionStorage gate)
- Scene dividers (film strip + parallax starfield + scramble-text)
- Chromatic aberration on fast scroll (suppressed during reel playback)
- Custom cursor (mix-blend-difference with theme-aware fallback in light)
- "adwait" easter egg (rainbow cursor + grain pulse, 8s)
- Contact form: cinematic multi-step slate + Neon-backed ticket persistence

---

## Pick order if I had to choose

If I were the one ranking by impact-per-effort:

1. **#5 Audience modes** — biggest "wow" + uses existing AI
2. **#2 AI Interviewer** — actually useful conversion tool
3. **#8 Mobile gyroscope medallion** — every phone visitor will react
4. **#10 Real Bhopal star map** — atmospheric, ties Scene dividers to reality
5. **#15 Wakatime streak** — shows actual grind, takes 1h

Then the moonshots (#22 Time Machine, #25 Buy an hour of Adwait) become
the lifetime hooks.
