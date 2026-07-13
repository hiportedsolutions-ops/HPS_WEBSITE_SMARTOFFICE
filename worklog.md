# HPS Website — Work Log

Project: Convert HPS static HTML/CSS/JS site (5 pages) into a fully functional, deploy-ready Next.js 16 single-page application at `/`.

Brand: Hi'ported Professional Services (HPS) — BN:3301544
Tagline: Building Businesses. Creating Opportunities. Sustaining Success.
Theme: Dark ink (#0F151C) + slate (#18212B) + gold (#C9A13B) accents
Fonts: Archivo (headings), Public Sans (body), IBM Plex Mono (labels)

---
Task ID: 1
Agent: main
Task: Initialize worklog, set up HPS brand theme in globals.css, update root layout with brand fonts (Archivo, Public Sans, IBM Plex Mono) and SEO metadata.

Work Log:
- Read CLAUDE.md and all 5 source HTML files + css/style.css + js/main.js to fully understand the brand system, content, and signature interactions (5D framework stepper, mobile menu, scroll reveal).
- Confirmed project stack: Next.js 16 + TS 5 + Tailwind 4 + shadcn/ui + Prisma (SQLite) + z-ai-web-dev-sdk available.
- Will convert 5 pages into one rich, anchor-navigable page at `/` (per env constraint: user only sees /).
- Adding genuine functionality beyond static source: (a) functional contact form via Prisma-backed API route (replaces Formspree placeholder), (b) AI-powered HPS Assistant chat widget using LLM skill, (c) sticky footer, (d) accessible responsive design.

Stage Summary:
- Brand tokens, fonts, and metadata being applied next.

---
Task ID: 2-a
Agent: general-purpose (contact-api)
Task: Build Prisma schema for contact inquiries + POST /api/contact route

Work Log:
- Read worklog.md to absorb project context (HPS single-page app, Next.js 16 + TS5 + Tailwind 4 + Prisma SQLite, replaces Formspree placeholder with real backend).
- Reviewed existing prisma/schema.prisma (User, Post), src/lib/db.ts (singleton PrismaClient, import path @/lib/db), package.json (zod ^4.0.2, no nodemailer).
- Added `ContactInquiry` model to prisma/schema.prisma with fields: id (cuid), name, email, phone, service, message, status (default "new"), createdAt, updatedAt. Existing User/Post models left intact.
- Added `@@index([createdAt])` and `@@index([status])` for efficient admin queries.
- Ran `bun run db:push` from /home/z/my-project — succeeded: "Your database is now in sync with your Prisma schema. Done in 23ms" + Prisma Client v6.19.2 regenerated.
- Verified schema materialized in SQLite: ContactInquiry table has all 9 columns and both indexes (ContactInquiry_createdAt_idx, ContactInquiry_status_idx).
- Created src/app/api/contact/route.ts with:
  - POST handler: JSON body {name,email,phone,service,message}, zod validation (name 2-120, email format, phone 7-25, service enum against 12 exact HPS service categories, message 10-2000), 400 with {error, field?} on failure, 201 with {success:true, id} on success, 500 on unexpected error with brand-friendly fallback message.
  - GET handler: returns {count} only — never exposes inquiry contents (admin/health check).
  - In-memory rate limiting: module-level Map keyed by client IP (from x-forwarded-for, first entry), max 5 submissions per 60s window, 429 with friendly message when exceeded; opportunistic stale-bucket cleanup.
  - Imports { db } from '@/lib/db' as instructed; no email library used.
- Fixed zod v4 syntax issue: `z.enum(values, { errorMap })` -> `z.enum(values, { message })` (errorMap was removed in zod 4).
- Verified TypeScript: `bunx tsc --noEmit` reports zero errors in src/app/api/contact/route.ts (remaining tsc errors are pre-existing in examples/ and skills/ folders, outside this task's scope).
- Verified ESLint: `bunx eslint src/app/api/contact/route.ts` passes clean.
- End-to-end smoke test (direct Prisma + zod invocation): valid input parses and persists; invalid email, short message, and bad service are all rejected with correct messages; create() returns a cuid; count() works; test row cleaned up so DB is left empty for production.

Stage Summary:
- prisma/schema.prisma: ContactInquiry model added with both indexes; User/Post untouched.
- src/app/api/contact/route.ts: full POST (validate + rate-limit + persist) + GET (count-only) handlers, ready to receive the front-end contact form.
- `bun run db:push` succeeded; Prisma Client regenerated; table + indexes verified in SQLite.
- TypeScript + ESLint clean for the new file.
- Replaces the original Formspree placeholder (YOUR_FORM_ID) with a genuinely functional, deploy-ready backend. No external email dependency; persistence to SQLite is sufficient.
- Front-end integration note for the next agent: the contact form should POST JSON to `/api/contact` with the exact field names above and the 12 service values exactly as listed; expect 201 {success, id} on success, 400 {error, field?} on validation failure, 429 {error} on rate limit, 500 {error} on server error.

---
Task ID: 2-b
Agent: general-purpose (chat-api)
Task: Build AI chatbot API route using z-ai-web-dev-sdk LLM

Work Log:
- Read worklog.md to absorb project context (HPS single-page Next.js 16 app; Task 1 set up brand theme/layout; Task 2-a built the Prisma-backed /api/contact route with zod validation + in-memory rate limiting; same patterns to mirror here).
- Reviewed src/app/api/contact/route.ts (existing rate-limit + IP-extraction pattern), package.json (z-ai-web-dev-sdk ^0.0.18 already installed; no install needed), and the LLM skill (z-ai-web-dev-sdk must be server-only; system prompt sent as first message with role 'assistant'; `thinking: { type: 'disabled' }`; read `completion.choices[0]?.message?.content`).
- Inspected node_modules/z-ai-web-dev-sdk/dist/index.d.ts to confirm the SDK API surface: `default export ZAI`, `static create(): Promise<ZAI>`, `zai.chat.completions.create(body) => Promise<any>`, ChatMessage role union `'system' | 'user' | 'assistant'`. Confirmed `ReturnType<typeof ZAI.create>` = `Promise<ZAI>` for safe memoization typing.
- Created src/app/api/chat/route.ts (mkdir -p the chat/ dir first). Implemented:
  - GET handler: returns 200 { ok: true, service: 'HPS Assistant' } — pure health check, no SDK import side-effects at module init (SDK lazily initialized on first POST).
  - POST handler: JSON body { message, history? }.
    * In-memory rate limiting: max 20 req/min/IP via module-level Map keyed by x-forwarded-for[0]; 429 on excess with friendly message; opportunistic stale-bucket cleanup.
    * message validation: must be a non-empty string ≤ 1500 chars; 400 { error: 'Message must be 1–1500 characters.' } otherwise (also 400 on non-JSON body / non-object body).
    * history sanitization: if provided, must be an array of { role, content } with role in ['user','assistant'] and content a non-empty string ≤ 1500 chars. ANY structural invalidity => silently ignore the whole history (per spec, do NOT 400). Truncates to the last 8 entries to bound tokens.
    * Builds messages array: system prompt as first message with role 'assistant' (per SDK convention), then up to 8 history messages, then the new user message.
    * Calls `await getZai()` (memoized `ZAI.create()` promise — initialize once per process, reuse across requests) then `zai.chat.completions.create({ messages, thinking: { type: 'disabled' } })`.
    * Reads `completion.choices[0]?.message?.content?.trim()`; treats empty/null reply as a failure.
    * Returns 200 { reply } on success.
    * try/catch around the entire LLM call: logs `console.error('[chat API]', error)` and returns 500 { error: 'The assistant is unavailable right now. Please try again or message us on WhatsApp.' } on any failure (empty reply, SDK error, network error). Never leaks SDK error details to the client.
  - Embedded the full HPS system prompt verbatim (8 service groups, 3 CAC packages with "Request a Quote" pricing policy, 6-step CAC process, 5D framework, jurisdictions, contact details, BN:3301544, rules of engagement).
- Verified TypeScript: `bunx tsc --noEmit` reports zero errors in src/app/api/chat/route.ts (remaining tsc errors are pre-existing in examples/ and skills/ folders, outside this task's scope — same situation Task 2-a reported).
- Verified ESLint: `bunx eslint src/app/api/chat/route.ts` passes clean (no output).
- Did NOT start the dev server, did NOT modify page.tsx/layout.tsx/globals.css/src/lib/db.ts/prisma/schema.prisma, did NOT install anything.

Stage Summary:
- New file: src/app/api/chat/route.ts — server-only Next.js 16 App Router route handler.
- Endpoint contract (for the front-end dev building the floating HPS Assistant widget):
  * GET  /api/chat -> 200 { ok: true, service: 'HPS Assistant' }
  * POST /api/chat
      Request:  { message: string (1–1500 chars, required),
                  history?: Array<{ role: 'user' | 'assistant'; content: string }> }
      200 { reply: string }                                     // success
      400 { error: 'Message must be 1–1500 characters.' }       // bad message / bad JSON
      429 { error: 'Too many requests. Please slow down and try again shortly.' }
      500 { error: 'The assistant is unavailable right now. Please try again or message us on WhatsApp.' }
- LLM: z-ai-web-dev-sdk v0.0.18, memoized ZAI.create(), chat.completions.create with thinking disabled; system prompt sent as first 'assistant' message; up to last 8 history entries forwarded.
- Rate limited: 20 req/min/IP, in-memory Map, 429 on excess.
- Safe error handling: SDK errors logged server-side, generic brand-friendly fallback returned to client; no SDK internals leaked.
- TypeScript + ESLint clean for the new file. Ready to be wired up to the floating HPS Assistant chat widget by the next agent.

---
Task ID: 3-7
Agent: main
Task: Build all HPS section components, assemble page.tsx, run lint/dev, and self-verify with Agent Browser.

Work Log:
- Created `src/lib/hps-data.ts` as the single source of truth for all section content (solutions, framework steps, industries, why-cards, stories, CAC packages/steps/checklists/FAQs, service groups, values, service options, contact details).
- Created `src/components/hps/reveal.tsx` — client Reveal wrapper replacing the original IntersectionObserver logic; respects prefers-reduced-motion via CSS.
- Created 16 section components in `src/components/hps/`:
  - `nav.tsx` — fixed nav with scroll-state styling, mobile drawer, body-scroll lock.
  - `hero.tsx` — hero with grid backdrop, gold gradient headline, dual CTAs, BN tag.
  - `trustbar.tsx` — diamond-bullet trust strip.
  - `purpose.tsx` — "Why HPS Exists" with 12/3/1 stat panel.
  - `solutions.tsx` — 6 solution cards with lucide icons + hover gold accent.
  - `framework.tsx` — signature 5D Business Growth Framework stepper (auto-advance every 4.5s, click-to-activate, progress bar).
  - `industries.tsx` — CSS marquee of 13 industries (pauses on hover).
  - `why-hps.tsx` — 6 reasons cards with check icons.
  - `stories.tsx` — 3 Challenge/Solution/Result cards on paper bg.
  - `school-marketplace.tsx` — duo strip for Business School + Marketplace.
  - `cac-section.tsx` — full CAC page: 3 packages (Business Name / LTD featured / NGO), 6-step process, 2 doc checklists, 5-question FAQ accordion, CTA strip. "Request a Quote" buttons dispatch a custom `hps:selectService` event that pre-selects the matching option in the contact form and smooth-scrolls to it.
  - `services.tsx` — all 8 service groups with 12 service lines, anchor IDs for deep-linking.
  - `about.tsx` — story, vision/mission, 8 guiding principles, ideal clients.
  - `contact-section.tsx` — functional form posting to `/api/contact` with zod-validated fields, success state, toast feedback, WhatsApp fallback; reads `?service=` URL param and listens for `hps:selectService` events.
  - `cta.tsx` — gradient CTA band.
  - `footer.tsx` — 4-column footer with brand, solutions, company, get-started links + bottom bar.
  - `chat-widget.tsx` — floating HPS Assistant (gold gradient FAB), chat panel with greeting, 4 suggestion chips, message bubbles, typing indicator, WhatsApp error fallback, posts to `/api/chat` with conversation history.
- Assembled `src/app/page.tsx` as a server component that composes all sections inside a `min-h-screen flex flex-col` wrapper (sticky-footer pattern) with `<main className="flex-1">` and `<Footer />` after it.
- Updated `eslint.config.mjs` to ignore `upload/`, `download/`, `mini-services/` folders.
- Fixed lint: removed unused eslint-disable in framework.tsx, simplified reveal.tsx reduced-motion branch (CSS handles visibility so no setState needed).
- `bun run lint` → clean (0 errors, 0 warnings).
- Started dev server with double-fork setsid detachment so it survives across bash sessions. Confirmed: `✓ Ready in 944ms`, no compile errors.
- Agent Browser verification (all passed):
  - Page loads with correct title and all 16 sections render (verified via interactive snapshot).
  - No console errors, no page errors.
  - FAQ accordion expands/collapses correctly (`expanded=true` after click).
  - 5D Framework: clicking a stage activates it.
  - CAC "Request a Quote" button smooth-scrolls to contact form AND pre-selects the matching service in the dropdown (verified `get value` = "CAC Registration (Business Name)").
  - Contact form: filled all fields, clicked Send → `POST /api/contact 201`, Prisma INSERT visible in dev log, success state "Thank you — message received." displayed, API count incremented.
  - Chat widget: opened via FAB, clicked suggestion chip "How do I register a business with CAC?" → `POST /api/chat 200` in 2.6s, LLM returned an on-brand response mentioning the 3 CAC packages, 6-step process, TIN guidance, and WhatsApp link.
  - Mobile viewport (375×812): content fits with no horizontal overflow, nav collapses to MENU button, mobile drawer opens with all nav links.
  - Sticky nav: confirmed `position: fixed` and `top: 0` after scrolling.
  - Sticky footer: confirmed footer is at the bottom of the page (`footerRectBottom` ≈ `bodyHeight`); layout uses `min-h-screen flex flex-col` + `flex-1` main so footer sticks on short pages too.
  - VLM (vision model) verification of screenshots: all 5 desktop checks passed (dark theme, gold logo, gold gradient headline, dual CTAs, professional layout) and all 4 mobile checks passed (responsive, collapsed nav, readable hero, clean layout).

Stage Summary:
- Production-ready HPS website live at http://localhost:3000 (port 3000).
- All 5 original static pages consolidated into one rich, anchor-navigable single-page app at `/`.
- Brand identity preserved exactly: dark ink (#0F151C) + slate (#18212B) + gold (#C9A13B) + Archivo/Public Sans/IBM Plex Mono fonts.
- Two genuine backend capabilities added beyond the static source:
  1. Functional contact form (Prisma + SQLite, zod validation, rate limiting) — replaces Formspree placeholder.
  2. AI-powered HPS Assistant chatbot (z-ai-web-dev-sdk LLM) — answers visitor questions about services, CAC packages, process; steers to consultation/WhatsApp.
- Signature 5D Business Growth Framework preserved as interactive element.
- BN:3301544 visible in hero, contact, chat footer, and page footer.
- Zero lint errors, zero console errors, all core flows verified end-to-end in the browser.

---
Task ID: 8
Agent: main
Task: Re-theme entire HPS site from dark ink/gold-on-slate to WHITE background + ROYAL BLUE primary (#0057B8) + METALLIC GOLD (#D4AF37) secondary, per client's official corporate colours.

Work Log:
- Rewrote `src/app/globals.css` with new light-first token set:
  - Page background → #FFFFFF (white); cards → #F6F8FB (light blue-gray); card hover → #EEF2F7
  - Primary accent → Royal Blue #0057B8 (hover #0066CC); introduced --color-blue-deep #0A2540 for footer
  - Secondary accent → Metallic Gold #D4AF37 (bright #E6C466) — used sparingly for highlights
  - Borders → #E2E8F0 (light); muted text → #5A6572
  - Updated all shadcn theme tokens (--background, --primary, --border, etc.) to match
  - `.btn-gold` now renders a Royal Blue gradient button with white text (kept class name to minimize churn)
  - `.btn-ghost` now a blue outline button
  - `.gold-text` gradient re-tuned to metallic gold (#B8902E→#E6C466→#F0D980→#C49B2F→#9A7A25)
  - `.hps-logo-mark` now gold gradient with WHITE "HPS" text (signature brand element)
  - `.hero-grid-bg` now faint blue lines on white
- Updated all 16 section components to remove dark-theme hardcoded colors:
  - `nav.tsx` — white/translucent bg, blue links, navy wordmark, gold logo mark
  - `hero.tsx` — white bg with subtle blue + gold radial glows, gold-text headline, blue CTAs
  - `trustbar.tsx` — light blue-gray strip, gold diamonds
  - `purpose.tsx` — white bg, blue stat numbers, blue eyebrow
  - `solutions.tsx` — light blue-gray bg, white cards, blue icons + tag chips, gold hover accent bar, rounded corners
  - `framework.tsx` — white cards, blue active heading, gold progress bar, light borders
  - `industries.tsx` — light bg, white chips, blue hover
  - `why-hps.tsx` — white cards, blue check icons, blue hover border
  - `stories.tsx` — light bg, white cards, blue labels, gold "Result" label
  - `school-marketplace.tsx` — white duo cards, light divider
  - `cac-section.tsx` — white package cards, blue featured border + shadow, gold MOST POPULAR tag, blue numbered step badges, blue FAQ +/- icons, blue "Also available" text, rounded cards
  - `services.tsx` — white bg, gold ◈ group icons, white service cells with light hover
  - `about.tsx` — white hero with blue/gold radials, blue values headings, light ideal-client chips
  - `contact-section.tsx` — white form on light blue-gray card, blue focus rings, blue contact icons, white inputs
  - `cta.tsx` — Royal Blue → navy gradient bg, white + gold headline, GOLD "Book a Consultation" button (striking focal point)
  - `footer.tsx` — deep navy (#0A2540) bg, white wordmark, gold column headings + diamonds, light blue-gray links
  - `chat-widget.tsx` — Royal Blue FAB with gold notification dot, blue→navy header with gold sparkles icon, white assistant bubbles, blue user bubbles, white panel on light bg
- `bun run lint` → clean (0 errors, 0 warnings)
- Dev server HMR recompiled every file save with no errors; homepage returns HTTP 200.
- Agent Browser + VLM visual verification (all PASS):
  - Desktop hero: white bg ✓, gold hex logo mark with white text ✓, navy wordmark ✓, dark-gray nav links ✓, gold gradient on "Creating Opportunities." ✓, Royal Blue primary button ✓, blue ghost button ✓, subtle blue grid ✓
  - CTA section: Royal Blue→navy gradient bg ✓, white+gold headline ✓, gold button ✓, premium look ✓
  - Footer: deep navy bg ✓, gold logo + white wordmark ✓, gold column headings ✓, readable links ✓, BN:3301544 present ✓
  - Mobile (375px): white bg, no overflow ✓, gold logo + navy wordmark ✓, blue MENU button ✓, readable gold-gradient headline ✓, blue primary button ✓
  - Solutions section: light blue-gray bg ✓, white rounded cards ✓, blue icons ✓, blue tag chips ✓, navy heading ✓
  - Chat widget: Royal Blue FAB with gold dot ✓, blue→navy header with gold sparkles ✓, white greeting bubble ✓, blue-bordered suggestion chips ✓, blue send button ✓
- Functional re-test: opened chat, clicked "How do I register a business with CAC?" suggestion → POST /api/chat 200 in 3.3s, LLM returned on-brand answer mentioning the 3 CAC packages, 6-step process, and WhatsApp link with BN:3301544.

Stage Summary:
- Full theme transformation complete and verified. Site is now WHITE background with ROYAL BLUE (#0057B8) as the primary brand color and METALLIC GOLD (#D4AF37) as subtle highlights — exactly matching HPS's official corporate colour palette.
- Gold is reserved for: logo mark, gold-text headline phrases, decorative ◆ diamonds, "MOST POPULAR" tag, framework progress bar, card hover accent bars, footer column headings, CTA button (on blue), and chat widget sparkles/notification dot.
- Blue is the primary interactive color: all buttons (solid + ghost), eyebrows, icons, links, active states, focus rings, form accents, numbered step badges, user chat bubbles, CTA background, footer deep-navy.
- All previously-built functionality preserved: contact form (Prisma-backed), AI chatbot (LLM-backed), 5D framework stepper, FAQ accordion, CAC package→contact-form pre-select, mobile menu, sticky nav, sticky footer, responsive design.
- Zero lint errors, zero console errors, all VLM visual checks PASS on desktop + mobile + all key sections.

---
Task ID: 9
Agent: main
Task: Replace the gold hexagonal logo mark with the client's actual company logo (New_Logo.png) and change the header wordmark from "HI'PORTED" to "HI'PORTED PROFESSIONAL SERVICE".

Work Log:
- Inspected uploaded `/home/z/my-project/upload/New_Logo.png` (1254×1254 PNG, 868KB, solid white background, blue "HPS" lettering with gold curved accents).
- VLM confirmed: logo is a stylized HPS mark in blue + gold — perfect match for the new white/blue/gold theme.
- Processed the logo with a Python/PIL script:
  - Converted to RGBA.
  - Removed the white background via luminance threshold (≥245 on all RGB channels → transparent alpha). 70.8% of pixels became transparent (the background).
  - Saved 4 versions to `/home/z/my-project/public/`:
    - `hps-logo.png` — 256×256 transparent PNG, 43 KB (nav + footer display, retina-ready for up to 128px @2x)
    - `hps-logo-full.png` — full 1254×1254 transparent (kept for future large-format use)
    - `hps-favicon.png` — 32×32, 2 KB
    - `hps-favicon-64.png` — 64×64, 5 KB (crisper favicon @2x)
  - File size dropped from 868 KB → 43 KB for the nav logo (95% reduction).
- VLM re-verified the transparent logo: blue letters + gold accents intact, no artifacts, clean edges.
- Updated `src/app/layout.tsx` metadata.icons: replaced the z.ai SVG favicon with HPS favicons (32px + 64px + apple touch icon).
- Updated `src/components/hps/nav.tsx`:
  - Replaced `<span className="hps-logo-mark">HPS</span>` (gold hexagon) with `<img src="/hps-logo.png" />` (44px, object-contain) — transparent logo blends seamlessly on the white nav.
  - Replaced the single-line "HI'PORTED" wordmark with a two-line stacked corporate lockup:
    - Line 1: "HI'PORTED" (Archivo extrabold, dark navy #0A2540, 0.95→1.05rem responsive)
    - Line 2: "Professional Service" (IBM Plex Mono, Royal Blue, uppercase, 0.58→0.62rem, letter-spacing 0.14em)
  - Logo + wordmark responsive: logo 40px on mobile / 44px on desktop; wordmark font scales up at sm: breakpoint.
- Updated `src/components/hps/footer.tsx` with the same logo image (48px) + stacked wordmark, but tuned for the navy background:
  - "HI'PORTED" in white, "Professional Service" in gold (#E6C466) — matches the footer's gold accent system.
  - Transparent logo displays cleanly on the deep-navy footer (no white box, verified by VLM).
- `bun run lint` → clean (0 errors, 0 warnings).
- Dev server HMR recompiled all changes with no errors; logo + favicon serve correctly (`/hps-logo.png` 200, 44 KB, image/png).
- Agent Browser + VLM visual verification (all PASS):
  - Desktop nav: blue/gold HPS logo image ✓, two-line stacked wordmark "HI'PORTED" / "Professional Service" ✓, reads "HI'PORTED PROFESSIONAL SERVICE" ✓, nav links + blue button visible ✓, professional ✓.
  - Mobile nav (375px): logo + stacked wordmark visible and readable ✓, no overflow ✓, blue MENU button ✓.
  - Mobile menu drawer: opens correctly, all 5 nav links + blue "Book a Consultation" button visible ✓.
  - Footer: HPS logo image (not hexagon) ✓, stacked wordmark "HI'PORTED" (white) / "Professional Service" (gold) ✓, transparent logo on navy (no white box) ✓, gold column headings + contact details intact ✓.
- Zero console errors. All previously-built functionality preserved.

Stage Summary:
- The HPS company logo (blue + gold stylized mark) now appears in the nav and footer, replacing the placeholder gold hexagonal "HPS" text mark.
- The header wordmark now reads "HI'PORTED PROFESSIONAL SERVICE" as a polished two-line corporate lockup (HI'PORTED / Professional Service) in both the nav (navy + blue) and footer (white + gold).
- The logo is transparent (white background removed) so it renders cleanly on both the white nav and the deep-navy footer.
- Favicon updated from z.ai to the HPS logo.
- Logo optimized from 868 KB → 43 KB (95% smaller) with no quality loss at display size.

---
Task ID: 10
Agent: main
Task: Apply 11 content edits — remove all em-dashes (decorative + text), update tagline wording, fix Accounting tag, rewrite Industries heading+desc, rewrite Why-HPS heading, point CAC "Start My Registration" buttons to Google Forms, and update business address everywhere.

Work Log:
- `src/lib/hps-data.ts`:
  - HPS_CONTACT.tagline → "Building Businesses, Creating Opportunities and Sustaining Success."
  - HPS_CONTACT.address → "Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balangan Street, Area 11 Garki Abuja-Nigeria." (also corrected "Balanga" → "Balangan")
  - HPS_CONTACT.hours → en-dashes converted to hyphens ("Mon-Fri · 9:00-17:00 WAT")
  - SOLUTIONS Accounting tags: "REPORTING" → "FINANCIAL REPORTING"
  - SOLUTIONS Business Registration desc: removed em-dash
  - FRAMEWORK_STEPS: removed em-dashes from Discover/Design/Deploy/Develop descriptions
  - WHY_HPS: removed em-dashes from Technology-Driven + End-to-End Solutions descriptions
  - VALUES: removed em-dashes from Integrity/Innovation/Continuous Learning descriptions
  - SERVICE_GROUPS: removed em-dashes from registration/advisory/tech descriptions
  - CAC_STEPS: removed em-dashes from steps 1 + 5
  - CAC_FAQS: removed em-dashes from answers 2/4/5 + question 3
  - STORIES: removed em-dash from result 3
  - CAC_PACKAGES: added `formUrl` field per package (Business Name → Enxqq43wjRYiDx4PA; LTD → LinpnZVRbeSxGFuP6; NGO → LinpnZVRbeSxGFuP6)
- `src/app/layout.tsx`: metadata.title em-dash → pipe; tagline updated to commas+and
- `src/app/globals.css`: removed `.hps-eyebrow::before` decorative rule (the gold dash before every eyebrow)
- `src/components/hps/hero.tsx`: 3-line headline now "Building Businesses," / "Creating Opportunities" (gold) / "and Sustaining Success."; body em-dash → comma; reg-tag "RC: BN:3301544 · GARKI ABUJA-NIGERIA"
- `src/components/hps/purpose.tsx`: removed em-dashes in purpose-points + body
- `src/components/hps/solutions.tsx`: removed em-dash in section desc; aria-label em-dash → comma
- `src/components/hps/industries.tsx`: heading → "Local relevance with International reach."; desc → "From startups in Nigeria to organizations expanding into the UK and US, we understand..."
- `src/components/hps/why-hps.tsx`: heading → "More than problem-solver, we are your growth partner"
- `src/components/hps/school-marketplace.tsx`: removed em-dashes in both descriptions
- `src/components/hps/cac-section.tsx`:
  - h1 em-dash removed: "Register your business with CAC, properly and without stress."
  - Hero "Start My Registration" → external link https://forms.gle/LinpnZVRbeSxGFuP6 (target=_blank)
  - 3 package buttons: replaced onClick event-dispatch logic with direct `<a href={p.formUrl} target="_blank">Start My Registration</a>` (label changed from "Request a Quote")
  - Bottom CTA "Start My Registration" → same Google Form link
  - CTA strip body em-dash → comma
- `src/components/hps/services.tsx`: removed em-dash in hero desc
- `src/components/hps/about.tsx`: removed em-dashes in hero h1 + 2 story paragraphs
- `src/components/hps/contact-section.tsx`: removed em-dashes in 3 strings (consultation desc, WhatsApp label, success heading)
- `src/components/hps/cta.tsx`: removed the two decorative gold rule spans around the eyebrow text
- `src/components/hps/chat-widget.tsx`: greeting "Hello — I'm" → "Hello, I'm"; network error em-dash → comma
- `src/components/hps/footer.tsx`: aria-label em-dash → comma; location "GARKI, ABUJA" → "GARKI ABUJA-NIGERIA"; tagline "BUILDING BUSINESSES · CREATING OPPORTUNITIES · SUSTAINING SUCCESS" → "BUILDING BUSINESSES, CREATING OPPORTUNITIES AND SUSTAINING SUCCESS"
- `bun run lint` → clean (0 errors)
- Dev server HMR recompiled all changes cleanly; homepage HTTP 200.
- Agent Browser verification (all PASS):
  - Page title: "Hi'ported Professional Services | Building Businesses, Creating Opportunities and Sustaining Success." (no em-dash, new tagline)
  - Hero: eyebrow has NO decorative dash before it ✓; headline reads "Building Businesses, / Creating Opportunities / and Sustaining Success." ✓; no em-dashes ✓
  - CAC packages: 3 cards each with "Start My Registration" button ✓; Business Name → Enxqq43wjRYiDx4PA ✓; LTD → LinpnZVRbeSxGFuP6 ✓; NGO → LinpnZVRbeSxGFuP6 ✓; hero + bottom CTA → LinpnZVRbeSxGFuP6 ✓; all open in new tab
  - Industries heading: "Local relevance with International reach." ✓
  - Why HPS heading: "More than problem-solver, we are your growth partner" ✓
  - Accounting Solutions tag: "FINANCIAL REPORTING" ✓
  - Address (contact + footer): "Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balangan Street, Area 11 Garki Abuja-Nigeria." ✓
  - Footer tagline: "BUILDING BUSINESSES, CREATING OPPORTUNITIES AND SUSTAINING SUCCESS" ✓
  - Chat greeting: "Hello, I'm the HPS Assistant..." (no em-dash) ✓
  - Full-page em-dash scan: "NO em-dashes in visible text" ✓
  - Zero console errors

Stage Summary:
- All 11 requested edits applied and verified.
- Every em-dash (—) in user-visible text and aria-labels removed (replaced with commas, colons, periods, or restructured); only developer code comments retain em-dashes (invisible to end users).
- Decorative gold dash/rule before section eyebrows removed globally.
- Tagline updated everywhere (hero headline, page title, footer bar) to "Building Businesses, Creating Opportunities and Sustaining Success."
- CAC "Start My Registration" buttons (hero, 3 packages, bottom CTA) now link directly to the client's Google Forms in new tabs (Business Name gets its own form; LTD/NGO/hero/bottom share the other form).
- Business address updated to "Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balangan Street, Area 11 Garki Abuja-Nigeria." across contact section, footer, and hero reg-tag.
- Zero lint errors, zero console errors, zero em-dashes in visible page text.
