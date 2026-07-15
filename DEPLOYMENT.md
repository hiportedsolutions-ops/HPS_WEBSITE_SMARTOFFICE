# HPS Website — Production Deployment Guide

This guide covers two production deployment paths for the Hi'ported
Professional Services (HPS) website:

1. **Vercel** — the easiest path. Free tier, zero-config, auto-deploys from Git.
2. **Windows VPS with IIS** — for self-hosting on a Windows server using IIS
   as a reverse proxy.

Pick the one that fits your infrastructure.

---

## Before You Begin

Regardless of platform, you need:

- The project files (from `hps-website-package.zip`).
- A **database decision**:
  - **SQLite** (default, `file:./db/custom.db`) — works locally and on a
    single VPS, but **data does not persist** on Vercel/serverless (the
    filesystem is ephemeral).
  - **Turso** (hosted SQLite, free tier) — recommended for Vercel.
    https://turso.tech
  - **PostgreSQL** (any hosted provider: Neon, Supabase, Railway, RDS) —
    recommended for production scale.

> For the contact form to actually save submissions in production, use Turso
> or PostgreSQL. SQLite on Vercel will lose data on cold starts.

---

# Path A — Deploy to Vercel (Recommended)

Vercel is the company behind Next.js, so deployment is essentially
one-click. Two methods: Git-based (auto-deploy) or Vercel CLI (manual).

## A.1 — Set up a production database (Turso, free)

```bash
# Install the Turso CLI (macOS/Linux/WSL)
curl -sSfL https://get.tur.so/install.sh | bash

# Or on Windows PowerShell:
irm https://get.tur.so/install.ps1 | iex

# Log in and create a database
turso auth login
turso db create hps-db

# Get your connection URL and auth token
turso db show hps-db --url
turso db tokens create hps-db
```

Your `DATABASE_URL` will look like:
```
libsql://hps-db-<your-org>.turso.io?authToken=<long-token>
```

> **Note:** To use Turso with Prisma, you also need to add the LibSQL adapter.
> See https://pris.ly/d/sqlite-alternatives — or just use PostgreSQL (A.2).

## A.2 — (Alternative) Set up PostgreSQL (Neon, free)

1. Go to https://neon.tech → sign up → create a project.
2. Copy the connection string, e.g.:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/hps?sslmode=require
   ```
3. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## A.3 — Push the code to GitHub

```bash
# In the project folder
git init
git add .
git commit -m "HPS website — initial production commit"
git branch -M main
git remote add origin https://github.com/<your-username>/hps-website.git
git push -u origin main
```

If you don't have a GitHub account, create one at https://github.com (free).

## A.4 — Deploy via Vercel dashboard

1. Go to https://vercel.com → **Log In** (with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** your `hps-website` repository.
4. Vercel auto-detects Next.js. Configure:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (or `bun run build`)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (or `bun install`)
5. Open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Turso `libsql://...` **or** Neon `postgresql://...` string |

6. Click **Deploy**. Vercel builds and deploys in ~2 minutes.
7. You'll get a URL like `https://hps-website.vercel.app`.

## A.5 — Run the database migration on Vercel

After the first deploy, push the Prisma schema to your production database:

```bash
# Locally, with DATABASE_URL set to your production DB in .env
npx prisma db push
```

Or add a `postbuild` script in `package.json`:
```json
"postbuild": "prisma generate && prisma db push"
```

## A.6 — Add a custom domain

1. In Vercel → your project → **Settings** → **Domains**.
2. Add `yourdomain.com` and `www.yourdomain.com`.
3. Follow Vercel's instructions to update your DNS (A record or CNAME) at
   your domain registrar.
4. Vercel auto-provisions **HTTPS** via Let's Encrypt.

## A.7 — (Alternative) Deploy via Vercel CLI

If you prefer the terminal over the dashboard:

