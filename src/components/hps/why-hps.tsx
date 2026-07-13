import { Check } from "lucide-react";
import { WHY_HPS } from "@/lib/hps-data";
import { Reveal } from "./reveal";

export function WhyHPS() {
  return (
    <section id="why" className="py-20 sm:py-24">
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Why Clients Choose HPS</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            More than problem-solver, we are your growth partner
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_HPS.map((w, i) => (
            <Reveal
              key={w.title}
              delay={(i % 3) * 80}
              className="border p-7 sm:p-8 transition-colors hover:border-[rgba(0,87,184,0.3)]"
              style={{
                borderColor: "#E2E8F0",
                background: "#FFFFFF",
              }}
            >
              <h3 className="flex items-center gap-2.5 text-[1.05rem] font-bold mb-2.5 text-[#0A2540]">
                <Check
                  className="size-4 flex-shrink-0"
                  style={{ color: "var(--color-blue)" }}
                />
                {w.title}
              </h3>
              <p className="text-[0.93rem] text-[var(--color-steel)]">{w.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
