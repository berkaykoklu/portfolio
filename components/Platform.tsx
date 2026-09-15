"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { PlatformPart } from "@/lib/content";

/** The parts of one production platform, not a list of separate skills. Picking
 *  one dims the rest and names what it does, what it runs on, and which case
 *  study below it belongs to — so the map is a route into the work rather than
 *  a list of capabilities. */

export default function Platform({ parts: PARTS, idle }: { parts: PlatformPart[]; idle: string }) {
  const [sel, setSel] = useState<string | null>(null);
  const still = useReducedMotion();
  const active = PARTS.find((p) => p.id === sel);

  return (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {PARTS.map((p) => {
          const on = sel === p.id;
          const dim = sel !== null && !on;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSel(on ? null : p.id)}
              onMouseEnter={() => setSel(p.id)}
              className={`rounded-[14px] border p-5 text-left transition-all duration-200 ${
                on
                  ? "border-brand-deep bg-brand/[0.08]"
                  : "border-line/70 bg-panel/70 backdrop-blur-sm hover:border-line-lit"
              } ${dim ? "opacity-45" : "opacity-100"}`}
            >
              <span className={`text-[1.05rem] font-semibold ${on ? "text-hi" : "text-mid"}`}>
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="lift mt-4 min-h-[5.5rem] rounded-[14px] p-5">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={still ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
            >
              <p className="max-w-[64ch] text-[0.92rem] leading-relaxed text-hi">{active.blurb}</p>
              <p className="mt-2 font-mono text-[0.75rem] text-low">
                {active.tech} · → “{active.to}”
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[0.92rem] text-mid"
            >
              {idle}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