```bash
# Install Vercel CLI
npm i -g vercel

# In the project folder
cd hps-website
vercel login

# Deploy a preview
vercel

# Deploy to production
vercel --prod

# Add env vars
vercel env add DATABASE_URL
# (paste the value when prompted, then redeploy)
vercel --prod
```

---

# Path B — Deploy to a Windows VPS with IIS

This path runs the Next.js app as a **Node.js process** (managed as a Windows
service), with **IIS acting as a reverse proxy** in front for HTTPS and
port 80/443 routing.

## B.1 — Prerequisites on the Windows Server

Log into your Windows VPS (Server 2019/2022 or Windows 10/11 Pro) and
install:

1. **Node.js 20 LTS** — https://nodejs.org (use the Windows Installer).
   Verify in PowerShell:
   ```powershell
   node --version   # v20.x.x
   npm --version
   ```

2. **IIS** — Server Manager → Add Roles and Features →
   **Web Server (IIS)** role. Include:
   - *Web Server → Application Development → WebSocket Protocol*
     (needed for hot reload in dev; optional in production)

3. **URL Rewrite module** — download from
   https://www.iis.net/downloads/microsoft/url-rewrite (required for proxying).

4. **Application Request Routing (ARR)** — download from
   https://www.iis.net/downloads/microsoft/application-request-routing
   (required for reverse proxy).

5. **NSSM** (Non-Sucking Service Manager) — to run Node as a Windows service.
   Download from https://nssm.cc/download and put `nssm.exe` in
   `C:\Tools\nssm\` (or anywhere on PATH).

6. **Git** (optional, to clone the repo) — https://git-scm.com

## B.2 — Copy the project to the server

**Option 1 — via Git (recommended):**
```powershell
cd C:\inetpub
git clone https://github.com/<your-username>/hps-website.git hps
cd hps
```

**Option 2 — upload the zip:**
```powershell
# Copy hps-website-package.zip to the server (via RDP copy, SCP, etc.)
cd C:\inetpub
Expand-Archive -Path C:\Users\Administrator\Downloads\hps-website-package.zip -DestinationPath .\hps -Force
cd hps
```

The project will live at `C:\inetpub\hps`.

## B.3 — Set up the database

### SQLite (simplest, fine for a single VPS)
```powershell
# In C:\inetpub\hps
Copy-Item .env.example .env
New-Item -ItemType Directory -Force -Path .\db | Out-Null
# Edit .env to point to an absolute path if you prefer:
#   DATABASE_URL=file:C:/inetpub/hps/db/custom.db
notepad .env
```

### PostgreSQL (recommended for production)
1. Install PostgreSQL on the server (or use a hosted provider).
2. Create a database `hps` and a user.
3. Update `prisma/schema.prisma` datasource provider to `"postgresql"`.
4. Set `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://hps_user:strongpass@localhost:5432/hps?schema=public"
   ```

## B.4 — Install dependencies and build

```powershell
cd C:\inetpub\hps
npm install
npm run build
```

This creates `.next/` with the production build. Verify it works before
wiring up the service:

```powershell
# Temporarily start the app to test
npm run start
# → opens on http://localhost:3000
# Visit http://localhost in a browser on the server; you should see the site.
# Press Ctrl+C to stop.
```

Also push the database schema:
```powershell
npx prisma db push
```

## B.5 — Run Next.js as a Windows service (via NSSM)

This keeps the app running permanently and auto-starts it on server boot.

```powershell
# Create the service (runs next start on port 3000)
nssm install HPSWebsite "C:\Program Files\nodejs\node.exe" "C:\inetpub\hps\node_modules\next\dist\bin\next" "start" "-p" "3000"

# Set the working directory
nssm set HPSWebsite AppDirectory C:\inetpub\hps

# Set environment variables (so the app reads .env correctly)
nssm set HPSWebsite AppEnvironmentExtra NODE_ENV=production

# Auto-start on boot
nssm set HPSWebsite Start SERVICE_AUTO_START

