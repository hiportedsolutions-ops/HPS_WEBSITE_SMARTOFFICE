import { Reveal } from "./reveal";

export function Purpose() {
  return (
    <section id="purpose" className="py-20 sm:py-24">
      <div className="hps-wrap grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
        <Reveal>
          <div className="hps-eyebrow">Why HPS Exists</div>
          <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold mb-5">
            We build businesses <span className="gold-text">that last.</span>
          </h2>
          <p className="text-[var(--color-steel)] mb-[18px]">
            Every business deserves accurate financial information, efficient
            systems, and strategic guidance. At HPS, we combine accounting
            expertise, business strategy, automation and technology to help
            organizations grow with confidence.
          </p>
          <p className="text-[var(--color-steel)]">
            Whether you are starting out, scaling operations, or preparing for
            international expansion — we provide the professional support needed
            to achieve measurable results.
          </p>
        </Reveal>

        <Reveal className="grid gap-0 border" delay={120}>
          <div
            className="border-b last:border-b-0 px-7 py-6"
            style={{
              borderColor: "#E2E8F0",
              background: "#F6F8FB",
            }}
          >
            <strong
              className="block text-[1.6rem] mb-1"
              style={{
                fontFamily: "var(--font-archivo)",
                color: "var(--color-blue)",
              }}
            >
              12
            </strong>
            <small className="text-[var(--color-steel)] text-[0.92rem]">
              Integrated service lines — from registration to AI-driven
              automation
            </small>
          </div>
          <div
            className="border-b last:border-b-0 px-7 py-6"
            style={{
              borderColor: "#E2E8F0",
              background: "#F6F8FB",
            }}
          >
            <strong
              className="block text-[1.6rem] mb-1"
              style={{
                fontFamily: "var(--font-archivo)",
                color: "var(--color-blue)",
              }}
            >
              3
            </strong>
            <small className="text-[var(--color-steel)] text-[0.92rem]">
              Jurisdictions for company registration: Nigeria, United Kingdom,
              United States
            </small>
          </div>
          <div
            className="px-7 py-6"
            style={{ background: "#F6F8FB" }}
          >
            <strong
              className="block text-[1.6rem] mb-1"
              style={{
                fontFamily: "var(--font-archivo)",
                color: "var(--color-blue)",
              }}
            >
              1
            </strong>
            <small className="text-[var(--color-steel)] text-[0.92rem]">
              Partner for the full journey — from idea to sustainable enterprise
            </small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
