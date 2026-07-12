import { Reveal } from "./reveal";

export function CTA() {
  return (
    <section
      className="py-20 sm:py-24 text-center border-t"
      style={{
        background:
          "radial-gradient(700px 380px at 50% 120%, rgba(201,161,59,0.18), transparent 65%), var(--color-slate-hps)",
        borderColor: "rgba(201,161,59,0.22)",
      }}
    >
      <div className="hps-wrap">
        <Reveal>
          <div className="hps-eyebrow hps-eyebrow-center">
            From Vision to Sustainable Success
          </div>
          <h2 className="text-[clamp(2rem,4.2vw,3rem)] font-extrabold mb-4">
            Ready to build <span className="gold-text">your business?</span>
          </h2>
          <p className="text-[var(--color-steel)] max-w-[520px] mx-auto mb-9">
            Book a consultation with our experts today. Your growth. Our
            expertise.
          </p>
          <a href="#contact" className="btn-gold">
            Book a Consultation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
