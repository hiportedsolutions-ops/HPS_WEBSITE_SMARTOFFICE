"use client";

import { useEffect, useState, useCallback } from "react";
import "./smartoffice.css";

// Backend that stores early-access leads (Railway). Overridable via env so
// the endpoint can change without a code edit.
const API_URL =
  process.env.NEXT_PUBLIC_SMART_OFFICE_LEADS_API ??
  "https://smart-office-production.up.railway.app/api/leads";

// Launch date/time (local to the visitor's browser), matches the
// originally supplied countdown. Month is 0-based: 9 = October.
const LAUNCH_DATE = new Date(2026, 9, 1, 9, 0, 0);

const WORKFLOW_STAGES = [
  { num: 1, label: "Initiation", time: "09:02", stamp: "SUBMITTED" },
  { num: 2, label: "Departmental review", time: "09:47", stamp: "APPROVED" },
  { num: 3, label: "Internal audit review", time: "11:15", stamp: "CLEARED" },
  { num: 4, label: "Finance review", time: "12:30", stamp: "APPROVED" },
  { num: 5, label: "Executive approval", time: "14:05", stamp: "AUTHORIZED" },
  { num: 6, label: "Treasury processing", time: "15:40", stamp: "PAID" },
  { num: 7, label: "Archive & audit trail", time: "15:41", stamp: "ON RECORD" },
];

const FLOW_STEPS = [
  "Initiation",
  "Departmental review",
  "Internal audit review",
  "Finance review",
  "Executive approval",
  "Treasury processing",
  "Auto-archive",
];

const VALUE_CARDS: Array<{
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    title: "Approvals that move",
    desc: "A 7-stage payment memo workflow routes every request from initiation to treasury automatically — no more files waiting on someone's desk.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="5" cy="6" r="2.2" />
        <circle cx="5" cy="18" r="2.2" />
        <circle cx="19" cy="12" r="2.2" />
        <path d="M7.2 6.8 16.8 11.2" />
        <path d="M16.8 12.8 7.2 17.2" />
      </svg>
    ),
  },
  {
    title: "Audit built in, not bolted on",
    desc: "Internal audit reviews every financial memo before money moves, with compliance flags and risk scoring inside the workflow itself.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h9M4 8h9M4 12h5" />
        <circle cx="15" cy="15" r="4.3" />
        <path d="M18.2 18.2 21 21" />
      </svg>
    ),
  },
  {
    title: "Budget control at the gate",
    desc: "Requests are validated against budget codes before approval, so overruns and duplicate payments are stopped at the source.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z" />
        <path d="M9.5 15V9l5 6V9" />
        <path d="M8.3 11h7.4" />
      </svg>
    ),
  },
  {
    title: "Official memos, on record",
    desc: "Nine types of interdepartmental memos with attachments — every instruction documented, searchable and permanent.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h8l4 4v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v4h4" />
        <path d="M7.5 12h7M7.5 15.5h5" />
        <circle className="fill-accent" cx="16" cy="16.5" r="1.6" />
      </svg>
    ),
  },
  {
    title: "Role-based access",
    desc: "Staff, heads of department, auditors, finance, treasury and executives each see exactly what their role permits — nothing more.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="7" r="3" />
        <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2" />
        <circle cx="17" cy="14" r="2.4" />
        <path d="M17 16.4V21M15.4 19h3.2" />
      </svg>
    ),
  },
  {
    title: "Reports management can trust",
    desc: "Live dashboards and analytics show pending approvals, budget utilization and workflow bottlenecks in real time.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4v16h16" />
        <rect x="7" y="12" width="2.6" height="5" />
        <rect x="12" y="9" width="2.6" height="8" />
        <rect x="17" y="6" width="2.6" height="11" className="fill-accent" />
      </svg>
    ),
  },
];

