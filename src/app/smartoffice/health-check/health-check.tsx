"use client";

import { useMemo, useState } from "react";
import "../smartoffice.css";
import "./health-check.css";
import {
  ANSWER_LABELS,
  AREAS,
  PAYMENT_BANDS,
  QUESTIONS,
  SECTORS,
  STAFF_BANDS,
  formatNaira,
  scoreAnswers,
  type Answer,
  type AreaId,
  type Result,
} from "@/lib/health-check";

const API_URL = "/api/smartoffice-health-check";
const APP_URL = "https://smartoffice.hiported.com";
const CONTACT_EMAIL = "smartoffice@hiported.com";
const PAGE_URL = "https://www.hiported.com/smartoffice/health-check";

const ROLE_OPTIONS = [
  "Managing Director / CEO",
  "Bursar / CFO / Finance",
  "Internal Auditor",
  "Registrar / Administration",
  "Accountant",
  "External auditor / consultant",
  "Other",
];

const AREA_ORDER = Object.keys(AREAS) as AreaId[];
const ANSWER_OPTIONS: Answer[] = [2, 1, 0];

// Steps: 0 intro · 1 profile · 2–6 one control area each · 7 score + gate · 8 report
const FIRST_AREA_STEP = 2;
const GATE_STEP = FIRST_AREA_STEP + AREA_ORDER.length;
const REPORT_STEP = GATE_STEP + 1;

const GRADE_NOTE: Record<Result["grade"], string> = {
  Strong: "Your payment controls are in good shape. The remaining gaps are worth closing before an auditor finds them.",
  Moderate: "Important controls are in place, but there are gaps that would let a wrong payment through.",
  Weak: "Several key controls are missing or inconsistent. Payments are exposed to error and fraud.",
  Critical: "Most payment controls are missing. Money can leave your organisation without independent checks.",
};

