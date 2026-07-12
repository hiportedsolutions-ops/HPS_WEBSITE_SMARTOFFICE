"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  style?: CSSProperties;
}

/**
 * Reveal — applies a fade+translate-in animation when the element scrolls
 * into view. Replaces the IntersectionObserver logic from the original
 * static site's js/main.js. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  as,
  delay = 0,
  style,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // For prefers-reduced-motion, the CSS rule under that media query already
    // forces .reveal to be visible — so we can skip the observer entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mergedStyle: CSSProperties = {
    ...(delay ? { transitionDelay: `${delay}ms` } : null),
    ...style,
  };

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", shown && "in", className)}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
