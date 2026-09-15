"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export type Bar = {
  name: string;
  value: number;
  tone?: "good" | "bad" | "flag" | "base";
};

const TONE: Record<string, string> = {
  good: "var(--color-ok)",
  bad: "var(--color-block)",
  flag: "var(--color-flag)",
  base: "var(--color-brand)",
};

/** Measured values against the reference they are measured against, on one
 *  scale, with the reference drawn through the bars. A value that fails to
 *  clear it is short of the line rather than a number to compare in your head.
 *  Bars grow once, when the section is first reached. */
export default function Comparison({
  caption,
  scale,
  bars,
  reference,
  unit = "",
  decimals = 0,
}: {
  caption: string;
  scale: number;
  bars: Bar[];
  reference?: { value: number; label: string };
  unit?: string;
  /** Measurements keep a fixed number of places so a column of them lines up
   *  and 2.70 does not render as 2.7 beside 2.23. Counts pass 0. */
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const still = useReducedMotion();

  return (
    <div ref={ref} className="rounded-panel border border-line bg-base/60 p-4">
      <p className="label mb-3">{caption}</p>
      <div className="space-y-2">
        {bars.map((b, i) => (
          <div key={b.name} className="grid grid-cols-[minmax(6.5rem,10rem)_1fr_auto] items-center gap-3 max-[30rem]:grid-cols-[1fr_auto] max-[30rem]:gap-x-2">
            <span className="text-[0.8rem] text-mid max-[30rem]:col-span-2">{b.name}</span>
            <span className="relative h-5 rounded-[3px] bg-raised">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-[3px]"
                style={{ background: TONE[b.tone ?? "base"] }}
                initial={still ? false : { width: 0 }}
                animate={seen ? { width: `${Math.min(100, (b.value / scale) * 100)}%` } : {}}
                transition={{ duration: 0.6, delay: 0.06 * i, ease: [0.22, 0.61, 0.36, 1] }}
              />
              {reference && (
                <span
                  className="absolute -top-1 -bottom-1 w-px bg-brand"
                  style={{ left: `${(reference.value / scale) * 100}%` }}
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="tnum text-right text-[0.85rem] font-semibold tabular-nums">
              {b.value.toFixed(decimals)}{unit}
            </span>
          </div>
        ))}
      </div>
      {reference && (
        <p className="mt-3 text-[0.8rem] text-mid">
          <span className="text-brand">The line is {reference.label}, at {reference.value.toFixed(decimals)}{unit}.</span>
        </p>
      )}
    </div>
  );
}
