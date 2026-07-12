import { SERVICE_GROUPS } from "@/lib/hps-data";
import { Reveal } from "./reveal";

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 scroll-mt-20">
      <div className="hps-wrap">
        <Reveal className="max-w-[760px] mb-12">
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: "rgba(90,101,114,0.7)",
              textTransform: "uppercase",
            }}
          >
            <a href="#top" className="hover:text-[var(--color-blue)]">
              HOME
            </a>{" "}
            / SERVICES
          </p>
          <h1 className="text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold mb-4">
            Twelve service lines.{" "}
            <span className="gold-text">One growth partner.</span>
          </h1>
          <p className="text-[var(--color-steel)] text-[1.08rem] max-w-[640px]">
            Everything an organization needs to start, run and grow — delivered
            by professionals who combine accounting expertise with modern
            technology.
          </p>
        </Reveal>

        <div className="space-y-16">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-24">
              <Reveal>
                <h2 className="flex items-center gap-3.5 text-[1.6rem] font-extrabold mb-2 text-[#0A2540]">
                  <span style={{ color: "var(--color-gold)" }}>◈</span>
                  {g.title}
                </h2>
                <p className="text-[var(--color-steel)] mb-6 max-w-[640px]">
                  {g.desc}
                </p>
                <div
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border rounded-lg overflow-hidden"
                  style={{ background: "#E2E8F0" }}
                >
                  {g.services.map((s) => (
                    <div
                      key={s}
                      className="p-5 text-[0.94rem] text-[#3D4854] transition-colors hover:bg-[#F6F8FB]"
                      style={{ background: "#FFFFFF" }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
