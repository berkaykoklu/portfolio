"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ResearchNode } from "@/lib/content";

/** A trajectory rather than a skills list: each node exists because of the one
 *  before it, and the last is where the M.Sc. work is aimed. Framed as a
 *  direction, not a result — there are no findings here yet and the copy says
 *  so. */

export default function Research({ nodes: NODES }: { nodes: ResearchNode[] }) {
  const [i, setI] = useState(3);
  const still = useReducedMotion();
  const node = NODES[i] ?? NODES[0]!;

  return (
    <div>
      <div className="diagram-scroll -mx-1 px-1 pb-2">
        <div className="flex min-w-max items-center gap-1.5">
          {NODES.map((n, idx) => {
            const on = idx === i;
            const passed = idx < i;
            return (
              <div key={n.name} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <span
                    className="h-px w-5 shrink-0"
                    style={{ background: passed || on ? "var(--color-brand)" : "var(--color-line-ctl)" }}
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setI(idx)}
                  onMouseEnter={() => setI(idx)}
                  className={`whitespace-nowrap rounded-lg border px-3 py-2 text-[0.82rem] transition-colors duration-200 ${
                    on
                      ? "border-brand-deep bg-brand/[0.1] font-medium text-hi"
                      : passed
                        ? "border-line/70 bg-panel/70 text-mid"
                        : "border-line/70 bg-panel/70 text-low hover:text-mid"
                  }`}
                >
                  {n.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lift mt-4 min-h-[6rem] rounded-[14px] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={node.name}
            initial={still ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={still ? undefined : { opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
          >
            <p className="text-[0.95rem] font-medium text-hi">{node.what}</p>
            <p className="mt-1.5 max-w-[62ch] text-[0.88rem] leading-relaxed text-mid">
              {node.why}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
