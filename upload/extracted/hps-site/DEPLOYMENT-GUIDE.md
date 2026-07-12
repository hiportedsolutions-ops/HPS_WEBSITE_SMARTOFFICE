# HPS Website — Deployment Guide (Path A: Static Site)

Total time to go live: ~30 minutes. Total cost: domain only (~N15,000/yr).

## Step 1 — Activate the contact form (5 min)
1. Go to https://formspree.io and create a free account with hiported@gmail.com
2. Click "New Form", name it "HPS Website Contact"
3. Copy your form endpoint (looks like: https://formspree.io/f/abcd1234)
4. Open contact.html and replace YOUR_FORM_ID in the form action with your ID
5. Free plan = 50 submissions/month. Upgrade later if needed.
(Until you do this, the WhatsApp button still works as your lead channel.)

## Step 2 — Deploy free on Netlify (10 min) — RECOMMENDED
1. Go to https://app.netlify.com and sign up (free)
2. Drag-and-drop this entire folder onto the Netlify dashboard ("Deploy manually")
3. Your site is live instantly on a temporary URL (e.g. hps-abc123.netlify.app)
4. Site settings -> Domain management -> Add custom domain -> enter your domain
5. At your domain registrar, point the domain to Netlify (they show you exactly
   which DNS records to add). HTTPS is automatic and free.

### Alternative: your own cPanel hosting
1. Log in to cPanel -> File Manager -> public_html
2. Upload all files/folders from this package (keep the css/ and js/ folders)
3. Done. Ensure SSL is enabled (most Nigerian hosts include free Let's Encrypt).

## Step 3 — Buy the domain (if not yet done)
Suggested: hiported.com / hiported.com.ng / hiportedservices.com
Registrars: Qservers, Whogohost, GO54 (Nigerian) or Namecheap (international).

## Step 4 — SEO setup (10 min)
1. Open robots.txt and sitemap.xml — replace YOURDOMAIN.com with your real domain
2. Go to https://search.google.com/search-console -> Add property -> your domain
3. Verify (Netlify/cPanel both support the DNS or HTML-file method)
4. Submit sitemap.xml under "Sitemaps"
5. Create a Google Business Profile (https://business.google.com) with the
   Garki, Abuja address — critical for "CAC registration Abuja" local searches.

## Step 5 — Analytics (optional, 5 min)
1. Create a GA4 property at https://analytics.google.com
2. Copy the gtag snippet and paste it before </head> in each HTML page.

## Updating content later
Edit the HTML files and re-upload (Netlify: drag the folder again — it replaces
the old deploy). Or ask Claude to make the edits and hand you a fresh package.

## Phase 2 (when ready): WordPress migration
When the Business School (Tutor LMS) and Marketplace (WooCommerce) launch,
this design becomes the spec for the WordPress build on Kadence Pro +
Kadence Blocks Pro. Keep the same domain; SEO carries over.
