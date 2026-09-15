"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Why hybrid retrieval exists, shown rather than argued: the same query goes
 *  down both arms, each arm fails at what the other is good at, and the fusion
 *  step is what makes the pair worth more than either. Two example queries
 *  alternate so the asymmetry is visible instead of asserted. */
const QUERIES = [
  { text: "where is order 84-5512?", dense: "weak", lexical: "strong", why: "An identifier has no meaning to embed. Lexical search finds it exactly; the vector arm returns other order enquiries." },
  { text: "my package never turned up", dense: "strong", lexical: "weak", why: "No shared keyword with a policy written as “non-delivery”. The vector arm matches the meaning; lexical search returns nothing." },
] as const;

export default function RetrievalDiagram() {
  const [i, setI] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setI((v) => (v + 1) % QUERIES.length), 4200);
    return () => clearInterval(id);
  }, [still]);

  const q = QUERIES[i] ?? QUERIES[0];
  const arm = (s: "strong" | "weak") =>
    s === "strong" ? "var(--color-ok)" : "var(--color-line-ctl)";

  return (
    <div className="rounded-panel border border-line bg-base/60 p-4">
      <div className="diagram-scroll">
        <svg viewBox="0 0 560 168" className="w-full min-w-[460px]" role="img"
             aria-label="A query fans out to dense and lexical search, whose results are fused, reranked and passed to the model.">
          <defs>
            <marker id="rt-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--color-line-ctl)" />
            </marker>
          </defs>

          <rect x="4" y="62" width="112" height="42" rx="7" fill="var(--color-raised)" stroke="var(--color-line)" />
          <text x="60" y="80" textAnchor="middle" fontSize="10.5" fill="var(--color-low)" fontFamily="var(--font-mono)">QUERY</text>
          <motion.text
            key={q.text} x="60" y="94" textAnchor="middle" fontSize="9.5" fill="var(--color-hi)"
            initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}
          >
            {q.text.length > 22 ? q.text.slice(0, 21) + "…" : q.text}
          </motion.text>

          <path d="M116 76 L152 44" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#rt-a)" />
          <path d="M116 90 L152 122" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#rt-a)" />

          <motion.rect x="156" y="24" width="120" height="40" rx="7" fill="var(--color-raised)"
            animate={{ stroke: arm(q.dense) }} transition={{ duration: .4 }} strokeWidth="1.25" />
          <text x="216" y="41" textAnchor="middle" fontSize="11" fill="var(--color-hi)" fontWeight="500">Dense vectors</text>
          <text x="216" y="54" textAnchor="middle" fontSize="9" fill="var(--color-mid)">meaning, paraphrase</text>

          <motion.rect x="156" y="102" width="120" height="40" rx="7" fill="var(--color-raised)"
            animate={{ stroke: arm(q.lexical) }} transition={{ duration: .4 }} strokeWidth="1.25" />
          <text x="216" y="119" textAnchor="middle" fontSize="11" fill="var(--color-hi)" fontWeight="500">Lexical / BM25</text>
          <text x="216" y="132" textAnchor="middle" fontSize="9" fill="var(--color-mid)">identifiers, SKUs</text>

          <path d="M276 44 L312 76" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#rt-a)" />
          <path d="M276 122 L312 90" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#rt-a)" />

          <rect x="316" y="62" width="88" height="42" rx="7" fill="var(--color-lifted)" stroke="var(--color-brand-deep)" />
          <text x="360" y="87" textAnchor="middle" fontSize="11" fill="var(--color-brand)" fontWeight="600">Fusion</text>

          <path d="M404 83 L436 83" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#rt-a)" />
          <rect x="440" y="62" width="112" height="42" rx="7" fill="var(--color-raised)" stroke="var(--color-line)" />
          <text x="496" y="87" textAnchor="middle" fontSize="11" fill="var(--color-hi)" fontWeight="500">To the model</text>
        </svg>
      </div>

      <motion.p
        key={q.why}
        initial={still ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .25 }}
        className="mt-3 min-h-[2.6rem] text-[0.84rem] leading-relaxed text-mid"
      >
        <span className="font-mono text-[0.76rem] text-flow">{q.text}</span> — {q.why}
      </motion.p>
    </div>
  );
}
