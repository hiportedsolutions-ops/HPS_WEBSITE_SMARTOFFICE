"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/hps-data";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors"
      style={{
        background: scrolled ? "rgba(15,21,28,0.92)" : "rgba(15,21,28,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: scrolled
          ? "rgba(201,161,59,0.22)"
          : "rgba(138,151,165,0.18)",
      }}
    >
      <div className="hps-wrap flex h-[70px] items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="HPS home">
          <span className="hps-logo-mark">HPS</span>
          <span
            className="font-extrabold tracking-tight text-base sm:text-lg"
            style={{ fontFamily: "var(--font-archivo)" }}
          >
            HI&apos;PORTED
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#C6CDD4] transition-colors hover:text-[var(--color-gold-bright)]"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-gold !px-5 !py-2.5">
            Book a Consultation
          </a>
        </div>

        <button
          className="lg:hidden inline-flex items-center gap-2 border px-3 py-2 text-xs"
          style={{
            borderColor: "rgba(138,151,165,0.25)",
            fontFamily: "var(--font-ibm-plex-mono)",
          }}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 border-t",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
        style={{
          background: "#10161D",
          borderColor: "rgba(138,151,165,0.18)",
        }}
      >
        <div className="hps-wrap flex flex-col gap-1 py-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-[#C6CDD4] hover:text-[var(--color-gold-bright)] transition-colors border-b border-[rgba(138,151,165,0.1)] last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-gold mt-3 w-full"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </nav>
  );
}
