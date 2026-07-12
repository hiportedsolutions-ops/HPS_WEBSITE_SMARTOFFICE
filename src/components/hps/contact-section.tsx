"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, Loader2, CheckCircle2 } from "lucide-react";
import { HPS_CONTACT, SERVICE_OPTIONS, SERVICE_PARAM_MAP } from "@/lib/hps-data";
import { Reveal } from "./reveal";
import { useToast } from "@/hooks/use-toast";

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("service");
    if (p && SERVICE_PARAM_MAP[p]) {
      setForm((f) => ({ ...f, service: SERVICE_PARAM_MAP[p] }));
    }
    const hash = window.location.hash;
    if (hash.includes("?service=")) {
      const q = hash.split("?")[1];
      const qp = new URLSearchParams(q).get("service");
      if (qp && SERVICE_PARAM_MAP[qp]) {
        setForm((f) => ({ ...f, service: SERVICE_PARAM_MAP[qp] }));
      }
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail && SERVICE_PARAM_MAP[detail]) {
        setForm((f) => ({ ...f, service: SERVICE_PARAM_MAP[detail] }));
      }
    };
    window.addEventListener("hps:selectService", handler as EventListener);
    return () =>
      window.removeEventListener("hps:selectService", handler as EventListener);
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: "Could not send",
          description:
            data?.error ??
            "Please try again, or message us directly on WhatsApp.",
          variant: "destructive",
        });
        return;
      }
      setDone(true);
      setForm(EMPTY);
      toast({
        title: "Message sent",
        description:
          "Thank you for reaching out. We respond within one business day.",
      });
    } catch {
      toast({
        title: "Network error",
        description:
          "Please check your connection and try again, or message us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 scroll-mt-20">
      <div className="hps-wrap">
        <Reveal className="max-w-[760px] mb-12">
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: "rgba(90,101,114,0.7)",
              textTransform: "uppercase",
            }}
          >
            <a href="#top" className="hover:text-[var(--color-blue)]">
              HOME
            </a>{" "}
            / CONTACT
          </p>
          <h1 className="text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold mb-4">
            Let&apos;s talk about <span className="gold-text">your business.</span>
          </h1>
          <p className="text-[var(--color-steel)] text-[1.08rem] max-w-[640px]">
            Book a free consultation — tell us where you are and where you want to
            go, and we&apos;ll recommend a clear path. No obligation.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* Left: contact details */}
          <Reveal>
            <div className="hps-eyebrow">Reach Us Directly</div>
            <ContactItem
              icon={<MapPin className="size-4 mt-1" />}
              title="Office"
              value={HPS_CONTACT.address}
            />
            <ContactItem
              icon={<Phone className="size-4 mt-1" />}
              title="Phone"
              value={
                <>
                  <a
                    href={`tel:${HPS_CONTACT.phoneTels[0]}`}
                    className="hover:text-[var(--color-blue)]"
                  >
                    {HPS_CONTACT.phones[0]}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={`tel:${HPS_CONTACT.phoneTels[1]}`}
                    className="hover:text-[var(--color-blue)]"
                  >
                    {HPS_CONTACT.phones[1]}
                  </a>
                </>
              }
            />
            <ContactItem
              icon={<Mail className="size-4 mt-1" />}
              title="Email"
              value={
                <a
                  href={`mailto:${HPS_CONTACT.email}`}
                  className="hover:text-[var(--color-blue)]"
                >
                  {HPS_CONTACT.email}
                </a>
              }
            />
            <div
              className="flex gap-4 pt-5 pb-5"
              style={{ borderBottom: "1px solid #E2E8F0" }}
            >
              <MessageCircle className="size-4 mt-1" style={{ color: "var(--color-blue)" }} />
              <div>
                <strong
                  className="block text-[0.95rem] mb-0.5 text-[#0A2540]"
                  style={{ fontFamily: "var(--font-archivo)" }}
                >
                  WhatsApp
                </strong>
                <span className="text-[0.94rem] text-[var(--color-steel)]">
                  Fastest response — usually within business hours
                </span>
              </div>
            </div>
            <a
              href={`${HPS_CONTACT.whatsapp}?text=${encodeURIComponent(
                "Hello HPS, I would like to book a free consultation."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-3"
            >
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
            <p
              className="mt-8"
              style={{
                fontFamily: "var(--font-ibm-plex-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                color: "rgba(90,101,114,0.7)",
                lineHeight: 1.8,
              }}
            >
              {HPS_CONTACT.hours.toUpperCase()}
              <br />
              {HPS_CONTACT.bn}
            </p>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              className="border p-8 sm:p-9 rounded-lg"
              style={{
                borderColor: "#E2E8F0",
                background: "#F6F8FB",
              }}
            >
              {done ? (
                <div className="text-center py-10">
                  <CheckCircle2
                    className="size-14 mx-auto mb-4"
                    style={{ color: "var(--color-blue)" }}
                  />
                  <h3 className="text-[1.4rem] font-extrabold mb-2 text-[#0A2540]">
                    Thank you — message received.
                  </h3>
                  <p className="text-[var(--color-steel)] mb-6">
                    We respond within one business day. For anything urgent,
                    WhatsApp us directly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDone(false)}
                      className="btn-ghost"
                    >
                      Send another message
                    </button>
                    <a
                      href={HPS_CONTACT.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wa"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Full Name" htmlFor="name">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={onChange}
                      className="w-full px-4 py-3 text-[0.95rem] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={onChange}
                      className="w-full px-4 py-3 text-[0.95rem] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Phone / WhatsApp" htmlFor="phone">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      autoComplete="tel"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full px-4 py-3 text-[0.95rem] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                      style={inputStyle}
                    />
                  </Field>
                  <Field
                    label="What do you need help with?"
                    htmlFor="service"
                  >
                    <select
                      id="service-select"
                      name="service"
                      required
                      value={form.service}
                      onChange={onChange}
                      className="w-full px-4 py-3 text-[0.95rem] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                      style={inputStyle}
                    >
                      <option value="">Select a service…</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Tell us briefly about your business or goal"
                    htmlFor="message"
                  >
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={onChange}
                      className="w-full px-4 py-3 text-[0.95rem] rounded-md resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]"
                      style={inputStyle}
                    />
                  </Field>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-[0.82rem] text-[var(--color-steel)]">
                    We respond within one business day. Your details are never
                    shared.
                  </p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  color: "#1A222B",
  fontFamily: "var(--font-public-sans)",
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={htmlFor}
        className="block mb-2"
        style={{
          fontFamily: "var(--font-ibm-plex-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-steel)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="flex gap-4 py-5"
      style={{ borderBottom: "1px solid #E2E8F0" }}
    >
      <span style={{ color: "var(--color-blue)" }}>{icon}</span>
      <div>
        <strong
          className="block text-[0.95rem] mb-0.5 text-[#0A2540]"
          style={{ fontFamily: "var(--font-archivo)" }}
        >
          {title}
        </strong>
        <span className="text-[0.94rem] text-[var(--color-steel)]">{value}</span>
      </div>
    </div>
  );
}