# Log output to files (for debugging)
nssm set HPSWebsite AppStdout C:\inetpub\hps\logs\stdout.log
nssm set HPSWebsite AppStderr C:\inetpub\hps\logs\stderr.log
nssm set HPSWebsite AppStdoutCreationDisposition 4
nssm set HPSWebsite AppStderrCreationDisposition 4

# Create the logs folder
New-Item -ItemType Directory -Force -Path C:\inetpub\hps\logs | Out-Null

# Start the service
Start-Service HPSWebsite

# Check it's running
Get-Service HPSWebsite
# Status should be "Running"
```

Verify the app responds on localhost:
```powershell
Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Select-Object StatusCode
# Should print 200
```

### Service management commands

```powershell
Stop-Service HPSWebsite
Start-Service HPSWebsite
Restart-Service HPSWebsite
# To remove the service later:
nssm remove HPSWebsite confirm
```

## B.6 — Configure IIS as a reverse proxy

We'll create an IIS site that listens on port 80 (and later 443) and forwards
all requests to `http://localhost:3000`.

### Step 1 — Enable ARR proxy

1. Open **IIS Manager** (`inetmgr`).
2. Click the server name (root node) in the left tree.
3. Double-click **Application Request Routing Cache**.
4. In the right panel → **Server Proxy Settings…**.
5. Check **Enable proxy** → click **Apply**.

### Step 2 — Create the IIS site

```powershell
# Create a folder for IIS logs
New-Item -ItemType Directory -Force -Path C:\inetpub\logs\HPS | Out-Null

# Create the site bound to port 80, pointing at the project's public folder
Import-Module WebAdministration
New-Website -Name "HPS" `
  -PhysicalPath "C:\inetpub\hps\public" `
  -Port 80 `
  -HostHeader "" `
  -Force
```

Or via IIS Manager GUI:
1. Right-click **Sites** → **Add Website…**
2. **Site name:** `HPS`
3. **Physical path:** `C:\inetpub\hps\public`
4. **Binding:** Type `http`, IP `All Unassigned`, Port `80`, Host name:
   your domain (e.g. `www.yported.com`) or leave blank for IP-only access.
5. Click **OK**.

### Step 3 — Add URL Rewrite rules for reverse proxy

Create a file named `web.config` in `C:\inetpub\hps\public\web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Route all traffic to the Next.js app on port 3000 -->
        <rule name="ReverseProxy to Next.js" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Apply it:
```powershell
# Restart the IIS site to pick up web.config
Import-Module WebAdministration
Restart-WebItem -PSPath "IIS:\Sites\HPS"
```

### Step 7 — Open the firewall

```powershell
# Allow inbound HTTP (80) and HTTPS (443)
New-NetFirewallRule -DisplayName "HTTP-In"  -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow -Profile Any
New-NetFirewallRule -DisplayName "HTTPS-In" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -Profile Any
```

Also open port 80/443 in your VPS provider's cloud firewall (AWS Security
Group, Azure NSG, Hetzner firewall, etc.).

At this point, visiting `http://<your-server-ip>/` should show the HPS site.

## B.7 — Add HTTPS with a free Let's Encrypt certificate

### Option 1 — win-acme (recommended, easiest on Windows)

1. Download **win-acme** from https://www.win-acme.com → extract to
   `C:\Tools\win-acme\`.
2. Run `wacs.exe` in an admin PowerShell.
3. Choose **N: Create certificate (full options)**.
4. Pick the IIS site binding you created (`HPS`, port 80).
5. Enter your domain(s) — e.g. `hported.com`, `www.hported.com`.
6. Choose **IIS binding** for installation (win-acme auto-adds the 443
   binding).
7. win-acme installs the cert and sets up **auto-renewal** (a scheduled
   task runs every few days).

Verify: visit `https://hported.com` — you should see the lock icon.

### Option 2 — Manual via certbot
```powershell
# Install certbot
winget install Certbot.Certbot
# Get a cert (requires port 80 to be reachable)
certbot certonly --webroot -w C:\inetpub\hps\public -d hported.com -d www.hported.com
# Then bind the .pfx in IIS Manager → HPS site → Bindings → Add → HTTPS
```

