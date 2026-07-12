"use client";

import { useEffect, useRef, useState } from "react";
import { FRAMEWORK_STEPS } from "@/lib/hps-data";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

/**
 * 5D Business Growth Framework — HPS's signature interactive element.
 * Five stages: Discover → Design → Deploy → Develop → Dominate.
 * Auto-advances every 4.5s; user can click any stage to focus it.
 */
export function Framework() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activate = (i: number) => {
    setActive(i);
    restart(i);
  };

  const restart = (from: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    timerRef.current = setInterval(
      () => setActive((prev) => (prev + 1) % FRAMEWORK_STEPS.length),
      4500
    );
    void from;
  };

  useEffect(() => {
    restart(0);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section id="framework" className="py-20 sm:py-24 section-slate">
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">The HPS Method</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            Our Business Growth Framework
          </h2>
          <p className="text-[var(--color-steel)] text-[1.06rem]">
            Five stages. One outcome: a business built to last. Select a stage
            to see how we work.
          </p>
        </Reveal>

        <Reveal>
          <div
            className="grid lg:grid-cols-5 border rounded-lg overflow-hidden"
            style={{ borderColor: "#E2E8F0", background: "#FFFFFF" }}
          >
            {FRAMEWORK_STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => activate(i)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative text-left p-7 sm:p-9 transition-colors cursor-pointer",
                    "border-b lg:border-b-0 lg:border-r last:border-r-0 last:border-b-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)]"
                  )}
                  style={{
                    borderColor: "#E2E8F0",
                    background: isActive
                      ? "rgba(0, 87, 184, 0.05)"
                      : "#FFFFFF",
                  }}
                >
                  <span
                    className="block mb-3.5"
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.16em",
                      color: "var(--color-steel)",
                    }}
                  >
                    {step.n}
                  </span>
                  <h3
                    className="text-[1.35rem] font-extrabold mb-2.5 transition-colors"
                    style={{
                      color: isActive
                        ? "var(--color-blue)"
                        : "#0A2540",
                    }}
                  >
                    {step.title}
                  </h3>
                  <div
                    className="grid transition-all duration-300"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <p className="overflow-hidden text-[0.9rem] text-[var(--color-steel)]">
                      {step.desc}
                    </p>
                  </div>
                  {/* progress bar — subtle gold highlight on active stage */}
                  <span
                    className="absolute bottom-0 left-0 h-[3px]"
                    style={{
                      width: isActive ? "100%" : "0%",
                      background: "linear-gradient(90deg,#B8902E,#E6C466)",
                      transition: isActive
                        ? "width 4.5s linear"
                        : "width 0.2s ease",
                    }}
                  />
                </button>
              );
            })}
          </div>
          <p
            className="mt-6"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              color: "var(--color-steel)",
            }}
          >
            DISCOVER → DESIGN → DEPLOY → DEVELOP → DOMINATE
          </p>
        </Reveal>
      </div>
    </section>
  );
}
