"use client";

import { useState } from "react";
import { Check, Plus, Minus, MessageCircle } from "lucide-react";
import {
  CAC_CHECKLISTS,
  CAC_FAQS,
  CAC_PACKAGES,
  CAC_STEPS,
  HPS_CONTACT,
} from "@/lib/hps-data";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function CACSection() {
  return (
    <section id="cac" className="py-20 sm:py-24 scroll-mt-20">
      <div className="hps-wrap">
        {/* Heading */}
        <Reveal className="max-w-[760px] mb-12">
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: "rgba(147,161,176,0.6)",
              textTransform: "uppercase",
            }}
          >
            <a href="#top" className="hover:text-[var(--color-gold-bright)]">
              HOME
            </a>{" "}
            / CAC REGISTRATIONS
          </p>
          <h1 className="text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold mb-4 max-w-[760px]">
            Register your business with CAC —{" "}
            <span className="gold-text">properly, and without stress.</span>
          </h1>
          <p className="text-[var(--color-steel)] text-[1.08rem] max-w-[640px] mb-8">
            From name search to certificate, HPS handles the entire Corporate
            Affairs Commission process. You focus on the business; we handle the
            paperwork, follow-up and compliance.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-gold">
              Start My Registration
            </a>
            <a
              href={`${HPS_CONTACT.whatsapp}?text=${encodeURIComponent(
                "Hello HPS, I want to register my business with CAC."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa"
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>

        {/* Packages */}
        <Reveal className="max-w-[680px] mb-12">
          <div className="hps-eyebrow">Registration Packages</div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
            Choose the structure that fits your business
          </h2>
          <p className="text-[var(--color-steel)] text-[1.06rem]">
            Not sure which one you need? Send us a WhatsApp message and we&apos;ll
            advise you free of charge before you pay anything.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {CAC_PACKAGES.map((p, i) => (
            <Reveal
              key={p.name}
              delay={(i % 3) * 80}
              className={cn(
                "border p-8 sm:p-9 flex flex-col relative",
                p.featured &&
                  "border-[var(--color-gold)]"
              )}
              style={{
                background: p.featured
                  ? "linear-gradient(180deg,rgba(201,161,59,0.07),var(--color-slate-hps) 45%)"
                  : "var(--color-slate-hps)",
                borderColor: p.featured
                  ? "var(--color-gold)"
                  : "rgba(138,151,165,0.18)",
              }}
            >
              {p.featured && (
                <span
                  className="absolute top-0 right-0 px-3 py-1.5"
                  style={{
                    background: "linear-gradient(120deg,#B08A2E,#E0B64C)",
                    color: "#12181F",
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: "0.66rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-[1.25rem] font-extrabold mb-1.5">{p.name}</h3>
              <p className="text-[0.88rem] text-[var(--color-steel)] mb-5">
                {p.who}
              </p>
              <ul className="mb-7 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 py-2.5 border-b text-[0.92rem] text-[#C9D0D7]"
                    style={{ borderColor: "rgba(138,151,165,0.18)" }}
                  >
                    <Check
                      className="size-4 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--color-gold)" }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={
                  p.featured
                    ? "btn-gold text-center"
                    : "btn-ghost text-center"
                }
                data-service={p.serviceParam}
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(
                    new CustomEvent("hps:selectService", {
                      detail: p.serviceParam,
                    })
                  );
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Request a Quote
              </a>
            </Reveal>
          ))}
        </div>
        <p className="text-[0.9rem] text-[var(--color-steel)]">
          Also available:{" "}
          <strong style={{ color: "var(--color-gold-bright)" }}>
            Annual Returns Filing · Change of Directors · Increase in Share
            Capital · Change of Company Name/Address · Certified True Copies ·
            UK &amp; US Company Registration.
          </strong>
        </p>

        {/* Steps */}
        <Reveal className="mt-20">
          <div className="max-w-[680px] mb-12">
            <div className="hps-eyebrow">How It Works</div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
              Six steps from idea to certificate
            </h2>
          </div>
          <div
            className="border-l pl-0"
            style={{ borderColor: "rgba(201,161,59,0.22)" }}
          >
            {CAC_STEPS.map((s, i) => (
              <div
                key={s.title}
                className="relative pl-16 sm:pl-[66px] py-5 border-b last:border-b-0"
                style={{ borderColor: "rgba(138,151,165,0.18)" }}
              >
                <span
                  className="absolute left-5 top-6"
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: "0.78rem",
                    color: "var(--color-gold)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong
                  className="block text-[1.05rem] mb-1"
                  style={{ fontFamily: "var(--font-archivo)" }}
                >
                  {s.title}
                </strong>
                <p className="text-[0.92rem] text-[var(--color-steel)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Checklists */}
        <div className="mt-20 section-paper -mx-6 px-6 py-20 sm:py-24">
          <div className="hps-wrap max-w-[1180px]">
            <Reveal className="max-w-[680px] mb-12">
              <div className="hps-eyebrow">What You&apos;ll Need</div>
              <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
                Required information &amp; documents
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {CAC_CHECKLISTS.map((c, i) => (
                <Reveal
                  key={c.title}
                  delay={(i % 2) * 100}
                  className="border bg-white p-7 sm:p-8"
                  style={{ borderColor: "rgba(26,34,43,0.15)" }}
                >
                  <h3 className="text-[1.05rem] font-bold mb-4">{c.title}</h3>
                  <ul>
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className="flex gap-2.5 py-2 text-[0.94rem] text-[#3D4854] border-b last:border-b-0"
                        style={{ borderColor: "rgba(26,34,43,0.08)" }}
                      >
                        <span
                          className="text-[0.6rem] mt-[7px] flex-shrink-0"
                          style={{ color: "#9A7A25" }}
                        >
                          ◆
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <Reveal className="max-w-[680px] mb-12">
            <div className="hps-eyebrow">Common Questions</div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold mb-4">
              CAC registration, answered
            </h2>
          </Reveal>
          <Reveal>
            <div
              className="border"
              style={{ borderColor: "rgba(138,151,165,0.18)" }}
            >
              {CAC_FAQS.map((f, i) => (
                <FaqItem
                  key={i}
                  q={f.q}
                  a={f.a}
                  isLast={i === CAC_FAQS.length - 1}
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* CTA strip */}
        <Reveal className="mt-20 text-center">
          <div className="hps-eyebrow hps-eyebrow-center">Start Today</div>
          <h2 className="text-[clamp(2rem,4.2vw,3rem)] font-extrabold mb-4">
            Your business, <span className="gold-text">legally established.</span>
          </h2>
          <p className="text-[var(--color-steel)] max-w-[520px] mx-auto mb-9">
            Send us your two preferred names and we&apos;ll run the search — the
            first step is free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-gold">
              Start My Registration
            </a>
            <a
              href={`${HPS_CONTACT.whatsapp}?text=${encodeURIComponent(
                "Hello HPS, please run a CAC name search for me."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa"
            >
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  isLast,
}: {
  q: string;
  a: string;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(!isLast && "border-b")}
      style={{
        borderColor: "rgba(138,151,165,0.18)",
        background: "var(--color-slate-hps)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
      >
        <span
          className="font-semibold text-[1rem]"
          style={{ fontFamily: "var(--font-archivo)" }}
        >
          {q}
        </span>
        <span style={{ color: "var(--color-gold)" }} aria-hidden>
          {open ? (
            <Minus className="size-5" />
          ) : (
            <Plus className="size-5" />
          )}
        </span>
      </button>
      <div
        className="grid transition-all duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <p className="overflow-hidden px-5 sm:px-6 pb-5 sm:pb-6 text-[0.94rem] text-[var(--color-steel)]">
          {a}
        </p>
      </div>
    </div>
  );
}
