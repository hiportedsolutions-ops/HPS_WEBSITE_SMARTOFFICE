import { HPS_CONTACT } from "@/lib/hps-data";

export function Hero() {
  return (
    <header
      id="top"
      className="relative overflow-hidden pt-[150px] pb-[90px] sm:pt-[180px] sm:pb-[110px]"
      style={{
        background:
          "radial-gradient(900px 500px at 82% -10%, rgba(0,87,184,0.08), transparent 60%), radial-gradient(700px 460px at -10% 110%, rgba(212,175,55,0.06), transparent 60%), #FFFFFF",
      }}
    >
      <div className="hero-grid-bg" aria-hidden />
      <div className="hps-wrap relative z-[2]">
        <div className="max-w-[820px]">
          <div className="hps-eyebrow">Business Growth &amp; Enterprise Solutions</div>
          <h1 className="text-[clamp(2.5rem,5.6vw,4.3rem)] font-extrabold my-0 mb-6">
            <span className="block">Building Businesses.</span>
            <span className="block gold-text">Creating Opportunities.</span>
            <span className="block">Sustaining Success.</span>
          </h1>
          <p className="text-[1.05rem] sm:text-[1.14rem] text-[var(--color-steel)] max-w-[620px] mb-9">
            Hi&apos;ported Professional Services helps entrepreneurs, SMEs, NGOs,
            churches, schools and corporations build sustainable businesses —
            through accounting, audit, business registration, automation, and
            strategic advisory.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-gold">
              Book a Free Consultation
            </a>
            <a href="#solutions" className="btn-ghost">
              Explore Our Solutions
            </a>
          </div>
        </div>
      </div>
      <span
        className="absolute right-6 bottom-6 z-[2] hidden sm:block"
        style={{
          fontFamily: "var(--font-ibm-plex-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.14em",
          color: "rgba(90,101,114,0.6)",
        }}
      >
        RC — {HPS_CONTACT.bn} · GARKI, ABUJA
      </span>
    </header>
  );
}
