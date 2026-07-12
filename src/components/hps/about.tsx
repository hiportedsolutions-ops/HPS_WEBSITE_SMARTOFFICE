import { VALUES } from "@/lib/hps-data";
import { Reveal } from "./reveal";

const IDEAL_CLIENTS = [
  "Entrepreneurs",
  "Startup Founders",
  "SMEs",
  "Corporate Organizations",
  "NGOs",
  "Churches",
  "Educational Institutions",
  "Investors",
  "Development Partners",
  "Government Agencies",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20">
      {/* Hero */}
      <div
        className="relative pt-[120px] pb-16 sm:pt-[150px] sm:pb-16"
        style={{
          background:
            "radial-gradient(700px 380px at 85% -20%, rgba(201,161,59,0.12), transparent 60%), linear-gradient(165deg,#131B24 0%,#0F151C 70%)",
        }}
      >
        <div className="hps-wrap">
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: "rgba(147,161,176,0.6)",
              textTransform: "uppercase",
            }}
          >
            <a href="#top" className="hover:text-[var(--color-gold-bright)]">
              HOME
            </a>{" "}
            / ABOUT HPS
          </p>
          <h1 className="text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold mb-4 max-w-[760px]">
            A business growth partner —{" "}
            <span className="gold-text">not just a service provider.</span>
          </h1>
          <p className="text-[var(--color-steel)] text-[1.08rem] max-w-[640px]">
            Hi&apos;ported Professional Services exists to help individuals,
            startups, SMEs, NGOs, churches, schools and corporations build
            sustainable, profitable businesses.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 sm:py-24">
        <div className="hps-wrap grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="hps-eyebrow">Our Story</div>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold mb-5">
              From accounting expertise to{" "}
              <span className="gold-text">enterprise solutions.</span>
            </h2>
            <p className="text-[var(--color-steel)] mb-[18px]">
              HPS began with a simple observation: too many good businesses fail
              — not because the idea was weak, but because the systems around it
              were. Poor records, missed compliance, no strategy, no structure.
            </p>
            <p className="text-[var(--color-steel)] mb-[18px]">
              We built HPS to close that gap. Today we combine practical business
              knowledge, accounting expertise, technology and strategic advisory
              to help organizations improve performance, strengthen compliance
              and grow for the long term — in Nigeria and internationally.
            </p>
            <p className="text-[var(--color-steel)]">
              We don&apos;t just solve business problems. We help entrepreneurs
              build systems that create sustainable growth, improve
              profitability, and position them for long-term success.
            </p>
          </Reveal>
          <Reveal className="grid gap-0 border" delay={120}>
            <div
              className="px-7 py-6 border-b"
              style={{
                borderColor: "rgba(138,151,165,0.18)",
                background: "var(--color-slate-hps)",
              }}
            >
              <strong
                className="block text-[1.6rem] mb-1"
                style={{
                  fontFamily: "var(--font-archivo)",
                  color: "var(--color-gold-bright)",
                }}
              >
                Vision
              </strong>
              <small className="text-[var(--color-steel)] text-[0.92rem]">
                To become Africa&apos;s most trusted business growth and
                professional services partner, helping businesses and
                entrepreneurs compete globally.
              </small>
            </div>
            <div
              className="px-7 py-6"
              style={{ background: "var(--color-slate-hps)" }}
            >
              <strong
                className="block text-[1.6rem] mb-1"
                style={{
                  fontFamily: "var(--font-archivo)",
                  color: "var(--color-gold-bright)",
                }}
              >
                Mission
              </strong>
              <small className="text-[var(--color-steel)] text-[0.92rem]">
                To empower entrepreneurs, organizations and institutions with
                practical business solutions, financial intelligence and
                innovative technologies that promote sustainable growth.
              </small>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24 section-slate">
        <div className="hps-wrap">
          <Reveal className="max-w-[680px] mb-12">
            <div className="hps-eyebrow">Our Guiding Principles</div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
              What we hold ourselves to
            </h2>
          </Reveal>
          <Reveal>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px border"
              style={{ background: "rgba(138,151,165,0.18)" }}
            >
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="p-7"
                  style={{ background: "var(--color-slate-hps)" }}
                >
                  <h3
                    className="text-[1rem] font-bold mb-2"
                    style={{ color: "var(--color-gold-bright)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-[0.88rem] text-[var(--color-steel)]">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ideal clients */}
      <section className="py-20 sm:py-24 section-paper">
        <div className="hps-wrap">
          <Reveal className="max-w-[680px] mb-12">
            <div className="hps-eyebrow">Who We Serve</div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
              Our ideal clients
            </h2>
            <p className="text-[#5A6572] text-[1.06rem]">
              If you&apos;re building something that should outlast you, we&apos;re
              built for you.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {IDEAL_CLIENTS.map((c) => (
                <span
                  key={c}
                  className="border bg-white px-5 py-2.5 text-[0.92rem] font-medium transition-all hover:border-[#9A7A25] hover:text-[#9A7A25]"
                  style={{ borderColor: "rgba(26,34,43,0.2)" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </section>
  );
}