const ROLE_OPTIONS = [
  "Registrar / Administration",
  "Bursar / Finance",
  "Internal Auditor",
  "Head of Department",
  "Executive Management",
  "IT / Systems",
  "Other",
];

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState<{
    days: string;
    hours: string;
    mins: string;
    secs: string;
    isLive: boolean;
  }>({ days: "--", hours: "--", mins: "--", secs: "--", isLive: false });

  useEffect(() => {
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: "0", hours: "0", mins: "0", secs: "0", isLive: true });
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining({
        days: String(days),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
        isLive: false,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
}

export function SmartOfficeLaunch() {
  const countdown = useCountdown(LAUNCH_DATE);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [joined, setJoined] = useState(false);

  const scrollToEarlyAccess = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function handleSubmit() {
    const name = fullName.trim();
    const mail = email.trim();

    if (!name) {
      setMessage({ text: "Please enter your full name.", ok: false });
      return;
    }
    if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setMessage({ text: "Please enter a valid email address.", ok: false });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email: mail, organization: organization.trim(), role }),
      });
      const data = await res.json().catch(() => ({}) as { error?: string });

      if (res.ok) {
        setMessage({ text: "You are on the list! Check your inbox for a confirmation email.", ok: true });
        setFullName("");
        setEmail("");
        setOrganization("");
        setRole("");
        setJoined(true);
      } else if (res.status === 409) {
        setMessage({ text: "This email is already on the list — you are covered!", ok: true });
        setSubmitting(false);
      } else {
        setMessage({ text: data.error || "Something went wrong. Please try again in a moment.", ok: false });
        setSubmitting(false);
      }
    } catch {
      setMessage({ text: "Could not reach the server. Please check your connection and try again.", ok: false });
      setSubmitting(false);
    }
  }

  const launchDateLine = countdown.isLive
    ? "Smart Office is live!"
    : `Launching ${LAUNCH_DATE.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;

  return (
    <div className="smartoffice-page">
      <header className="so-header">
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Smart Office home">
            <img src="/smart-office-logo.png" alt="Smart Office" className="logo-img" />
          </a>
          <a className="cta-small" href="#early-access" onClick={scrollToEarlyAccess}>
            Get early access
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Launching soon · Built for Nigerian institutions</span>
            <h1>
              Run your institution like the audit is <em>tomorrow.</em>
            </h1>
            <p className="lead">
              Smart Office moves payment memos, approvals and internal audit review out of
              paper files and WhatsApp threads into one accountable system — with a complete
              audit trail behind every decision.
            </p>
            <a className="btn-gold" href="#early-access" onClick={scrollToEarlyAccess}>
              Join the early access list
            </a>
            <p className="hero-note">Free for early subscribers during the pilot period.</p>
          </div>

          {/* Signature element: a payment memo clearing the 7-stage workflow */}
          <div
            className="trail-card"
            aria-label="Example of a payment memo moving through the Smart Office approval workflow"
          >
            <div className="trail-head">
              <span className="memo-title">Payment Memo</span>
              <span className="memo-id mono">MEMO-2026-0114</span>
            </div>
            {WORKFLOW_STAGES.map((s) => (
              <div className="stage" key={s.num}>
                <span className="num">{s.num}</span>
                <span className="label">{s.label}</span>
                <span className="time mono">{s.time}</span>
                <span className="stamp">{s.stamp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUE ================= */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Smart Office</span>
            <h2>Built where accountability is non-negotiable</h2>
            <p>
              Universities, agencies and growing organizations lose time and money to slow
              approvals, missing files and weak controls. Smart Office was designed by
              accounting and internal audit professionals to close those gaps.
            </p>
          </div>
          <div className="cards">
            {VALUE_CARDS.map((c) => (
              <div className="card" key={c.title}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section className="workflow">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The core workflow</span>
            <h2>Seven stages. One unbroken trail.</h2>
            <p>
              Every payment memo passes through the same disciplined sequence — and the
              system records who acted, when, and why at every step.
            </p>
          </div>
          <div className="flow">
            {FLOW_STEPS.map((step, i) => (
              <div className="step" key={step}>
                <div className="s-num">STAGE {i + 1}</div>
                <div className="s-name">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COUNTDOWN + FORM ================= */}
      <section className="launch" id="early-access">
        <div className="wrap launch-grid">
          <div>
            <span className="eyebrow">Launch countdown</span>
            <h2 style={{ fontSize: "clamp(28px,3.4vw,38px)", margin: "14px 0" }}>
              Smart Office goes live in
            </h2>
            <div className="countdown" role="timer" aria-live="polite">
              <div className="cd-box">
                <div className="cd-val">{countdown.days}</div>
                <div className="cd-lab">Days</div>
              </div>
              <div className="cd-box">
                <div className="cd-val">{countdown.hours}</div>
                <div className="cd-lab">Hours</div>
              </div>
              <div className="cd-box">
                <div className="cd-val">{countdown.mins}</div>
                <div className="cd-lab">Minutes</div>
              </div>
              <div className="cd-box">
                <div className="cd-val">{countdown.secs}</div>
                <div className="cd-lab">Seconds</div>
              </div>
            </div>
            <p className="launch-date-line">{launchDateLine}</p>
            <p style={{ marginTop: 22, color: "var(--so-muted)", fontSize: 15, maxWidth: "46ch" }}>
              Early subscribers get first access to the pilot, launch pricing, and onboarding
              support from the Hi&apos;ported Solutions team.
            </p>
          </div>

          <div className="form-card">
            <h3>Reserve your early access</h3>
            <p>Tell us where to reach you. We&apos;ll send launch updates and your invitation — no spam.</p>
            <div>
              <div className="field">
                <label htmlFor="f-name">Full name</label>
                <input
                  id="f-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Adaeze Okonkwo"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="field">
                <label htmlFor="f-email">Work email</label>
                <input
                  id="f-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@institution.edu.ng"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="field">
                <label htmlFor="f-org">
                  Organization <span style={{ fontWeight: 400, color: "var(--so-muted)" }}>(optional)</span>
                </label>
                <input
                  id="f-org"
                  type="text"
                  autoComplete="organization"
                  placeholder="e.g. Glorious Vision University"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="field">
                <label htmlFor="f-role">Your role</label>
                <select
                  id="f-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={submitting}
                >
                  <option value="">Select a role…</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button className="btn-submit" type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Joining…" : joined ? "Joined ✓" : "Join the list"}
              </button>
              {message && (
                <div className={`form-msg ${message.ok ? "ok" : "err"}`} role="status">
                  {message.text}
                </div>
              )}
              <p className="privacy-note">
                We only use your email for Smart Office launch updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="so-footer">
        <div className="wrap foot">
          <div>
            <span className="foot-logo">
              <img src="/smart-office-logo.png" alt="Smart Office" />
            </span>
            <p className="small" style={{ marginTop: 12 }}>
              A product of Hi&apos;ported Solutions.
            </p>
          </div>
          <p className="small">© 2026 Hi&apos;ported Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
