import { Reveal } from "./reveal";

export function CTA() {
  return (
    <section
      className="py-20 sm:py-24 text-center"
      style={{
        background:
          "radial-gradient(700px 380px at 50% 120%, rgba(212,175,55,0.18), transparent 65%), linear-gradient(135deg, #0057B8 0%, #0A2540 100%)",
        color: "#FFFFFF",
      }}
    >
      <div className="hps-wrap">
        <Reveal>
          <div
            className="mb-[18px]"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#E6C466",
            }}
          >
            From Vision to Sustainable Success
          </div>
          <h2 className="text-[clamp(2rem,4.2vw,3rem)] font-extrabold mb-4 text-white">
            Ready to build{" "}
            <span
              style={{
                background: "linear-gradient(105deg, #B8902E 0%, #E6C466 38%, #F0D980 50%, #C49B2F 65%, #9A7A25 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              your business?
            </span>
          </h2>
          <p className="text-[#C9D6E5] max-w-[520px] mx-auto mb-9">
            Book a consultation with our experts today. Your growth. Our
            expertise.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-[0.95rem] transition-all hover:scale-[1.03]"
            style={{
              fontFamily: "var(--font-archivo)",
              background: "linear-gradient(120deg, #B8902E, #E6C466 55%, #9A7A25)",
              color: "#0A2540",
            }}
          >
            Book a Consultation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