## B.8 — Update DNS

At your domain registrar (Namecheap, GoDaddy, etc.), point your domain to
the VPS:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `<your-server-IP>` | Automatic |
| A | `www` | `<your-server-IP>` | Automatic |

Wait 5–30 minutes for DNS propagation, then visit your domain.

## B.9 — Production maintenance

### Updating the site after code changes

```powershell
cd C:\inetpub\hps

# Pull latest code (if using Git)
git pull origin main

# Or re-upload the updated files via SCP/RDP

# Install any new dependencies
npm install

# Rebuild
npm run build

# Push any schema changes
npx prisma db push

# Restart the Node service
Restart-Service HPSWebsite
```

### Viewing logs

```powershell
# Next.js app logs (from NSSM)
Get-Content C:\inetpub\hps\logs\stdout.log -Tail 50 -Wait
Get-Content C:\inetpub\hps\logs\stderr.log -Tail 50 -Wait

# IIS logs
Get-Content C:\inetpub\logs\LogFiles\W3SVC*\*.log -Tail 50
```

### Backing up the database

```powershell
# SQLite — just copy the file
Copy-Item C:\inetpub\hps\db\custom.db C:\Backups\hps-$(Get-Date -Format yyyyMMdd).db

# PostgreSQL
pg_dump -U hps_user -d hps > C:\Backups\hps-$(Get-Date -Format yyyyMMdd).sql
```

Set up a **scheduled task** to run the backup nightly:
```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" `
  -Argument "-File C:\Scripts\backup-hps.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "HPS Daily Backup" -Action $action -Trigger $trigger -RunLevel Highest
```

---

# Quick Comparison

| Aspect | Vercel | Windows VPS + IIS |
|--------|--------|-------------------|
| **Setup time** | ~10 min | ~1–2 hours |
| **Cost (entry)** | Free tier | VPS cost (~$5–20/mo) |
| **HTTPS** | Auto (Let's Encrypt) | win-acme (Let's Encrypt) |
| **Database** | Must use hosted (Turso/Neon) | SQLite OK, or local Postgres |
| **Scaling** | Automatic | Manual (vertical) |
| **Control** | Limited | Full |
| **Auto-deploy from Git** | Yes | Set up CI/CD yourself |
| **Custom domain** | Yes | Yes (via DNS) |
| **Best for** | Most users | Organizations with existing Windows infra |

**Recommendation:** Start with **Vercel** unless you have a specific reason
to self-host (data residency, existing Windows server, compliance). You can
always migrate to a VPS later — the codebase is identical.

---

# Troubleshooting

### Vercel
- **Build fails with Prisma error** — add `"postinstall": "prisma generate"`
  to `package.json` scripts.
- **`Environment variable not found: DATABASE_URL`** — add it in
  Vercel → Settings → Environment Variables, then redeploy.
- **Contact form returns 500** — the database isn't reachable. Verify
  `DATABASE_URL` is correct and `prisma db push` was run against the
  production DB.

### Windows VPS / IIS
- **502.5 / 500.19 errors in browser** — the Node service isn't running or
  crashed. Check `Get-Service HPSWebsite` and `stderr.log`.
- **Site shows IIS default page, not HPS** — the `web.config` rewrite rule
  isn't applied, or ARR proxy isn't enabled. Re-check B.6.
- **HTTP works but HTTPS doesn't** — port 443 not open in firewall, or the
  SSL binding isn't set in IIS.
- **`nssm install` fails** — run PowerShell **as Administrator**.
- **Can't reach the site externally** — check both the Windows firewall
  (B.7) and your cloud provider's security group.

---

# Need Help?

**Hi'ported Professional Services**
- Email: hiported@gmail.com
- Phone: +234 811 611 2447 · +234 703 768 2721
- Office: Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balanga Street,
  Area 11 Garki Abuja-Nigeria
- BN: 3301544
