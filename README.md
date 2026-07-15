# Hi'ported Professional Services (HPS) — Website

**Tagline:** Building Businesses, Creating Opportunities & Sustaining Success.
**BN:** 3301544 · Garki, Abuja, Nigeria

A production-ready, deploy-ready Next.js 16 website for Hi'ported Professional
Services — a business growth and enterprise solutions company.

---

## 1. Tech Stack

| Layer | Technology |
|------|------------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + custom HPS design tokens |
| UI components | **shadcn/ui** (New York) + **Lucide** icons |
| Database | **Prisma ORM** with **SQLite** |
| AI assistant | **z-ai-web-dev-sdk** (LLM chat completions) |
| Runtime | **Bun** (or npm/yarn/pnpm) |

---

## 2. Project Structure

```
hps-website/
├── prisma/
│   └── schema.prisma              # ContactInquiry model (+ User, Post)
├── public/
│   ├── hps-logo.png               # Transparent company logo (nav + footer)
│   ├── hps-logo-full.png          # Full-size logo
│   ├── hps-favicon.png            # 32×32 favicon
│   ├── hps-favicon-64.png         # 64×64 favicon
│   ├── hps-framework-5d.webp      # 5D Business Growth Framework diagram
│   ├── logo.svg                   # shadcn default (unused, can delete)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/route.ts   # POST contact form → SQLite (Prisma)
│   │   │   ├── chat/route.ts      # POST → AI HPS Assistant (LLM)
│   │   │   └── route.ts           # Health-check root
│   │   ├── globals.css            # HPS theme: white + Royal Blue + Gold
│   │   ├── layout.tsx             # Fonts (Archivo/Public Sans/IBM Plex Mono) + metadata
│   │   └── page.tsx               # Single-page composition (all sections)
│   ├── components/
│   │   ├── hps/                   # HPS section components (16 files)
│   │   │   ├── nav.tsx
│   │   │   ├── hero.tsx           # Animated 3-line bubble tagline
│   │   │   ├── trustbar.tsx
│   │   │   ├── purpose.tsx
│   │   │   ├── solutions.tsx
│   │   │   ├── framework-3d.tsx   # 5D revolving diagram + clickable nodes
│   │   │   ├── industries.tsx
│   │   │   ├── why-hps.tsx
│   │   │   ├── stories.tsx
│   │   │   ├── school-marketplace.tsx
│   │   │   ├── cac-section.tsx    # CAC packages + steps + FAQ
│   │   │   ├── services.tsx
│   │   │   ├── about.tsx
│   │   │   ├── contact-section.tsx # Functional form → /api/contact
│   │   │   ├── cta.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── chat-widget.tsx    # Floating AI assistant
│   │   │   └── reveal.tsx         # Scroll-in animation helper
│   │   └── ui/                    # shadcn/ui components (used: button, toast, etc.)
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── db.ts                  # Prisma client singleton
│       ├── hps-data.ts            # Single source of truth for all content
│       └── utils.ts               # cn() helper
├── .env.example                   # Copy to .env
├── .gitignore
├── components.json                # shadcn config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md                      # This file
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Quick Start (Local Development)

### Prerequisites
- **Node.js 18+** or **Bun** (recommended)
- Git

### Steps

```bash
# 1. Unzip the package
unzip hps-website-package.zip
cd hps-website

# 2. Install dependencies (use any one)
bun install          # recommended — fastest
# or: npm install
# or: pnpm install
# or: yarn install

# 3. Set up environment
cp .env.example .env
# (DATABASE_URL is already correct for local SQLite — no changes needed)

# 4. Create the database (pushes the Prisma schema)
bun run db:push
# or: npx prisma db push

# 5. Start the dev server
bun run dev
# or: npm run dev

# 6. Open http://localhost:3000
```

---

## 4. Production Deployment

This Next.js app works on **any Node.js host**: Vercel, Netlify, Render,
Railway, a VPS, or cPanel. The recommended target is **Vercel** (the makers of
Next.js).

### Option A — Vercel (recommended, free tier)

1. Push the project to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects Next.js. Set these:
   - **Build Command:** `bun run build` (or `npm run build`)
   - **Output:** Vercel handles standalone automatically.
   - **Environment Variables:** add `DATABASE_URL`.
     - For a persistent DB, use a hosted SQLite (e.g. Turso) or switch the
       Prisma datasource to PostgreSQL/MySQL and update `DATABASE_URL`.
     - For Vercel's ephemeral filesystem, SQLite works for the contact form
       but data won't persist across cold starts — use Turso or Postgres for
       production contact submissions.
4. Click **Deploy**. Your site is live in ~2 minutes.

### Option B — Self-hosted (VPS / Docker / cPanel)

```bash
# 1. On the server:
git clone <your-repo> hps-website && cd hps-website
bun install
cp .env.example .env
bun run db:push

# 2. Build the production standalone bundle
bun run build
# This creates .next/standalone/ (a self-contained server)

