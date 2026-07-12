"use client";

import { INDUSTRIES } from "@/lib/hps-data";
import { Reveal } from "./reveal";

/**
 * Industries strip — duplicates the list to allow a seamless CSS marquee.
 * Pauses on hover. Falls back to static wrap on prefers-reduced-motion.
 */
export function Industries() {
  const items = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section id="industries" className="py-20 sm:py-24 section-paper">
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Industries We Serve</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            Local relevance. International reach.
          </h2>
          <p className="text-[#5A6572] text-[1.06rem]">
            From startups in Abuja to organizations expanding into the UK and US
            — we understand the realities of the sectors we serve.
          </p>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden -mx-6 px-6">
            <div className="marquee-track gap-3">
              {items.map((ind, i) => (
                <span
                  key={`${ind}-${i}`}
                  className="whitespace-nowrap border bg-white px-5 py-2.5 text-[0.92rem] font-medium transition-all hover:border-[var(--color-blue)] hover:text-[var(--color-blue)]"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
