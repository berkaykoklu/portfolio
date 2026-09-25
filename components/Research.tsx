"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ResearchNode } from "@/lib/content";

/** A trajectory rather than a skills list: each node exists because of the one
 *  before it, and the last is where the M.Sc. work is aimed. Framed as a
 *  direction, not a result. There are no findings here yet and the copy says
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
                    style={{ background: passed || on ? "var(--color-brand)" : "var(--color-line-lit)" }}
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setI(idx)}
                  className={`press relative whitespace-nowrap rounded-full px-4 py-2.5 text-[0.9rem] ${
                    on ? "font-medium text-white" : passed ? "text-hi hover:bg-black/[0.04]" : "text-mid hover:bg-black/[0.04] hover:text-hi"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="research-pill"
                      className="absolute inset-0 rounded-full bg-brand shadow-[0_8px_20px_-8px_rgb(47_75_255/0.7)]"
                      transition={still ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.18 }}
                    />
                  )}
                  <span className="relative">{n.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bezel mt-5"><div className="bezel-core min-h-[7rem] p-7">
        <motion.div
          key={node.name}
          initial={still ? false : { opacity: 0, filter: "blur(2px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
        >
          <p className="display text-[1.5rem] leading-tight">{node.what}</p>
          <p className="mt-2 max-w-[62ch] text-[1rem] leading-relaxed text-mid">
            {node.why}
          </p>
        </motion.div>
      </div></div>
    </div>
  );
}
