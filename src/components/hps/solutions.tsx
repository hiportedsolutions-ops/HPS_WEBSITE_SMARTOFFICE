import Link from "next/link";
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
      style={{ background: "#F6F8FB" }}
    >
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Our Solutions</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            End-to-end support for every stage of growth
          </h2>
          <p className="text-[var(--color-steel)] text-[1.06rem]">
            Not just services, integrated business solutions designed to
            strengthen compliance, improve performance and position you for
            long-term success.
          </p>
        </Reveal>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border rounded-lg overflow-hidden"
          style={{ background: "#E2E8F0" }}
        >
          {SOLUTIONS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Compass;
            const anchor =
              "href" in s && s.href
                ? s.href
                : "anchor" in s && s.anchor
                  ? `#${s.anchor}`
                  : undefined;
            return (
              <Reveal
                key={s.title}
                delay={(i % 3) * 80}
                className="group relative p-8 sm:p-9 transition-colors hover:bg-white"
                style={{ background: "#FFFFFF" } as React.CSSProperties}
              >
                {/* gold top accent on hover — subtle highlight */}
                <span
                  className="absolute top-0 left-0 h-[3px] w-0 group-hover:w-full transition-[width] duration-300"
                  style={{
                    background: "linear-gradient(90deg,#B8902E,#E6C466)",
                  }}
                />
                {anchor?.startsWith("/") ? (
                  <Link
                    href={anchor}
                    aria-label={`${s.title}, learn more`}
                    className="absolute inset-0"
                  />
                ) : anchor ? (
                  <a
                    href={anchor}
                    aria-label={`${s.title}, learn more`}
                    className="absolute inset-0"
                  />
                ) : null}
                <Icon
                  className="size-6 mb-4"
                  style={{ color: "var(--color-blue)" }}
                />
                <h3 className="text-[1.18rem] font-bold mb-3 text-[#0A2540]">
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
                        color: "var(--color-blue)",
                        borderColor: "rgba(0, 87, 184, 0.18)",
                        background: "rgba(0, 87, 184, 0.04)",
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
