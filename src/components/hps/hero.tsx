"use client";

import { useSyncExternalStore } from "react";
import { HPS_CONTACT } from "@/lib/hps-data";

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

// The three tagline lines — each appears as a "bubble", one after the other.
const LINES = [
  { text: "Building Businesses,", gold: false },
  { text: "Creating Opportunities &", gold: true },
  { text: "Sustaining Success.", gold: false },
];

export function Hero() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    getReducedServerSnapshot
  );

  return (
    <header
      id="top"
      className="relative overflow-hidden pt-[150px] pb-[90px] sm:pt-[180px] sm:pb-[110px]"
      style={{
        // Restored to the original clean white background with the subtle
        // blue (top-right) + gold (bottom-left) radial glows. No solid blue.
        background:
          "radial-gradient(900px 500px at 82% -10%, rgba(0,87,184,0.08), transparent 60%), radial-gradient(700px 460px at -10% 110%, rgba(212,175,55,0.06), transparent 60%), #FFFFFF",
      }}
    >
      <div className="hero-grid-bg" aria-hidden />

      {/* Single floating gold orb accent behind the headline — gentle drift.
          (Blue orb removed — top-right stays white as before.) */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "26%",
          left: "-6%",
          width: "min(520px, 70vw)",
          height: "min(520px, 70vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.34) 0%, rgba(212,175,55,0.12) 40%, transparent 68%)",
          filter: "blur(18px)",
          animation: reduced
            ? "none"
            : "hpsFloat 9s ease-in-out infinite",
        }}
      />

      <div className="hps-wrap relative z-[2]">
        <div className="max-w-[820px]">
          {/* Eyebrow */}
          <div
            className="relative inline-flex overflow-hidden"
            style={{
              animation: reduced ? "none" : "hpsFadeUp 0.6s ease both",
            }}
          >
            <div className="hps-eyebrow relative">
              Business Growth &amp; Enterprise Solutions
              {!reduced && (
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)",
                    animation: "hpsSweep 3.5s ease-in-out 1.2s infinite",
                  }}
                />
              )}
            </div>
          </div>

          {/* Headline — 3-line tagline with corporate bubble motion.
              Each full line pops into view as a "bubble" (scale + fade +
              settle) one after the other. After appearing, each line gently
              floats in place to keep the hero feeling alive. */}
          <h1 className="relative text-[clamp(2.5rem,5.6vw,4.3rem)] font-extrabold my-0 mb-6">
            {LINES.map((line, i) => {
              const enterDelay = reduced ? 0 : 0.3 + i * 0.5;
              const floatDelay = reduced ? 0 : 2.2 + i * 0.4;
              const floatDur = 7 + i * 0.6;
              return (
                <span
                  key={line.text}
                  className="block"
                  style={{
                    // Entrance: bubble pop (scale up from small + fade in + settle)
                    animation: reduced
                      ? "none"
                      : `hpsBubble 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${enterDelay}s both`,
                  }}
                >
                  <span
                    className="inline-block origin-bottom"
                    style={{
                      // Gentle continuous floating after entrance (staggered)
                      animation: reduced
                        ? "none"
                        : `hpsBob ${floatDur}s ease-in-out ${floatDelay}s infinite`,
                    }}
                  >
                    {line.gold ? (
                      <span className="gold-text">{line.text}</span>
                    ) : (
                      line.text
                    )}
                  </span>
                </span>
              );
            })}
          </h1>

          <p
            className="text-[1.05rem] sm:text-[1.14rem] text-[var(--color-steel)] max-w-[620px] mb-9"
            style={{
              animation: reduced
                ? "none"
                : "hpsFadeUp 0.8s ease 2.2s both",
            }}
          >
            Hi&apos;ported Professional Services helps entrepreneurs, SMEs, NGOs,
            churches, schools and corporations build sustainable businesses,
            through accounting, audit, business registration, automation, and
            strategic advisory.
          </p>

          <div
            className="flex flex-wrap gap-4"
            style={{
              animation: reduced
                ? "none"
                : "hpsFadeUp 0.8s ease 2.45s both",
            }}
          >
            <a href="#contact" className="btn-gold">
              Book a Free Consultation
            </a>
            <a href="#solutions" className="btn-ghost">
              Explore Our Solutions
            </a>
          </div>
        </div>
      </div>

      <span
        className="absolute right-6 bottom-6 z-[2] hidden sm:block"
        style={{
          fontFamily: "var(--font-ibm-plex-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.14em",
          color: "rgba(90,101,114,0.6)",
          animation: reduced ? "none" : "hpsFadeUp 0.8s ease 2.7s both",
        }}
      >
        RC: {HPS_CONTACT.bn} · GARKI ABUJA-NIGERIA
      </span>

      <style>{`
        /* Corporate bubble entrance — subtle pop with gentle settle */
        @keyframes hpsBubble {
          0%   { opacity: 0; transform: translateY(0.35em) scale(0.82); }
          60%  { opacity: 1; transform: translateY(-0.03em) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Gentle continuous bob — small travel, slow cycle, no rotation */
        @keyframes hpsBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes hpsFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hpsSweep {
          0%   { transform: translateX(-120%); }
          45%  { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes hpsFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(20px, -24px) scale(1.06); }
        }
      `}</style>
    </header>
  );
}
