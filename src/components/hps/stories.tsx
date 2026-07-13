import { STORIES } from "@/lib/hps-data";
import { Reveal } from "./reveal";

export function Stories() {
  return (
    <section id="stories" className="py-20 sm:py-24 section-paper">
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Success Stories</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            Challenge. Solution. Result.
          </h2>
          <p className="text-[#5A6572] text-[1.06rem]">
            We measure our work by the outcomes our clients achieve.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map((s, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 80}
              className="bg-white border p-8 sm:p-9"
              style={{ borderColor: "#E2E8F0" }}
            >
              <p
                className="uppercase mb-1.5 mt-4 first:mt-0"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "var(--color-blue)",
                }}
              >
                Challenge
              </p>
              <p className="text-[0.94rem] text-[#3D4854] mb-4">{s.challenge}</p>

              <p
                className="uppercase mb-1.5 mt-4"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "var(--color-blue)",
                }}
              >
                HPS Solution
              </p>
              <p className="text-[0.94rem] text-[#3D4854] mb-4">{s.solution}</p>

              <p
                className="uppercase mb-1.5 mt-4"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "var(--color-gold)",
                }}
              >
                Result
              </p>
              <p className="text-[0.94rem] font-semibold text-[#0A2540]">
                {s.result}
              </p>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-[0.85rem] text-[#5A6572] italic">
          Success stories are illustrative placeholders, replaced with real,
          client-approved case studies when available.
        </p>
      </div>
    </section>
  );
}
