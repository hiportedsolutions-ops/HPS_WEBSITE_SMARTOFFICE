import { HPS_CONTACT } from "@/lib/hps-data";

const FOOTER_LINKS = {
  Solutions: [
    { label: "Business Advisory", href: "#solutions" },
    { label: "Accounting", href: "#solutions" },
    { label: "Business Registration", href: "#cac" },
    { label: "Automation & AI", href: "#solutions" },
    { label: "Research & Analytics", href: "#solutions" },
  ],
  Company: [
    { label: "Why HPS Exists", href: "#purpose" },
    { label: "Our Framework", href: "#framework" },
    { label: "Success Stories", href: "#stories" },
    { label: "Business School", href: "#school" },
    { label: "Marketplace", href: "#school" },
  ],
  "Get Started": [
    { label: "Book a Consultation", href: "#contact" },
    { label: "Request a Quote", href: "#contact" },
    { label: "Industries We Serve", href: "#industries" },
    { label: "Our Services", href: "#services" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: "#0C1117",
        borderColor: "rgba(138,151,165,0.18)",
      }}
    >
      <div className="hps-wrap py-14 sm:py-[70px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-11 mb-12">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="flex items-center gap-3"
              aria-label="HPS home"
            >
              <span className="hps-logo-mark">HPS</span>
              <span
                className="font-extrabold tracking-tight text-base sm:text-lg"
                style={{ fontFamily: "var(--font-archivo)" }}
              >
                HI&apos;PORTED
              </span>
            </a>
            <p className="text-[var(--color-steel)] text-[0.92rem] mt-4 mb-4 max-w-[300px]">
              A business growth and enterprise solutions company helping
              organizations start, grow and sustain profitable businesses.
            </p>
            <ul className="space-y-2.5">
              <li className="flex gap-2.5 items-baseline">
                <span
                  className="text-[0.8rem]"
                  style={{ color: "var(--color-gold)" }}
                >
                  ◆
                </span>
                <span className="text-[0.92rem] text-[var(--color-steel)]">
                  {HPS_CONTACT.address}
                </span>
              </li>
              <li className="flex gap-2.5 items-baseline">
                <span
                  className="text-[0.8rem]"
                  style={{ color: "var(--color-gold)" }}
                >
                  ◆
                </span>
                <a
                  href={`mailto:${HPS_CONTACT.email}`}
                  className="text-[0.92rem] text-[var(--color-steel)] hover:text-[var(--color-gold-bright)]"
                >
                  {HPS_CONTACT.email}
                </a>
              </li>
              <li className="flex gap-2.5 items-baseline">
                <span
                  className="text-[0.8rem]"
                  style={{ color: "var(--color-gold)" }}
                >
                  ◆
                </span>
                <span className="text-[0.92rem] text-[var(--color-steel)]">
                  {HPS_CONTACT.phones.join(" · ")}
                </span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="mb-4.5 mb-[18px] text-[0.88rem] uppercase tracking-[0.1em]"
                style={{ color: "var(--color-gold)" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[0.92rem] text-[var(--color-steel)] hover:text-[var(--color-gold-bright)] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="border-t pt-6 flex flex-wrap justify-between gap-3"
          style={{ borderColor: "rgba(138,151,165,0.18)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "rgba(147,161,176,0.6)",
            }}
          >
            © 2026 HI&apos;PORTED PROFESSIONAL SERVICES · {HPS_CONTACT.bn} ·
            GARKI, ABUJA
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "rgba(147,161,176,0.6)",
            }}
          >
            BUILDING BUSINESSES · CREATING OPPORTUNITIES · SUSTAINING SUCCESS
          </span>
        </div>
      </div>
    </footer>
  );
}
