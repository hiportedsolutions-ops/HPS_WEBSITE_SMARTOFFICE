# CLAUDE.md — HPS Website Project Instructions

This file gives Claude (or any developer/AI assistant) the full context needed to
maintain and extend the Hi'ported Professional Services website. Read this before
making any change.

---

## 1. Project Overview

**Client:** Hi'ported Professional Services (HPS) — BN:3301544
**What it is:** A business growth and enterprise solutions company in Garki, Abuja, Nigeria.
**Tagline (never alter):** Building Businesses. Creating Opportunities. Sustaining Success.
**Site type:** Static multi-page HTML/CSS/JS site (Path A). No build step, no framework.
**Deployment:** Netlify drag-and-drop (or cPanel upload). Redeploy = re-upload the whole folder.
**Future:** Phase 2 migration to WordPress (Kadence Pro theme + Kadence Blocks Pro)
when the Business School (Tutor LMS) and Marketplace (WooCommerce) launch.
This site is the design specification for that build.

## 2. Brand Identity (do not deviate)

Derived from the official gold-on-slate logo/flyer assets.

| Token        | Value      | Use                                   |
|--------------|------------|---------------------------------------|
| --ink        | #0F151C    | Page background (dark)                |
| --slate      | #18212B    | Cards, panels                         |
| --slate-2    | #202C38    | Card hover                            |
| --gold       | #C9A13B    | Primary accent, icons, rules          |
| --gold-bright| #E6BE55    | Hover/emphasis gold                   |
| --steel      | #93A1B0    | Muted body text on dark               |
| --paper      | #F5F3EE    | Light section background              |

- Gold gradient text uses the `.gold-text` class — apply to key phrases only.
- Fonts (Google Fonts): **Archivo** (headings, 700–800), **Public Sans** (body),
  **IBM Plex Mono** (labels/eyebrows/small print).
- Tone: confident, professional, practical. No hype words. Nigerian + international audience.
- The registration number **BN:3301544** must stay visible in hero/footer areas.

## 3. File Structure

```
hps-site/
├── index.html              Homepage (hero, solutions, 5D framework, stories, CTA)
├── cac-registration.html   Flagship conversion page (packages, steps, docs, FAQ)
├── services.html           All 12 service lines in 8 groups (anchor ids: #registration,
│                           #accounting, #tax, #audit, #advisory, #tech, #research, #school)
├── about.html              Story, vision, mission, 8 guiding principles
├── contact.html            Intake form + WhatsApp/call/email
├── css/style.css           ALL styles, shared across pages (design tokens in :root)
├── js/main.js              Mobile menu, scroll reveal, framework stepper (guarded)
├── robots.txt              Replace YOURDOMAIN.com after domain purchase
├── sitemap.xml             Replace YOURDOMAIN.com after domain purchase
└── DEPLOYMENT-GUIDE.md     30-minute go-live checklist
```

## 4. Editing Rules

1. **Shared elements must stay in sync across all 5 pages:** the `<nav>` block and
   the footer. If you edit one, edit all.
2. **Nav order (fixed):** Services · CAC Registrations · About HPS · Contact ·
   [Book a Consultation button → contact.html]
3. **New pages:** copy the head/nav/footer from about.html, link `css/style.css`
   and `js/main.js`, add the page to sitemap.xml, and add a nav link on all pages
   only if the client approves a nav change.
4. **New styles** go in css/style.css under a clearly commented section — never
   inline `<style>` blocks (small one-off inline style="" attributes are tolerated).
5. **Animations:** use the `.reveal` class for scroll-in effects; everything must
   respect `prefers-reduced-motion` (already handled globally).
6. **Signature element:** the 5D Business Growth Framework
   (Discover → Design → Deploy → Develop → Dominate) on index.html is core brand
   identity. Never remove it; extend carefully.
7. **Performance:** target audience includes Nigerian mobile users on slow
   connections. No heavy libraries, no large images (compress to WebP, <200KB),
   no external scripts beyond Google Fonts and (later) GA4/Formspree.
8. **Never use browser localStorage/sessionStorage.**

## 5. Key Integrations & Placeholders

- **Contact form:** contact.html posts to Formspree. Placeholder
  `YOUR_FORM_ID` must be replaced with the client's real Formspree ID.
- **Service pre-select:** contact.html reads `?service=` URL params
  (business-name | ltd | ngo) — CAC package buttons depend on this. Keep the map
  in the inline script at the bottom of contact.html in sync with the dropdown.
- **WhatsApp:** all wa.me links use +234 811 611 2447 with URL-encoded prefilled
  messages. Keep messages short and specific to the page.
- **Contact details (source of truth):**
  - Halima Plaza, Behind Old Sahad Store, Balanga Street, Area 11, Garki, Abuja
  - hiported@gmail.com · 0811 611 2447 · 0703 768 2721
- **Success stories on index.html are illustrative placeholders** — replace with
  real, client-approved case studies when available.
- **No pricing is published** — packages use "Request a Quote" by design. Do not
  invent prices.

## 6. Update Workflow (versioned)

1. Client requests change in plain language → Claude edits files in place.
2. Verify: all internal links resolve, nav/footer consistent, mobile layout OK.
3. Package as `hps-website-package.zip` (folder versioned hps-site-v1, v2, ...).
4. Client re-deploys: drag folder onto Netlify or re-upload changed files via cPanel.
5. Keep prior version zips for instant rollback.

## 7. Roadmap / Backlog

- [ ] Replace Formspree placeholder with live form ID
- [ ] Replace YOURDOMAIN.com in robots.txt + sitemap.xml
- [ ] Add GA4 snippet to all pages before </head>
- [ ] Paystack payment links on CAC packages
- [ ] Real success stories / testimonials
- [ ] Leadership team section on about.html
- [ ] Resources page (lead magnets: startup checklist, cash-flow template, tax calendar)
- [ ] SEO blog articles (target: "CAC registration Abuja", "register company Nigeria")
- [ ] Phase 2: WordPress build (Kadence Pro + Kadence Blocks Pro, WooCommerce,
      Tutor LMS Pro, FluentBooking, Fluent Forms Pro, Rank Math Pro, LiteSpeed,
      Wordfence, FluentCRM; payments: Paystack, Flutterwave, Stripe, PayPal)
