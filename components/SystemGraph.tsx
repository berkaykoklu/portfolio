"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** The hero's living system: the retrieval path the work below describes,
 *  running. A packet moves through it continuously so the first thing on
 *  screen is a system in motion rather than a diagram of one; hovering takes
 *  control and holds a stage open. */
const NODES = [
  { id: "user", name: "User", detail: "A question arrives, with the tenant and language it came in." },
  { id: "intent", name: "Intent", detail: "What is being asked, and whether retrieval is needed at all." },
  { id: "retrieval", name: "Retrieval", detail: "Dense and lexical search run together; results are fused." },
  { id: "llm", name: "Generation", detail: "The model answers from retrieved passages, nothing else." },
  { id: "guardrail", name: "Guardrail", detail: "Unsafe content and personal data are caught before anyone sees them." },
  { id: "response", name: "Response", detail: "The answer returns, and the exchange is logged for evaluation." },
] as const;

const STEP = 78;
const TOP = 26;

export default function SystemGraph() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const still = useReducedMotion();

  useEffect(() => {
    if (held || still) return;
    const id = setInterval(() => setActive((i) => (i + 1) % NODES.length), 1900);
    return () => clearInterval(id);
  }, [held, still]);

  const node = NODES[active] ?? NODES[0];
  const height = TOP + (NODES.length - 1) * STEP + 40;

  return (
    <div
      className="rounded-panel border border-line bg-gradient-to-b from-panel to-base p-5"
      onMouseLeave={() => setHeld(false)}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <span className="label">PRODUCTION PATH</span>
        <span className="label tnum">
          {String(active + 1).padStart(2, "0")}/{NODES.length}
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 240 ${height}`}
          className="w-full"
          role="img"
          aria-label="A request moving through intent detection, retrieval, generation and a guardrail before a response is returned."
        >
          {/* spine */}
          <line
            x1="22" y1={TOP} x2="22" y2={TOP + (NODES.length - 1) * STEP}
            stroke="var(--color-line-lit)" strokeWidth="1"
          />

          {/* the travelled portion lights up behind the packet */}
          <motion.line
            x1="22" y1={TOP} x2="22"
            stroke="var(--color-flow)" strokeWidth="1.5" strokeLinecap="round"
            animate={{ y2: TOP + active * STEP }}
            transition={still ? { duration: 0 } : { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          />

          {NODES.map((n, i) => {
            const y = TOP + i * STEP;
            const on = i === active;
            const done = i < active;
            return (
              <g key={n.id}>
                {on && !still && (
                  <motion.circle
                    cx="22" cy={y} r="4"
                    fill="var(--color-flow)" opacity="0.28"
                    animate={{ r: [4, 13], opacity: [0.32, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx="22" cy={y} r={on ? 4.5 : 3}
                  fill={on ? "var(--color-flow)" : done ? "var(--color-brand)" : "var(--color-base)"}
                  stroke={on || done ? "none" : "var(--color-line-ctl)"}
                  strokeWidth="1.25"
                  style={{ transition: "r .2s" }}
                />
                <text
                  x="40" y={y + 4}
                  fontSize="12.5"
                  fill={on ? "var(--color-hi)" : "var(--color-mid)"}
                  fontFamily="var(--font-sans)"
                  fontWeight={on ? 600 : 400}
                  style={{ transition: "fill .2s" }}
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hit areas sit above the drawing so each stage is hoverable and
            reachable by keyboard without duplicating the geometry. */}
        <div className="absolute inset-0 flex flex-col">
          {NODES.map((n, i) => (
            <button
              key={n.id}
              type="button"
              aria-label={n.name}
              aria-pressed={i === active}
              onMouseEnter={() => { setActive(i); setHeld(true); }}
              onFocus={() => { setActive(i); setHeld(true); }}
              onClick={() => { setActive(i); setHeld(true); }}
              className="flex-1 rounded focus-visible:outline-2"
            />
          ))}
        </div>
      </div>

      <div className="mt-3 min-h-[3.2rem] border-t border-line pt-3">
        <motion.p
          key={node.id}
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="text-[0.85rem] leading-relaxed text-mid"
        >
          {node.detail}
        </motion.p>
      </div>
    </div>
  );
}
