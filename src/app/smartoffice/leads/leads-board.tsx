"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import "../smartoffice.css";
import "./leads.css";
import { ANSWER_LABELS, AREAS, QUESTIONS, formatNaira, type Answer } from "@/lib/health-check";

const SESSION_API = "/api/smartoffice-leads-admin/session";
const CHECKS_API = "/api/smartoffice-leads-admin/checks";

// Same list as LEAD_STATUSES in src/lib/health-check-db.ts (server-only file).
const STATUSES = ["new", "contacted", "demo booked", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

type Check = {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  role: string | null;
  phone: string | null;
  sector: string;
  staffBand: string;
  paymentsBand: string;
  answers: Record<string, Answer>;
  score: number;
  grade: string;
  exposureLow: number | null;
  exposureHigh: number | null;
  wantsWalkthrough: boolean;
  createdAt: string;
  status: Status;
  notes: string | null;
  statusUpdatedAt: string | null;
};

type Session = { configured: boolean; signedIn: boolean };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function LeadsBoard() {
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  const [checks, setChecks] = useState<Check[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [walkthroughOnly, setWalkthroughOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(CHECKS_API, { cache: "no-store" });
      if (res.status === 401) {
        setSession((s) => (s ? { ...s, signedIn: false } : s));
        setChecks(null);
      } else {
        const data = await res.json();
        if (res.ok) setChecks(data.checks);
        else setError(data.error || "Could not load the Health Checks.");
      }
    } catch {
      setError("Could not reach the server. Please check your connection.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch(SESSION_API, { cache: "no-store" })
      .then((r) => r.json())
      .then((s: Session) => {
        setSession(s);
        if (s.signedIn) load();
      })
      .catch(() => setError("Could not reach the server. Please check your connection."));
  }, [load]);

  async function signIn() {
    setSigningIn(true);
    setError("");
    try {
      const res = await fetch(SESSION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPassword("");
        setSession({ configured: true, signedIn: true });
        load();
      } else {
        setError(data.error || "Could not sign in.");
      }
    } catch {
      setError("Could not reach the server. Please check your connection.");
    }
    setSigningIn(false);
  }

  async function signOut() {
    await fetch(SESSION_API, { method: "DELETE" }).catch(() => {});
    setChecks(null);
    setSession((s) => (s ? { ...s, signedIn: false } : s));
  }

  const visible = useMemo(() => {
    if (!checks) return [];
    const q = search.trim().toLowerCase();
    return checks.filter(
      (c) =>
        (!walkthroughOnly || c.wantsWalkthrough) &&
        (!statusFilter || c.status === statusFilter) &&
        (!gradeFilter || c.grade === gradeFilter) &&
        (!q || [c.organization, c.fullName, c.email, c.phone ?? "", c.sector].some((v) => v.toLowerCase().includes(q))),
    );
  }, [checks, search, walkthroughOnly, statusFilter, gradeFilter]);

  const stats = useMemo(() => {
    const all = checks ?? [];
    const weekAgo = Date.now() - 7 * 86400_000;
    return {
      total: all.length,
      waiting: all.filter((c) => c.wantsWalkthrough && c.status === "new").length,
      week: all.filter((c) => new Date(c.createdAt).getTime() >= weekAgo).length,
      avg: all.length ? Math.round(all.reduce((s, c) => s + c.score, 0) / all.length) : 0,
    };
  }, [checks]);

  function onSaved(updated: Pick<Check, "id" | "status" | "notes" | "statusUpdatedAt">) {
    setChecks((list) => list?.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)) ?? list);
  }

  return (
    <div className="smartoffice-page ld-page">
      <header className="so-header">
        <div className="wrap nav">
          <a className="brand" href="/smartoffice" aria-label="Smart Office home">
            <img src="/smart-office-logo.png" alt="Smart Office" className="logo-img" />
          </a>
          {session?.signedIn && (
            <div className="nav-actions">
              <button type="button" className="ld-ghost" onClick={signOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="wrap ld-main">
        {!session && !error && <p className="ld-muted">Loading…</p>}

        {/* ================= SIGN IN ================= */}
        {session && !session.signedIn && (
          <div className="form-card ld-signin">
            <span className="eyebrow">Team only</span>
            <h1>Smart Office leads</h1>
            {!session.configured ? (
              <p>
                This page has no password yet. Add <code>LEADS_ADMIN_PASSWORD</code> (at least 12
                characters) to the website project in Vercel, then redeploy.
              </p>
            ) : (
              <>
                <p>Enter the team password to see every Health Check.</p>
                <div className="field">
                  <label htmlFor="ld-pw">Password</label>
                  <input
                    id="ld-pw"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && password && signIn()}
                    disabled={signingIn}
                  />
                </div>
                <button className="btn-submit" type="button" onClick={signIn} disabled={signingIn || !password}>
                  {signingIn ? "Signing in…" : "Sign in"}
                </button>
              </>
            )}
            {error && (
              <div className="form-msg err" role="status">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ================= BOARD ================= */}
        {session?.signedIn && (
          <>
            <div className="ld-head">
              <div>
                <span className="eyebrow">Payment Control Health Check</span>
                <h1>Leads</h1>
              </div>
              <div className="ld-actions">
                <button type="button" className="ld-btn" onClick={load} disabled={loading}>
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
                <a className="ld-btn ld-btn-primary" href={`${CHECKS_API}?format=csv`}>
                  Download CSV
                </a>
              </div>
            </div>

            <div className="ld-stats">
              <div>
                <strong>{stats.total}</strong>
                <span>Health Checks</span>
              </div>
              <div className={stats.waiting ? "hot" : ""}>
                <strong>{stats.waiting}</strong>
                <span>Want a walkthrough, not yet contacted</span>
              </div>
              <div>
                <strong>{stats.week}</strong>
                <span>In the last 7 days</span>
              </div>
              <div>
                <strong>{stats.total ? stats.avg : "—"}</strong>
                <span>Average score</span>
              </div>
            </div>

            <div className="ld-filters">
              <input
                type="search"
                placeholder="Search organisation, name, email, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Status">
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} aria-label="Grade">
                <option value="">All grades</option>
                {["Critical", "Weak", "Moderate", "Strong"].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <label className="ld-toggle">
                <input type="checkbox" checked={walkthroughOnly} onChange={(e) => setWalkthroughOnly(e.target.checked)} />
                Wants walkthrough only
              </label>
            </div>

            {error && (
              <div className="form-msg err" role="status">
                {error}
              </div>
            )}

            {checks && visible.length === 0 && (
              <p className="ld-empty">{checks.length ? "No Health Checks match these filters." : "No Health Checks yet."}</p>
            )}

            {visible.length > 0 && (
              <div className="ld-table-wrap">
                <table className="ld-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Organisation</th>
                      <th>Contact</th>
                      <th>Score</th>
                      <th>At risk / year</th>
                      <th>Walkthrough</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((c) => (
                      <Fragment key={c.id}>
                        <tr
                          className={`ld-row${openId === c.id ? " open" : ""}`}
                          onClick={() => setOpenId(openId === c.id ? null : c.id)}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && setOpenId(openId === c.id ? null : c.id)}
                          aria-expanded={openId === c.id}
                        >
                          <td className="mono ld-date">{fmtDate(c.createdAt)}</td>
                          <td>
                            <b>{c.organization}</b>
                            <span className="ld-sub">{c.sector}</span>
                          </td>
                          <td>
                            {c.fullName}
                            <span className="ld-sub">{c.phone || c.email}</span>
                          </td>
                          <td>
                            <span className={`ld-grade g-${c.grade.toLowerCase()}`}>
                              {c.score} {c.grade}
                            </span>
                          </td>
                          <td className="mono">
                            {c.exposureLow != null && c.exposureHigh != null
                              ? `${formatNaira(c.exposureLow)} – ${formatNaira(c.exposureHigh)}`
                              : "—"}
                          </td>
                          <td>{c.wantsWalkthrough ? <span className="ld-yes">Yes</span> : "No"}</td>
                          <td>
                            <span className={`ld-status s-${c.status.replace(" ", "-")}`}>{c.status}</span>
                          </td>
                        </tr>
                        {openId === c.id && (
                          <tr className="ld-detail-row">
                            <td colSpan={7}>
                              <Detail check={c} onSaved={onSaved} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Detail({
  check,
  onSaved,
}: {
  check: Check;
  onSaved: (c: Pick<Check, "id" | "status" | "notes" | "statusUpdatedAt">) => void;
}) {
  const [status, setStatus] = useState<Status>(check.status);
  const [notes, setNotes] = useState(check.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const dirty = status !== check.status || notes.trim() !== (check.notes ?? "");

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${CHECKS_API}/${check.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onSaved(data.check);
        setMsg({ text: "Saved.", ok: true });
      } else {
        setMsg({ text: data.error || "Could not save.", ok: false });
      }
    } catch {
      setMsg({ text: "Could not reach the server.", ok: false });
    }
    setSaving(false);
  }

  return (
    <div className="ld-detail">
      <div className="ld-detail-side">
        <h3>{check.fullName}</h3>
        <p className="ld-sub">{check.role || "Role not given"}</p>
        <p>
          <a href={`mailto:${check.email}`}>{check.email}</a>
        </p>
        {check.phone && (
          <p>
            <a href={`tel:${check.phone}`}>{check.phone}</a>
          </p>
        )}
        <dl>
          <dt>Staff</dt>
          <dd>{check.staffBand}</dd>
          <dt>Payments a year</dt>
          <dd>{check.paymentsBand}</dd>
        </dl>

        <div className="field">
          <label htmlFor={`st-${check.id}`}>Status</label>
          <select id={`st-${check.id}`} value={status} onChange={(e) => setStatus(e.target.value as Status)} disabled={saving}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`nt-${check.id}`}>Notes</label>
          <textarea
            id={`nt-${check.id}`}
            rows={4}
            maxLength={2000}
            placeholder="e.g. Called 23 Oct, demo on Tuesday with the Bursar"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={saving}
          />
        </div>
        <button type="button" className="btn-submit" onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save"}
        </button>
        {msg && <div className={`form-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        {check.statusUpdatedAt && <p className="ld-sub">Status last changed {fmtDate(check.statusUpdatedAt)}</p>}
      </div>

      <div className="ld-answers">
        {(Object.keys(AREAS) as Array<keyof typeof AREAS>).map((area) => (
          <div key={area}>
            <h4>{AREAS[area]}</h4>
            {QUESTIONS.filter((q) => q.area === area).map((q) => {
              const a = check.answers[q.id] ?? 0;
              return (
                <div className="ld-answer" key={q.id}>
                  <span>{q.text}</span>
                  <span className={`ld-ans a${a}`}>{ANSWER_LABELS[a]}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
