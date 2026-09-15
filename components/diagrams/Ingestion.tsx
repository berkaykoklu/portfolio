"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** The pipeline that decides retrieval quality before retrieval runs. Stages
 *  fill in sequence because that is how a document actually moves through it —
 *  nothing is searchable until the last box is written. */
const STAGES = ["Document", "Parse", "Chunk", "Metadata", "Embed", "Vector store"] as const;

export default function IngestionDiagram() {
  const [upto, setUpto] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) { setUpto(STAGES.length - 1); return; }
    const id = setInterval(() => setUpto((v) => (v + 1) % (STAGES.length + 2)), 700);
    return () => clearInterval(id);
  }, [still]);

  return (
    <div className="rounded-panel border border-line bg-base/60 p-4">
      <div className="diagram-scroll">
        <svg viewBox="0 0 560 92" className="w-full min-w-[460px]" role="img"
             aria-label="Documents are parsed, chunked, given metadata, embedded and written to a vector store before anything can be retrieved.">
          {STAGES.map((s, i) => {
            const x = 4 + i * 93;
            const on = i <= upto;
            return (
              <g key={s}>
                <motion.rect
                  x={x} y="26" width="80" height="40" rx="7"
                  fill="var(--color-raised)"
                  animate={{
                    stroke: on ? "var(--color-flow)" : "var(--color-line)",
                    opacity: on ? 1 : 0.5,
                  }}
                  transition={{ duration: .3 }}
                  strokeWidth="1.25"
                />
                <motion.text
                  x={x + 40} y="51" textAnchor="middle" fontSize="10.5"
                  animate={{ fill: on ? "var(--color-hi)" : "var(--color-low)" }}
                  transition={{ duration: .3 }}
                >
                  {s}
                </motion.text>
                {i < STAGES.length - 1 && (
                  <motion.line
                    x1={x + 80} y1="46" x2={x + 91} y2="46"
                    strokeWidth="1"
                    animate={{ stroke: i < upto ? "var(--color-flow)" : "var(--color-line-ctl)" }}
                    transition={{ duration: .3 }}
                  />
                )}
              </g>
            );
          })}
          <text x="280" y="84" textAnchor="middle" fontSize="9.5" fill="var(--color-low)"
                fontFamily="var(--font-mono)">
            structured and unstructured sources, one path
          </text>
        </svg>
      </div>
    </div>
  );
}
