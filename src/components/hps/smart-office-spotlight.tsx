import Link from "next/link";
import { Reveal } from "./reveal";

const APP_URL = "https://smartoffice.hiported.com";

const POINTS = [
  "Payment memos routed through every reviewer, from department head to treasury",
  "Internal audit inside the workflow, before any money moves",
  "Budget checks, risk flags and a complete, timestamped audit trail",
];

export function SmartOfficeSpotlight() {
  return (
    <section id="smart-office" className="py-20 sm:py-24" style={{ background: "#F5F8FC" }}>
      <div className="hps-wrap">
        <Reveal>
          <div
            className="grid md:grid-cols-[1.15fr_1fr] gap-px border rounded-lg overflow-hidden"
            style={{ background: "#E2E8F0", borderColor: "#E2E8F0" }}
          >
            <div className="p-9 sm:p-12" style={{ background: "#FFFFFF" }}>
              <div className="hps-eyebrow">Our product · Smart Office</div>
              <h3 className="text-[1.6rem] sm:text-[1.9rem] font-extrabold mb-3.5 text-[#0A2540] leading-tight">
                The digital office for approvals that stand up to audit
              </h3>
              <p className="text-[var(--color-steel)] text-[0.98rem] mb-6">
                Smart Office replaces paper memos and approval files with one secure,
                role-based platform for universities, agencies and growing organisations.
                Built by accounting and internal audit professionals.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/smartoffice" className="btn-gold">
                  Discover Smart Office
                </Link>
                <a href={APP_URL} className="btn-ghost">
                  Sign in
                </a>
              </div>
            </div>
            <div className="p-9 sm:p-12" style={{ background: "#FFFFFF" }}>
              <ul className="space-y-4">
                {POINTS.map((p) => (
                  <li key={p} className="flex gap-3 text-[0.96rem] text-[#3D4854]">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-2 flex-shrink-0 rounded-full"
                      style={{ background: "var(--color-blue)" }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[var(--color-steel)]">
                New institution?{" "}
                <Link href="/smartoffice#get-started" className="font-semibold text-[var(--color-blue)] hover:underline">
                  Get started
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
