import {
  Compass,
  Calculator,
  Landmark,
  Cpu,
  BarChart3,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { SOLUTIONS } from "@/lib/hps-data";
import { Reveal } from "./reveal";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  calculator: Calculator,
  landmark: Landmark,
  cpu: Cpu,
  "bar-chart": BarChart3,
  "graduation-cap": GraduationCap,
};

export function Solutions() {
  return (
    <section
      id="solutions"
      className="py-20 sm:py-24"
      style={{ background: "var(--color-slate-hps)" }}
    >
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Our Solutions</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            End-to-end support for every stage of growth
          </h2>
          <p className="text-[var(--color-steel)] text-[1.06rem]">
            Not just services — integrated business solutions designed to
            strengthen compliance, improve performance and position you for
            long-term success.
          </p>
        </Reveal>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border"
          style={{ background: "rgba(138,151,165,0.18)" }}
        >
          {SOLUTIONS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Compass;
            const anchor =
              "anchor" in s && s.anchor ? `#${s.anchor}` : undefined;
            return (
              <Reveal
                key={s.title}
                delay={(i % 3) * 80}
                className="group relative p-8 sm:p-9 transition-colors hover:bg-[var(--color-slate-2)]"
                style={{ background: "var(--color-slate-hps)" } as React.CSSProperties}
              >
                {/* gold top accent on hover */}
                <span
                  className="absolute top-0 left-0 h-[3px] w-0 group-hover:w-full transition-[width] duration-300"
                  style={{
                    background: "linear-gradient(90deg,#B08A2E,#E6BE55)",
                  }}
                />
                {anchor ? (
                  <a
                    href={anchor}
                    aria-label={`${s.title} — learn more`}
                    className="absolute inset-0"
                  />
                ) : null}
                <Icon
                  className="size-6 mb-4"
                  style={{ color: "var(--color-gold)" }}
                />
                <h3 className="text-[1.18rem] font-bold mb-3 text-[#F2F4F6]">
                  {s.title}
                </h3>
                <p className="text-[0.95rem] text-[var(--color-steel)] mb-4">
                  {s.desc}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="border px-2.5 py-1"
                      style={{
                        fontFamily: "var(--font-ibm-plex-mono)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.06em",
                        color: "#BFC8D0",
                        borderColor: "rgba(138,151,165,0.18)",
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
