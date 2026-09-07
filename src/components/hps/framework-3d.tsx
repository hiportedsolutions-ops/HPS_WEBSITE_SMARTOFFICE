"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { FRAMEWORK_STEPS } from "@/lib/hps-data";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

// Node center positions (as % of the square image), derived from the actual
// pixel coordinates of each node in hps-framework-5d.webp.
// Each hotspot is ~19% of the container; positions below are the CENTER.
const NODE_CENTERS = [
  { x: 50.0, y: 14.4 }, // 1 Discover — top
  { x: 68.6, y: 27.5 }, // 2 Design — upper right
  { x: 68.6, y: 72.6 }, // 3 Deploy — lower right
  { x: 31.5, y: 72.6 }, // 4 Develop — lower left
  { x: 31.5, y: 27.5 }, // 5 Dominate — upper left
];
const HOTSPOT_SIZE = 19; // % of container width/height

// prefers-reduced-motion subscription (React-recommended pattern)
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
}
function getReducedSnapshot() {
  return window.matchMedia(REDUCED_MQ).matches;
}
function getReducedServerSnapshot() {
  return false;
}

export function Framework() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    getReducedServerSnapshot
  );
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Pause rotation when hovered or when a node is active
  const shouldSpin = !reduced && active === null && !hovered;

  const activeStep = active !== null ? FRAMEWORK_STEPS[active] : null;

  return (
    <section
      id="framework"
      className="py-20 sm:py-24 overflow-hidden"
    >
      <div className="hps-wrap">
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">The HPS Method</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            Our Business Growth Framework
          </h2>
          <p className="text-[var(--color-steel)] text-[1.06rem]">
            Five interconnected principles, one outcome: a business built to
            last. Click any principle to see how it works.
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* ---------- 3D revolving diagram ---------- */}
            <div
              className="flex-shrink-0 relative"
              style={{
                width: "min(600px, 92vw)",
                aspectRatio: "1 / 1",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* Rotating ring — holds the image + hotspots, spins together.
                  Only the 5 nodes + rods revolve; the center is covered by a
                  static hub overlay (below) so the "D" stays still. */}
              <div
                ref={ringRef}
                className="absolute inset-0"
                style={{
                  animation: shouldSpin
                    ? "hpsSpin 70s linear infinite"
                    : "none",
                  transition: "animation 0.4s",
                }}
              >
                {/* The exact reference image (transparent background).
                    No border-radius — the transparent bg blends with the
                    section's white background. drop-shadow follows the alpha
                    channel, giving depth to the diagram shape. */}
                <img
                  src="/hps-framework-5d.webp"
                  alt="The 5D Business Growth Framework: five principles — Discover, Design, Deploy, Develop, and Dominate — revolving around the central D Principle."
                  width={800}
                  height={800}
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  style={{
                    filter: "drop-shadow(0 12px 32px rgba(0,87,184,0.15))",
                  }}
                  draggable={false}
                />

                {/* 5 interactive hotspot buttons, positioned over each node.
                    They rotate WITH the image (children of the spinning ring)
                    so they always stay aligned with their node. */}
                {FRAMEWORK_STEPS.map((step, i) => {
                  const c = NODE_CENTERS[i];
                  const isActive = active === i;
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() =>
                        setActive((cur) => (cur === i ? null : i))
                      }
                      aria-pressed={isActive}
                      aria-label={`${step.title} principle — click to see how it works`}
                      className="absolute rounded-full focus-visible:outline-none group"
                      style={{
                        width: `${HOTSPOT_SIZE}%`,
                        height: `${HOTSPOT_SIZE}%`,
                        left: `${c.x - HOTSPOT_SIZE / 2}%`,
                        top: `${c.y - HOTSPOT_SIZE / 2}%`,
                        background: isActive
                          ? "radial-gradient(circle, rgba(0,87,184,0.35) 0%, rgba(0,87,184,0.12) 60%, transparent 100%)"
                          : "transparent",
                        border: isActive
                          ? "3px solid rgba(212,175,55,0.95)"
                          : "3px solid transparent",
                        boxShadow: isActive
                          ? "0 0 24px 4px rgba(212,175,55,0.45)"
                          : "none",
                        transition:
                          "background 0.25s, border-color 0.25s, box-shadow 0.25s",
                        cursor: "pointer",
                      }}
                    >
                      {/* Hover ring (visible on mouse hover) */}
                      <span
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                          border: "3px solid rgba(212,175,55,0.7)",
                          background:
                            "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
                        }}
                      />
                      {/* Focus-visible ring for keyboard nav */}
                      <span
                        className="absolute inset-0 rounded-full pointer-events-none focus-visible:ring-4 focus-visible:ring-[var(--color-blue)] focus-visible:ring-offset-2"
                        style={{ outline: "none" }}
                      />
                      {/* Screen-reader text */}
                      <span className="sr-only">
                        {step.title}: {step.short}
                      </span>
                      {/* Pulsing hint dot when idle (invites interaction) */}
                      {!isActive && !reduced && (
                        <span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full pointer-events-none"
                          style={{
                            background: "#D4AF37",
                            animation:
                              "hpsPulse 2.4s ease-in-out infinite",
                            animationDelay: `${i * 0.3}s`,
                          }}
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Static central hub — stays still while the ring rotates
                  around it. Sits on top (z-10) covering the image's own
                  rotating center so the "D" never moves. Clicking resets. */}
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="The 5D Principle — click to reset selection"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2"
                style={{
                  width: "32%",
                  height: "32%",
                  background:
                    "radial-gradient(circle at 35% 30%, #0A4A9E 0%, #0057B8 45%, #0A2540 100%)",
                  border: "4px solid #D4AF37",
                  boxShadow:
                    "0 12px 40px -8px rgba(0,87,184,0.45), inset 0 2px 8px rgba(255,255,255,0.15), 0 0 0 4px rgba(212,175,55,0.18)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <span className="flex flex-col items-center text-center px-2">
                  <span
                    className="font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-archivo)",
                      fontSize: "clamp(2rem, 6vw, 3.2rem)",
                      background:
                        "linear-gradient(135deg,#E6C466 0%,#F0D980 40%,#D4AF37 70%,#9A7A25 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      lineHeight: 1,
                    }}
                  >
                    D
                  </span>
                  <span
                    className="mt-1 text-white font-semibold tracking-[0.12em] uppercase"
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono)",
                      fontSize: "clamp(0.48rem, 1.2vw, 0.62rem)",
                    }}
                  >
                    The 5D
                    <br />
                    Principle
                  </span>
                </span>
              </button>
            </div>

            {/* ---------- Detail panel ---------- */}
            <div className="flex-1 w-full lg:w-auto min-w-0">
              {activeStep ? (
                <div
                  className="border rounded-xl p-7 sm:p-8 transition-all"
                  style={{
                    borderColor: "rgba(0,87,184,0.3)",
                    background:
                      "linear-gradient(180deg,rgba(0,87,184,0.05),#FFFFFF 60%)",
                    boxShadow: "0 12px 40px -16px rgba(0,87,184,0.25)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="grid place-items-center size-12 rounded-full font-extrabold text-white flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg,#0057B8,#0066CC)",
                        border: "3px solid #D4AF37",
                        fontFamily: "var(--font-archivo)",
                        fontSize: "1.25rem",
                      }}
                    >
                      {activeStep.num}
                    </span>
                    <div>
                      <div
                        className="text-[0.72rem] uppercase tracking-[0.16em]"
                        style={{
                          fontFamily: "var(--font-ibm-plex-mono)",
                          color: "var(--color-blue)",
                        }}
                      >
                        {activeStep.n}
                      </div>
                      <h3 className="text-[1.5rem] font-extrabold text-[#0A2540]">
                        {activeStep.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className="h-[2px] w-16 mb-4"
                    style={{
                      background: "linear-gradient(90deg,#B8902E,#E6C466)",
                    }}
                  />
                  <p className="text-[0.95rem] text-[var(--color-steel)] mb-2 font-medium">
                    {activeStep.short}
                  </p>
                  <p className="text-[0.95rem] text-[var(--color-steel)] mb-5">
                    {activeStep.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="text-[0.82rem] font-semibold text-[var(--color-blue)] hover:underline cursor-pointer"
                    style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                  >
                    ← CLOSE
                  </button>
                </div>
              ) : (
                <div
                  className="border rounded-xl p-7 sm:p-8 text-center"
                  style={{
                    borderColor: "#E2E8F0",
                    background: "#FFFFFF",
                  }}
                >
                  <div
                    className="mx-auto mb-4 grid place-items-center size-14 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(0,87,184,0.08),rgba(212,175,55,0.08))",
                      border: "1px solid rgba(0,87,184,0.15)",
                    }}
                  >
                    <span
                      className="text-[1.6rem] font-extrabold"
                      style={{
                        fontFamily: "var(--font-archivo)",
                        background:
                          "linear-gradient(120deg,#B8902E,#E6C466 55%,#9A7A25)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      D
                    </span>
                  </div>
                  <h3
                    className="text-[1.15rem] font-extrabold mb-2 text-[#0A2540]"
                    style={{ fontFamily: "var(--font-archivo)" }}
                  >
                    The 5D Principle
                  </h3>
                  <p className="text-[0.92rem] text-[var(--color-steel)] mb-4">
                    Tap any of the five orbiting principles to explore how we
                    turn vision into sustainable success.
                  </p>
                  <p
                    className="text-[0.72rem] uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono)",
                      color: "var(--color-steel)",
                    }}
                  >
                    DISCOVER → DESIGN → DEPLOY → DEVELOP → DOMINATE
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes hpsSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hpsPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.4); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hps-spin-ring { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
