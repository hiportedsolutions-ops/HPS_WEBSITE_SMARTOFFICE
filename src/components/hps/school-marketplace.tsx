import { Reveal } from "./reveal";

export function SchoolMarketplace() {
  return (
    <section id="school" className="py-20 sm:py-24">
      <div className="hps-wrap">
        <Reveal>
          <div
            className="grid md:grid-cols-2 gap-px border"
            style={{
              background: "rgba(201,161,59,0.22)",
              borderColor: "rgba(201,161,59,0.22)",
            }}
          >
            <div className="p-9 sm:p-12" style={{ background: "var(--color-slate-hps)" }}>
              <div className="hps-eyebrow">Hi&apos;ported Business School</div>
              <h3 className="text-[1.5rem] font-extrabold mb-3.5">
                Learn the business of business
              </h3>
              <p className="text-[var(--color-steel)] text-[0.98rem] mb-6">
                Practical certification programmes, professional courses and
                corporate training — accounting, internal audit, entrepreneurship,
                AI for business, data analytics and Excel. Built for real-world
                application.
              </p>
              <a href="#services" className="btn-ghost">
                Explore Programmes
              </a>
            </div>
            <div className="p-9 sm:p-12" style={{ background: "var(--color-slate-hps)" }}>
              <div className="hps-eyebrow">HPS Marketplace</div>
              <h3 className="text-[1.5rem] font-extrabold mb-3.5">
                Tools that work as hard as you do
              </h3>
              <p className="text-[var(--color-steel)] text-[0.98rem] mb-6">
                Business plan templates, financial models, internal control
                checklists, tax calendars and digital business tools —
                professional resources you can put to work today.
              </p>
              <a href="#contact" className="btn-ghost">
                Visit Marketplace
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