export function HealthCheck() {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState("");
  const [staffBand, setStaffBand] = useState("");
  const [paymentsBand, setPaymentsBand] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [wantsWalkthrough, setWantsWalkthrough] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Result | null>(null);

  const preview = useMemo(
    () => scoreAnswers(answers, paymentsBand ?? undefined),
    [answers, paymentsBand],
  );

  const totalSteps = AREA_ORDER.length + 1; // profile + areas
  const progress = step === 0 ? 0 : Math.min(step, totalSteps) / totalSteps;

  function go(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const profileDone = sector && staffBand && paymentsBand !== null;
  const area = step >= FIRST_AREA_STEP && step < GATE_STEP ? AREA_ORDER[step - FIRST_AREA_STEP] : null;
  const areaQuestions = area ? QUESTIONS.filter((q) => q.area === area) : [];
  const areaDone = areaQuestions.every((q) => q.id in answers);

  async function submit() {
    const name = fullName.trim();
    const mail = email.trim();
    if (name.length < 2) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return setError("Please enter a valid email address.");
    if (organization.trim().length < 2) return setError("Please enter your organisation.");
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email: mail,
          organization: organization.trim(),
          role,
          phone: phone.trim(),
          sector,
          staffBand,
          paymentsBand,
          wantsWalkthrough,
          answers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.result) {
        setReport(data.result as Result);
        go(REPORT_STEP);
      } else {
        setError(data.error || "Something went wrong. Please try again in a moment.");
      }
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    }
    setSubmitting(false);
  }

  const shareText = "How safe are your organisation's payments? Take the free 5-minute Payment Control Health Check:";

  return (
    <div className="smartoffice-page hc-page">
      <header className="so-header">
        <div className="wrap nav">
          <a className="brand" href="/smartoffice" aria-label="Smart Office home">
            <img src="/smart-office-logo.png" alt="Smart Office" className="logo-img" />
          </a>
          <div className="nav-actions">
            <a className="cta-ghost" href={APP_URL}>
              Sign in
            </a>
            <a className="cta-small" href="/smartoffice#get-started">
              Get started
            </a>
          </div>
        </div>
      </header>

      {step > 0 && step < GATE_STEP && (
        <div className="hc-progress" aria-hidden="true">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {/* ================= INTRO ================= */}
      {step === 0 && (
        <section className="hero hc-hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">Free · 5 minutes · 15 questions</span>
              <h1>
                How safe are your organisation&apos;s <em>payments?</em>
              </h1>
              <p className="lead">
                Take the Payment Control Health Check, built by practising internal auditors. Get a
                control score out of 100, an estimate of the payments at risk, and the gaps to close
                first.
              </p>
              <div className="hero-actions">
                <button className="btn-gold" type="button" onClick={() => go(1)}>
                  Start the Health Check
                </button>
              </div>
              <p className="hero-note">
                No sign-up needed to see your score. Your answers are confidential.
              </p>
            </div>
            <div className="trail-card hc-areas-card">
              <div className="trail-head">
                <span className="memo-title">What we check</span>
                <span className="memo-id mono">5 AREAS</span>
              </div>
              {AREA_ORDER.map((id, i) => (
                <div className="stage" key={id}>
                  <span className="num">{i + 1}</span>
                  <span className="label">{AREAS[id]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= PROFILE ================= */}
      {step === 1 && (
        <section className="hc-step">
          <div className="wrap hc-narrow">
            <span className="eyebrow">Step 1 of {totalSteps} · About your organisation</span>
            <h2>First, a little context</h2>
            <p className="hc-sub">This helps us size the estimate of payments at risk.</p>

            <fieldset className="hc-group">
              <legend>What kind of organisation is it?</legend>
              <div className="hc-chips">
                {SECTORS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`hc-chip${sector === s ? " on" : ""}`}
                    aria-pressed={sector === s}
                    onClick={() => setSector(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="hc-group">
              <legend>How many staff?</legend>
              <div className="hc-chips">
                {STAFF_BANDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`hc-chip${staffBand === s ? " on" : ""}`}
                    aria-pressed={staffBand === s}
                    onClick={() => setStaffBand(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="hc-group">
              <legend>Roughly how much does it pay out each year (suppliers, contractors, expenses)?</legend>
              <div className="hc-chips">
                {PAYMENT_BANDS.map((b, i) => (
                  <button
                    key={b.label}
                    type="button"
                    className={`hc-chip${paymentsBand === i ? " on" : ""}`}
                    aria-pressed={paymentsBand === i}
                    onClick={() => setPaymentsBand(i)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="hc-nav">
              <button type="button" className="hc-back" onClick={() => go(0)}>
                Back
              </button>
              <button type="button" className="btn-gold" disabled={!profileDone} onClick={() => go(FIRST_AREA_STEP)}>
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= QUESTIONS (one area per step) ================= */}
      {area && (
        <section className="hc-step">
          <div className="wrap hc-narrow">
            <span className="eyebrow">
              Step {step} of {totalSteps} · {AREAS[area]}
            </span>
            <h2>{AREAS[area]}</h2>
            <p className="hc-sub">Answer for how things actually work today, not how the policy says they should.</p>

            {areaQuestions.map((q, i) => (
              <fieldset className="hc-q" key={q.id}>
                <legend>
                  <span className="hc-qnum mono">{(step - FIRST_AREA_STEP) * 3 + i + 1}</span>
                  {q.text}
                </legend>
                <div className="hc-answers">
                  {ANSWER_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`hc-answer a${a}${answers[q.id] === a ? " on" : ""}`}
                      aria-pressed={answers[q.id] === a}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: a }))}
                    >
                      {ANSWER_LABELS[a]}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className="hc-nav">
              <button type="button" className="hc-back" onClick={() => go(step - 1)}>
                Back
              </button>
              <button type="button" className="btn-gold" disabled={!areaDone} onClick={() => go(step + 1)}>
                {step === GATE_STEP - 1 ? "See my score" : "Continue"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= SCORE + GATE ================= */}
      {step === GATE_STEP && (
        <section className="hc-step">
          <div className="wrap hc-result-grid">
            <div>
              <span className="eyebrow">Your result</span>
              <ScoreBlock result={preview} />
              <AreaBars result={preview} />
            </div>

            <div className="form-card">
              <h3>Get your full report</h3>
              <p>
                See your {preview.gaps.length > 0 ? `${preview.gaps.length} control gaps` : "results"}, ranked by
                risk, each with the fix. We&apos;ll also email you a copy.
              </p>
              <div className="field">
                <label htmlFor="hc-name">Full name</label>
                <input id="hc-name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={submitting} />
              </div>
              <div className="field">
                <label htmlFor="hc-email">Work email</label>
                <input id="hc-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} />
              </div>
              <div className="field">
                <label htmlFor="hc-org">Organisation</label>
                <input id="hc-org" autoComplete="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} disabled={submitting} />
              </div>
              <div className="field">
                <label htmlFor="hc-role">Your role</label>
                <select id="hc-role" value={role} onChange={(e) => setRole(e.target.value)} disabled={submitting}>
                  <option value="">Select a role…</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="hc-phone">Phone (optional)</label>
                <input id="hc-phone" type="tel" autoComplete="tel" placeholder="080..." value={phone} onChange={(e) => setPhone(e.target.value)} disabled={submitting} />
              </div>
              <label className="hc-check">
                <input type="checkbox" checked={wantsWalkthrough} onChange={(e) => setWantsWalkthrough(e.target.checked)} disabled={submitting} />
                <span>I&apos;d like a free walkthrough of how Smart Office closes these gaps</span>
              </label>
              <button className="btn-submit" type="button" onClick={submit} disabled={submitting}>
                {submitting ? "Preparing your report…" : "Show my full report"}
              </button>
              {error && (
                <div className="form-msg err" role="status">
                  {error}
                </div>
              )}
              <p className="privacy-note">
                We only use your details to send your report and respond to you. Your answers stay
                confidential.
              </p>
              <button type="button" className="hc-back hc-back-inline" onClick={() => go(GATE_STEP - 1)} disabled={submitting}>
                Change my answers
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= FULL REPORT ================= */}
      {step === REPORT_STEP && report && (
        <section className="hc-step hc-report">
          <div className="wrap hc-narrow">
            <div className="hc-report-head">
              <span className="eyebrow">Payment Control Health Check · {organization.trim()}</span>
              <span className="mono hc-date">
                {new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <ScoreBlock result={report} />
            <AreaBars result={report} />

            <h2 className="hc-h2">
              {report.gaps.length > 0 ? "Your gaps, most serious first" : "No gaps found"}
            </h2>
            {report.gaps.length === 0 && (
              <p className="hc-sub">Every control we asked about is in place. Keep the evidence ready for your next audit.</p>
            )}
            <ol className="hc-gaps">
              {report.gaps.map((g) => (
                <li key={g.id} className="hc-gap">
                  <div className="hc-gap-top">
                    <span className="hc-gap-area mono">{g.area}</span>
                    <span className={`hc-gap-ans a${g.answer}`}>{ANSWER_LABELS[g.answer]}</span>
                  </div>
                  <h3>{g.text}</h3>
                  <p className="hc-risk">
                    <b>Risk</b> {g.risk}
                  </p>
                  <p className="hc-fix">
                    <b>Smart Office</b> {g.fix}
                  </p>
                </li>
              ))}
            </ol>

            <div className="hc-cta">
              <h2>Close these gaps in weeks, not years</h2>
              <p>
                {wantsWalkthrough
                  ? "Thank you. A member of the Smart Office team will contact you shortly to arrange a walkthrough on your own approval process."
                  : "Smart Office puts every one of these controls into your daily approvals. Ask us for a walkthrough on your own approval process."}{" "}
                A copy of this report is on its way to {email.trim()}.
              </p>
              <div className="hc-cta-actions">
                {!wantsWalkthrough && (
                  <a className="btn-gold" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Walkthrough request")}`}>
                    Request a walkthrough
                  </a>
                )}
                <a className="btn-outline" href="tel:+2348116112447">
                  Call +234 811 611 2447
                </a>
                <button type="button" className="btn-outline" onClick={() => window.print()}>
                  Save as PDF
                </button>
              </div>
            </div>

            <div className="hc-share">
              <span>Know another organisation that should check its payment controls?</span>
              <div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${PAGE_URL}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on WhatsApp
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PAGE_URL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>

            <p className="hc-method">
              <b>How the score works.</b> Each answer scores 2 (yes, always), 1 (sometimes) or 0 (no).
              Controls that most often let a wrong payment through count one and a half times. The
              exposure range applies between 0.5% (all controls in place) and 5% (none) to the midpoint
              of your annual payments band; 5% is the share of revenue the ACFE&apos;s global fraud
              studies estimate organisations lose to fraud each year. It is an indicative estimate from
              your answers, not an audit finding.
            </p>
          </div>
        </section>
      )}

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
            <a href="/smartoffice">About Smart Office</a>
            <a href={APP_URL}>Sign in</a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <p className="small">© 2026 Hi&apos;ported Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function ScoreBlock({ result }: { result: Result }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className={`hc-score g-${result.grade.toLowerCase()}`}>
      <svg viewBox="0 0 120 120" className="hc-dial" role="img" aria-label={`Score ${result.score} out of 100`}>
        <circle cx="60" cy="60" r={r} className="track" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="value"
          strokeDasharray={`${(result.score / 100) * c} ${c}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="58" textAnchor="middle" className="num">
          {result.score}
        </text>
        <text x="60" y="78" textAnchor="middle" className="of">
          / 100
        </text>
      </svg>
      <div>
        <div className="hc-grade">{result.grade} controls</div>
        <p>{GRADE_NOTE[result.grade]}</p>
        {result.exposure && (
          <div className="hc-exposure">
            <span className="mono">Indicative payments at risk</span>
            <strong>
              {formatNaira(result.exposure.low)} – {formatNaira(result.exposure.high)}
            </strong>
            <span>a year</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AreaBars({ result }: { result: Result }) {
  return (
    <div className="hc-bars">
      {result.areas.map((a) => (
        <div className="hc-bar" key={a.id}>
          <div className="hc-bar-label">
            <span>{a.name}</span>
            <span className="mono">{a.score}%</span>
          </div>
          <div className="hc-bar-track">
            <span
              className={a.score >= 80 ? "good" : a.score >= 50 ? "mid" : "bad"}
              style={{ width: `${Math.max(a.score, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