# 3. Start the production server
bun run start
# → listens on port 3000 by default
```

Then put a reverse proxy (Nginx / Caddy) in front to terminate TLS and route
port 80/443 → localhost:3000.

### Database note for production

The included Prisma schema uses **SQLite** (`file:./db/custom.db`) for zero-config
local development. For production with persistent data:

- **Turso** (hosted SQLite, free tier) — change `DATABASE_URL` to a `libsql:` URL
  and add the `@prisma/adapter-libsql` adapter. See
  https://pris.ly/d/sqlite-alternatives
- **PostgreSQL** — change the datasource provider to `"postgresql"` in
  `prisma/schema.prisma` and set `DATABASE_URL` to your Postgres connection
  string, then `bun run db:push` again.

---

## 5. Features

### Pages (single-page anchor navigation)
The entire site lives at `/` with smooth-scroll anchor sections:
- **Hero** — animated 3-line bubble tagline, gold accent orb, dual CTAs
- **Trust bar** — professional credentials strip
- **Purpose** — why HPS exists, with 12 / 3 / 1 stat panel
- **Solutions** — 6 integrated solution cards with hover gold accent
- **5D Business Growth Framework** — revolving diagram with a static central
  "D" hub and 5 clickable principle nodes (Discover, Design, Deploy, Develop,
  Dominate). Click any node to see how it works.
- **Industries** — marquee of sectors served
- **Why HPS** — 6 differentiators
- **Success Stories** — Challenge / Solution / Result cards
- **Business School + Marketplace** — dual strip
- **CAC Registration** — 3 packages, 6-step process, document checklists, FAQ
- **Services** — 8 service groups, 12 service lines
- **About** — story, vision, mission, 8 guiding principles, ideal clients
- **CTA** — Royal Blue gradient call-to-action
- **Contact** — functional intake form + WhatsApp / phone / email
- **Footer** — deep navy with all links + BN:3301544

### Backend functionality
- **`POST /api/contact`** — validates and stores contact form submissions in
  SQLite via Prisma. Includes zod validation, IP rate limiting (5/min), and a
  `GET` count endpoint for health checks.
- **`POST /api/chat`** — powers the floating "HPS Assistant" chat widget using
  the `z-ai-web-dev-sdk` LLM. The assistant is grounded in HPS's real services,
  CAC packages, and process; it steers visitors toward booking a consultation or
  WhatsApp. Includes conversation history, rate limiting (20/min), and graceful
  error fallback.

### Brand & design
- **Colors:** White background, **Royal Blue** `#0057B8` (primary),
  **Metallic Gold** `#D4AF37` (secondary accents), deep navy `#0A2540` footer.
- **Fonts:** Archivo (headings), Public Sans (body), IBM Plex Mono (labels).
- **Logo:** the HPS company logo (transparent) in nav, footer, and favicon.
- **Responsive:** mobile-first, works from 375px to desktop.
- **Accessible:** semantic HTML, ARIA labels, keyboard navigation, focus rings,
  and `prefers-reduced-motion` respected on all animations.

### Google Forms integration
The CAC "Start My Registration" buttons link directly to the client's Google
Forms (opening in a new tab):
- Hero + bottom CTA + LTD + NGO packages → `https://forms.gle/LinpnZVRbeSxGFuP6`
- Business Name package → `https://forms.gle/Enxqq43wjRYiDx4PA`

---

## 6. npm Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start the dev server on port 3000 (Turbopack) |
| `build` | Create a production standalone build |
| `start` | Run the production server (after build) |
| `lint` | Run ESLint |
| `db:push` | Push the Prisma schema to the database |
| `db:generate` | Regenerate the Prisma Client |
| `db:migrate` | Create and apply a migration |
| `db:reset` | Reset the database (dev only) |

---

## 7. Environment Variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | Yes | `file:./db/custom.db` | SQLite path. Use `libsql:` or `postgresql://` for production. |

The AI chatbot (`/api/chat`) uses `z-ai-web-dev-sdk` which reads its
credentials from the environment automatically — no extra env vars needed in
this sandbox. For a self-hosted deploy, you'll need to provide the SDK's
auth credentials per the `z-ai-web-dev-sdk` docs.

---

## 8. Customising Content

All site content lives in **`src/lib/hps-data.ts`** — a single source of truth:
- Contact details (address, phones, email, WhatsApp, hours)
- Nav links
- Solutions, framework steps, industries, why-cards, stories
- CAC packages (with Google Form URLs), steps, checklists, FAQs
- Service groups, values, service options

Edit that one file to update text across the entire site. Brand colors and
fonts are defined in `src/app/globals.css` and `src/app/layout.tsx`.

---

## 9. Troubleshooting

**`prisma: command not found`** — run `bunx prisma db push` or
`npx prisma db push` to use the local binary.

**Contact form returns 500** — ensure `DATABASE_URL` points to a writable
directory and `bun run db:push` has been run.

**Chat widget shows an error** — the AI SDK needs valid credentials. In this
sandbox they're auto-provided; on self-hosting, configure per the SDK docs. The
widget gracefully falls back to a WhatsApp CTA on failure.

**Fonts not loading** — the site uses `next/font/google` (Archivo, Public Sans,
IBM Plex Mono). The build downloads and self-hosts them at build time, so no
runtime Google Fonts requests are made in production.

---

## 10. License & Ownership

© 2026 Hi'ported Professional Services · BN:3301544.
All rights reserved. This website and its source code are the property of
Hi'ported Professional Services.

---

**Support:** hiported@gmail.com · +234 811 611 2447 · +234 703 768 2721
**Office:** Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balanga Street,
Area 11 Garki Abuja-Nigeria
