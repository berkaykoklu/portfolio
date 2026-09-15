"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Brain, FileSearch, MessageSquare, Send, ShieldCheck } from "lucide-react";

/** The pipeline described in the case studies below, not a generic diagram.
 *  Each stage carries both what it does and the failure it exists to prevent,
 *  because the second half is what separates having run one of these from
 *  having read about one. */
const STAGES = [
  {
    id: "input",
    name: "Input",
    icon: MessageSquare,
    does: "A question arrives with the tenant it belongs to and the language it was asked in.",
    prevents: "Tenants share one deployment, so isolation is decided here or not at all.",
  },
  {
    id: "retrieval",
    name: "Hybrid retrieval",
    icon: FileSearch,
    does: "Dense vector search runs alongside keyword search and the two result sets are merged.",
    prevents: "Vectors miss exact order numbers and SKUs; keywords miss paraphrase. Customers use both in one sentence.",
  },
  {
    id: "reasoning",
    name: "Generation",
    icon: Brain,
    does: "The model answers from the retrieved passages, with the conversation so far as context.",
    prevents: "Passing everything retrieved invites drift toward material the answer should never cite.",
  },
  {
    id: "guardrail",
    name: "Guardrail",
    icon: ShieldCheck,
    does: "Output is checked for unsafe content and personal data, under limits set per deployment.",
    prevents: "A model that has seen a customer record will repeat it unless something stops it.",
  },
  {
    id: "output",
    name: "Response",
    icon: Send,
    does: "The answer goes back, and the exchange is logged for the evaluation pipeline.",
    prevents: "Without the log there is no way to say whether the last change helped or hurt.",
  },
] as const;

export default function RagPipeline() {
  const [active, setActive] = useState(1);
  const [held, setHeld] = useState(false);
  const still = useReducedMotion();

  // Walks the pipeline on its own until someone takes over, so the first thing
  // a visitor sees is the system running rather than a static picture.
  useEffect(() => {
    if (held || still) return;
    const id = setInterval(() => setActive((i) => (i + 1) % STAGES.length), 2600);
    return () => clearInterval(id);
  }, [held, still]);

  const stage = STAGES[active] ?? STAGES[0];

  return (
    <div
      className="rounded-panel border border-line bg-gradient-to-b from-panel to-base p-5"
      onMouseLeave={() => setHeld(false)}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[0.68rem] tracking-wider text-low">
          RETRIEVAL PIPELINE
        </span>
        <span className="font-mono text-[0.68rem] text-low tnum">
          {String(active + 1).padStart(2, "0")} / {STAGES.length}
        </span>
      </div>

      <ul className="space-y-1">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const on = i === active;
          return (
            <li key={s.id}>
              {i > 0 && (
                <div className="ml-[1.35rem] h-3 w-px bg-line" aria-hidden="true" />
              )}
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => { setActive(i); setHeld(true); }}
                onFocus={() => { setActive(i); setHeld(true); }}
                onClick={() => { setActive(i); setHeld(true); }}
                className={`relative flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-200 ${
                  on
                    ? "border-brand-deep bg-brand/[0.09] text-hi"
                    : "border-transparent text-mid hover:bg-lifted/60 hover:text-hi"
                }`}
              >
                <Icon
                  size={15}
                  className={on ? "text-brand" : "text-low"}
                  aria-hidden="true"
                />
                <span className="text-[0.88rem] font-medium">{s.name}</span>
                {on && !still && (
                  <motion.span
                    layoutId="pipeline-cursor"
                    className="absolute inset-y-0 left-0 w-px bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 min-h-[6.5rem] border-t border-line pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={still ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={still ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[0.88rem] font-medium text-hi">{stage.does}</p>
            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-mid">
              {stage.prevents}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
