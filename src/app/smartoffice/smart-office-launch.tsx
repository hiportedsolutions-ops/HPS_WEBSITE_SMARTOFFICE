"use client";

import { useState, useCallback } from "react";
import "./smartoffice.css";

// Backend that stores Get started requests (Turso) and emails them to the
// Smart Office team. Overridable via env so the endpoint can change without
// a code edit.
const API_URL =
  process.env.NEXT_PUBLIC_SMART_OFFICE_LEADS_API ?? "/api/smartoffice-leads";
// The Smart Office app itself, for existing users.
const APP_URL = "https://smartoffice.hiported.com";
const CONTACT_EMAIL = "smartoffice@hiported.com";

// The stages in the order the app runs them.
const WORKFLOW_STAGES = [
  { num: 1, label: "Initiation", time: "09:02", stamp: "SUBMITTED" },
  { num: 2, label: "Departmental review", time: "09:47", stamp: "APPROVED" },
  { num: 3, label: "Finance review", time: "11:15", stamp: "VERIFIED" },
  { num: 4, label: "Internal audit review", time: "12:30", stamp: "CLEARED" },
  { num: 5, label: "Executive approval", time: "14:05", stamp: "AUTHORIZED" },
  { num: 6, label: "Treasury processing", time: "15:40", stamp: "PAID" },
  { num: 7, label: "Archive & audit trail", time: "15:41", stamp: "ON RECORD" },
];

const FLOW_STEPS = [
  "Initiation",
  "Departmental review",
  "Finance review",
  "Internal audit review",
  "Executive approval",
  "Treasury processing",
  "Auto-archive",
];

const PRODUCTS = [
  {
    eyebrow: "Payment memos",
    title: "Every payment request, through every reviewer",
    desc: "A clear seven-stage workflow from the department head to finance, internal audit, executive approval, treasury and archive. Each reviewer sees only what needs their attention, and nothing skips a step.",
    points: [
      "Approve, return, reject or keep in view (KIV), always with a reason",
      "Invoices, quotes and receipts attached to the memo they support",
      "One person can never act twice on the same memo",
    ],
  },
  {
    eyebrow: "Office memos & notices",
    title: "Official correspondence, on record",
    desc: "Nine types of non-financial memos, including circulars, policy notices and queries, each with its own approval trail. Publish notices to the whole organisation or a single department.",
    points: [
      "Organisation-wide and departmental notices",
      "Email alerts when a memo reaches you",
      "Searchable and permanent",
    ],
  },
  {
    eyebrow: "Audit & risk",
    title: "Internal audit inside the workflow",
    desc: "Audit is part of the approval chain, not something added at the end. Smart Office records who did what and when on every memo, scores each request for risk, and gives auditors a live register instead of a stack of files.",
    points: [
      "Full action history on every memo",
      "Risk scoring by amount and category",
      "Risk register and compliance summary for auditors",
    ],
  },
  {
    eyebrow: "Records & reporting",
    title: "Answers for management, auditors and regulators",
    desc: "Every completed memo goes into a searchable records register with its full approval history. See spending by department and category, and export records whenever you are asked.",
    points: [
      "Records register with the approval trail",
      "Department and category spending reports",
      "One-click data export",
    ],
  },
];

