"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { scrambleFrame } from "@/lib/motion/scramble";

/** A line that decodes itself once, left to right, like tokens settling.
 *  The final text is what the server renders and what screen readers hear;
 *  the noise is written straight into the DOM, never into React state. */
export default function ScrambleText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    const DURATION = 900;
    let raf = 0;
    let start = 0;
    el.textContent = scrambleFrame(text, 0, 0);
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = (now - start) / DURATION;
      el.textContent = scrambleFrame(text, progress, Math.floor(now / 50));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); el.textContent = text; };
  }, [text, delay, still]);

  return (
    <span className={className} data-role-line>
      <span className="sr-only">{text}</span>
      <span key={text} ref={ref} aria-hidden="true">{text}</span>
    </span>
  );
}
