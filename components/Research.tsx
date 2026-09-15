"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** A trajectory rather than a skills list: each node exists because of the one
 *  before it, and the last is where the M.Sc. work is aimed. Framed as a
 *  direction, not a result — there are no findings here yet and the copy says
 *  so. */
const NODES = [
  { name: "Generative models", what: "Learning a distribution rather than a single answer.", why: "A model that can sample is a model you can ask for alternatives." },
  { name: "Diffusion", what: "Sampling by denoising, step by step.", why: "The steps are where control can be applied — which is the whole opening." },
  { name: "Time-series", what: "Sequences where order and dynamics carry the signal.", why: "A trajectory is a sequence; the structure has to survive generation." },
  { name: "World models", what: "A learned simulator to plan inside.", why: "If the simulator is good enough, planning no longer needs the real environment." },
  { name: "Offline RL", what: "Policies learned from logged data, without acting to explore.", why: "Exactly the setting where acting to learn is expensive or unsafe." },
  { name: "Sequential decisions", what: "Choosing under uncertainty, over time.", why: "The point of all of it." },
] as const;

export default function Research() {
  const [i, setI] = useState(3);
  const still = useReducedMotion();
  const node = NODES[i] ?? NODES[0];

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
                        ? "border-line bg-panel text-mid"
                        : "border-line bg-panel text-low hover:text-mid"
                  }`}
                >
                  {n.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 min-h-[6rem] rounded-panel border border-line bg-base/60 p-4">
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
