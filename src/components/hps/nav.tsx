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
        background: scrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: scrolled
          ? "rgba(0, 87, 184, 0.18)"
          : "#E2E8F0",
      }}
    >
      <div className="hps-wrap flex h-[70px] items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="HPS home">
          <span className="hps-logo-mark">HPS</span>
          <span
            className="font-extrabold tracking-tight text-base sm:text-lg"
            style={{ fontFamily: "var(--font-archivo)", color: "#0A2540" }}
          >
            HI&apos;PORTED
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#3D4854] transition-colors hover:text-[var(--color-blue)]"
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
            borderColor: "#E2E8F0",
            color: "var(--color-blue)",
            fontFamily: "var(--font-ibm-plex-mono)",
            background: "#FFFFFF",
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
          background: "#FFFFFF",
          borderColor: "#E2E8F0",
        }}
      >
        <div className="hps-wrap flex flex-col gap-1 py-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-[#3D4854] hover:text-[var(--color-blue)] transition-colors border-b border-[#EEF2F7] last:border-0"
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
