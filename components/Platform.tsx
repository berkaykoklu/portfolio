"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** The six parts of one production platform, not six separate skills. Picking
 *  one dims the rest and names what it does, what it runs on, and which case
 *  study below it belongs to — so the map is a route into the work rather than
 *  a list of capabilities. */
const PARTS = [
  { id: "data", name: "Data", col: 0, row: 0, blurb: "Documents arrive structured and unstructured; parsing and chunking decide retrieval quality before retrieval runs.", tech: "Parsing, chunking, MongoDB", to: "Document ingestion" },
  { id: "retrieval", name: "Retrieval", col: 1, row: 0, blurb: "Dense vector search and lexical search run together and are fused, because each fails where the other works.", tech: "Embeddings, vector search, BM25", to: "Hybrid retrieval" },
  { id: "orchestration", name: "Orchestration", col: 2, row: 0, blurb: "Conversation state and the sequence of calls that answer one question.", tech: "Python, FastAPI", to: "Production pipelines" },
  { id: "llm", name: "Generation", col: 0, row: 1, blurb: "The model answers from retrieved passages and the conversation so far — not from everything available.", tech: "LLM APIs, prompt design", to: "Production pipelines" },
  { id: "guardrails", name: "Guardrails", col: 1, row: 1, blurb: "Unsafe content and personal data are caught on the output path, under limits set per deployment.", tech: "Moderation, PII detection", to: "Safety and PII" },
  { id: "evaluation", name: "Evaluation", col: 2, row: 1, blurb: "Measurement and feedback loops, so a change to a prompt or a retriever is judged rather than guessed.", tech: "Eval pipelines, feedback loops", to: "Evaluation" },
] as const;

export default function Platform() {
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
                {active.tech} · see “{active.to}” below
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[0.92rem] text-mid"
            >
              Six parts of one platform. Pick one.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