const VALUE_CARDS: Array<{
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    title: "Approvals that move",
    desc: "Memos move to the next reviewer the moment they are ready. No more files waiting on someone's desk or a messenger between offices.",
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
    desc: "Each memo is tied to a budget line. Finance sees the remaining balance before approving, overspends are flagged, and utilisation updates when payment is made.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z" />
        <path d="M9.5 15V9l5 6V9" />
        <path d="M8.3 11h7.4" />
      </svg>
    ),
  },
  {
    title: "Role-based access",
    desc: "Staff, heads of department, auditors, finance, treasury and executives each see and do exactly what their role permits, and nothing more.",
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
    title: "Secure by default",
    desc: "Each organisation's data is kept separate, passwords are never emailed or seen by administrators, and every sign-in and change is logged.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="10.5" width="14" height="10" rx="2" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        <circle className="fill-accent" cx="12" cy="15.5" r="1.6" />
      </svg>
    ),
  },
  {
    title: "Reports management can trust",
    desc: "Live dashboards show pending approvals, budget utilisation and where memos are waiting, in real time.",
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

const AUDIENCES = [
  { title: "Universities & polytechnics", desc: "Bursary, registry and faculty approvals in one place." },
  { title: "Government agencies", desc: "Due process and accountability on every naira." },
  { title: "SMEs & NGOs", desc: "Donor-ready records without extra admin." },
  { title: "Audit & accounting firms", desc: "Live access to the evidence, instead of photocopies." },
];

const FAQS = [
  {
    q: "What is Smart Office?",
    a: "A digital workflow and approval platform. It replaces paper payment memos, internal correspondence and approval files with a secure system where every action is logged.",
  },
  {
    q: "Can we change the approval stages?",
    a: "The default flow is Initiation, Departmental Review, Finance Review, Internal Audit Review, Executive Approval, Treasury and Archive. During onboarding we set up the departments, roles and budget lines to match how your organisation approves things.",
  },
  {
    q: "Who can see a memo?",
    a: "Access is role- and department-based. Staff see their own memos, reviewers see what is at their stage, and auditors and executives see across the organisation.",
  },
  {
    q: "Do we need to install anything?",
    a: "No. Smart Office runs in the browser on desktop and mobile. We handle hosting and updates.",
  },
  {
    q: "How do we bring our staff on board?",
    a: "Your administrator can add staff one at a time or upload them all from an Excel template. Each person receives their own secure link to set a password.",
  },
  {
    q: "How is pricing structured?",
    a: "Smart Office is licensed per organisation on an annual basis. Tell us about your institution and we will send a quote based on your size and needs.",
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

export function SmartOfficeLaunch() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [sent, setSent] = useState(false);

  const scrollToGetStarted = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
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
    if (!organization.trim()) {
      setMessage({ text: "Please enter your institution or organisation.", ok: false });
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
      if (res.ok || res.status === 409) {
        setMessage({
          text: res.ok
            ? "Thank you. Your request has reached the Smart Office team, and we will contact you shortly to arrange a walkthrough."
            : "We already have a request from this email, and we have let the team know you asked again. We will be in touch shortly.",
          ok: true,
        });
        setFullName("");
        setEmail("");
        setOrganization("");
        setRole("");
        setSent(true);
      } else {
        setMessage({ text: data.error || "Something went wrong. Please try again in a moment.", ok: false });
      }
    } catch {
      setMessage({ text: "Could not reach the server. Please check your connection and try again.", ok: false });
    }
    setSubmitting(false);
  }

  return (
    <div className="smartoffice-page">
      <header className="so-header">
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="Smart Office home">
            <img src="/smart-office-logo.png" alt="Smart Office" className="logo-img" />
          </a>
          <nav className="so-links" aria-label="Smart Office">
            <a href="#products">Products</a>
            <a href="#workflow">How it works</a>
            <a href="#who">Who it&apos;s for</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a className="cta-ghost" href={APP_URL}>
              Sign in
            </a>
            <a className="cta-small" href="#get-started" onClick={scrollToGetStarted}>
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Now live · Built for Nigerian institutions</span>
            <h1>
              Run your institution like the audit is <em>tomorrow.</em>
            </h1>
            <p className="lead">
              Smart Office moves payment memos, approvals and internal audit review out of
              paper files and WhatsApp threads into one accountable system, with a complete
              audit trail behind every decision.
            </p>
            <div className="hero-actions">
              <a className="btn-gold" href="#get-started" onClick={scrollToGetStarted}>
                Get started
              </a>
              <a className="btn-outline" href={APP_URL}>
                Sign in to Smart Office
              </a>
            </div>
            <p className="hero-note">
              New institution? Get started and we&apos;ll arrange a walkthrough. Already a
              customer? Sign in with your work email.
            </p>
          </div>

          {/* Signature element: a payment memo clearing the 7-stage workflow */}
          <div
            className="trail-card"
            aria-label="Example of a payment memo moving through the Smart Office approval workflow"
          >
            <div className="trail-head">
              <span className="memo-title">Payment Memo</span>
              <span className="memo-id mono">MEM-2026-0114</span>
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

      {/* ================= PRODUCTS ================= */}
      <section id="products">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">One platform</span>
            <h2>Every memo, approval and record in one place</h2>
            <p>
              Payment memos, internal correspondence, audit review and records management in
              one connected system. Every department works from the same source of truth.
            </p>
          </div>
          <div className="products">
            {PRODUCTS.map((p) => (
              <div className="product" key={p.eyebrow}>
                <span className="eyebrow">{p.eyebrow}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}
      <section className="workflow" id="workflow">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The core workflow</span>
            <h2>Seven stages. One unbroken trail.</h2>
            <p>
              Every payment memo passes through the same disciplined sequence, and the
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

      {/* ================= VALUE ================= */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Smart Office</span>
            <h2>Built where accountability is non-negotiable</h2>
            <p>
              Universities, agencies and growing organisations lose time and money to slow
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

      {/* ================= WHO ================= */}
      <section className="who" id="who">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Who it&apos;s for</span>
            <h2>For institutions that answer to auditors</h2>
          </div>
          <div className="who-grid">
            {AUDIENCES.map((a) => (
              <div className="who-item" key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Questions institutions ask us</h2>
          </div>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GET STARTED ================= */}
      <section className="launch" id="get-started">
        <div className="wrap launch-grid">
          <div>
            <span className="eyebrow">Get started</span>
            <h2 style={{ fontSize: "clamp(28px,3.4vw,38px)", margin: "14px 0" }}>
              Ready to take your office paperless?
            </h2>
            <p style={{ color: "var(--so-muted)", fontSize: 16, maxWidth: "46ch" }}>
              Tell us about your institution. We&apos;ll walk you through Smart Office using
              your own approval process and show you how quickly your team can go live.
            </p>
            <ul className="promise">
              <li>A walkthrough tailored to your organisation</li>
              <li>Guided onboarding: departments, budget lines and staff set up with you</li>
              <li>Training and support from a team that knows institutional finance</li>
            </ul>
            <div className="contact">
              <p>
                <strong>Email</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
              <p>
                <strong>Phone</strong> <a href="tel:+2348116112447">+234 811 611 2447</a> ·{" "}
                <a href="tel:+2347083249625">+234 708 324 9625</a>
              </p>
              <p>
                <strong>Office</strong> Suite B2, Halima Plaza, Balanga Street, Area 11, Garki, Abuja
              </p>
            </div>
            <div className="existing">
              Already using Smart Office?{" "}
              <a href={APP_URL}>Sign in at smartoffice.hiported.com →</a>
            </div>
          </div>

          <div className="form-card">
            <h3>Tell us about your institution</h3>
            <p>We&apos;ll reply to your work email to arrange a walkthrough. No spam.</p>
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
                <label htmlFor="f-org">Institution / organisation</label>
                <input
                  id="f-org"
                  type="text"
                  autoComplete="organization"
                  placeholder="e.g. Glorious Vision University"
                  required
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
                {submitting ? "Sending…" : sent ? "Request sent ✓" : "Request a walkthrough"}
              </button>
              {message && (
                <div className={`form-msg ${message.ok ? "ok" : "err"}`} role="status">
                  {message.text}
                </div>
              )}
              <p className="privacy-note">We only use your details to respond to this request.</p>
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
              A product of <a href="/">Hi&apos;ported Professional Service</a>.
            </p>
          </div>
          <div className="foot-links small">
            <a href={APP_URL}>Sign in</a>
            <a href="#get-started" onClick={scrollToGetStarted}>
              Get started
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <p className="small">© 2026 Hi&apos;ported Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
