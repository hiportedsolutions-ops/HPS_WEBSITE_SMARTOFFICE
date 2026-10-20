import { HPS_CONTACT } from "@/lib/hps-data";

const FOOTER_LINKS = {
  Solutions: [
    { label: "Business Advisory", href: "#solutions" },
    { label: "Accounting", href: "#solutions" },
    { label: "Business Registration", href: "#cac" },
    { label: "Automation & AI", href: "#solutions" },
    { label: "Smart Office", href: "/smartoffice" },
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
        background: "#0A2540",
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <div className="hps-wrap py-14 sm:py-[70px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-11 mb-12">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="flex items-center gap-3"
              aria-label="Hi'ported Professional Service, home"
            >
              <img
                src="/hps-logo.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="size-12 object-contain flex-shrink-0"
              />
              <span className="flex flex-col leading-none">
                <span
                  className="font-extrabold tracking-tight text-[1.05rem] text-white"
                  style={{ fontFamily: "var(--font-archivo)" }}
                >
                  HI&apos;PORTED
                </span>
                <span
                  className="mt-0.5 text-[0.62rem] font-medium tracking-[0.14em] uppercase"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    color: "#E6C466",
                  }}
                >
                  Professional Service
                </span>
              </span>
            </a>
            <p className="text-[#9FB2C9] text-[0.92rem] mt-4 mb-4 max-w-[300px]">
              A business growth and enterprise solutions company helping
              organizations start, grow and sustain profitable businesses.
            </p>
            <ul className="space-y-2.5">
              <li className="flex gap-2.5 items-baseline">
                <span className="text-[0.8rem]" style={{ color: "#E6C466" }}>
                  ◆
                </span>
                <span className="text-[0.92rem] text-[#9FB2C9]">
                  {HPS_CONTACT.address}
                </span>
              </li>
              <li className="flex flex-col gap-1">
                {HPS_CONTACT.emails.map((email) => (
                  <span key={email} className="flex gap-2.5 items-baseline">
                    <span
                      className="text-[0.8rem]"
                      style={{ color: "#E6C466" }}
                    >
                      ◆
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-[0.92rem] text-[#9FB2C9] hover:text-[#E6C466] transition-colors"
                    >
                      {email}
                    </a>
                  </span>
                ))}
              </li>
              <li className="flex gap-2.5 items-baseline">
                <span className="text-[0.8rem]" style={{ color: "#E6C466" }}>
                  ◆
                </span>
                <span className="text-[0.92rem] text-[#9FB2C9]">
                  {HPS_CONTACT.phones.join(" · ")}
                </span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="mb-[18px] text-[0.88rem] uppercase tracking-[0.1em]"
                style={{ color: "#E6C466" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[0.92rem] text-[#9FB2C9] hover:text-white transition-colors"
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
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "rgba(159,178,201,0.7)",
            }}
          >
            © 2026 HI&apos;PORTED PROFESSIONAL SERVICES · {HPS_CONTACT.bn} ·
            GARKI ABUJA-NIGERIA
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "rgba(159,178,201,0.7)",
            }}
          >
            BUILDING BUSINESSES, CREATING OPPORTUNITIES & SUSTAINING SUCCESS
          </span>
        </div>
      </div>
    </footer>
  );
}
