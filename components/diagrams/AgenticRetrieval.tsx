"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Why a router exists, shown rather than argued. Four questions, each one a
 *  different kind of failure for the other strategies: an identifier the
 *  vector arm cannot embed, a paraphrase with no shared keyword, a multi-hop
 *  question no single chunk contains, and a question that needs no retrieval
 *  at all. The reflection edge only fires where the first pass came back
 *  short, because that is when it should. */
type Route = "vector" | "lexical" | "graph" | "none";

const CASES: {
  q: string;
  route: Route;
  reflect: boolean;
  why: string;
}[] = [
  {
    q: "where is order 84-5512?",
    route: "lexical",
    reflect: false,
    why: "An identifier has nothing to embed. Lexical search finds it exactly; the vector arm returns other order enquiries.",
  },
  {
    q: "my package never turned up",
    route: "vector",
    reflect: false,
    why: "No keyword shared with a policy written as “non-delivery”. The vector arm matches the meaning; lexical search returns nothing.",
  },
  {
    q: "which of my open orders are affected by the İzmir delay?",
    route: "graph",
    reflect: true,
    why: "Two hops — orders to warehouse, warehouse to incident — and no single chunk holds both. Traversing entities answers it; the first flat pass came back short, so the agent re-queried.",
  },
  {
    q: "can you repeat that in English?",
    route: "none",
    reflect: false,
    why: "Everything needed is already in the conversation. Retrieving here would add latency and cost for nothing, so the router skips it.",
  },
];

const ARMS: { id: Route; name: string; sub: string; x: number }[] = [
  { id: "vector", name: "Vector", sub: "meaning", x: 150 },
  { id: "lexical", name: "Lexical", sub: "identifiers", x: 288 },
  { id: "graph", name: "Graph", sub: "entities, hops", x: 426 },
];

export default function AgenticRetrieval() {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const still = useReducedMotion();

  useEffect(() => {
    if (held || still) return;
    const id = setInterval(() => setI((v) => (v + 1) % CASES.length), 4600);
    return () => clearInterval(id);
  }, [held, still]);

  const c = CASES[i] ?? CASES[0]!;
  const lit = (id: Route) => c.route === id;

  return (
    <div className="rounded-[14px] border border-line bg-base/50 p-4" onMouseLeave={() => setHeld(false)}>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CASES.map((x, idx) => (
          <button
            key={x.q}
            type="button"
            aria-pressed={idx === i}
            onMouseEnter={() => { setI(idx); setHeld(true); }}
            onFocus={() => { setI(idx); setHeld(true); }}
            onClick={() => { setI(idx); setHeld(true); }}
            className={`rounded-md border px-2.5 py-1.5 text-left font-mono text-[0.7rem] transition-colors ${
              idx === i
                ? "border-flow/50 bg-flow/10 text-hi"
                : "border-line bg-raised text-low hover:text-mid"
            }`}
          >
            {x.q.length > 30 ? x.q.slice(0, 29) + "…" : x.q}
          </button>
        ))}
      </div>

      <div className="diagram-scroll">
        <svg viewBox="0 0 560 240" className="w-full min-w-[520px]" role="img"
             aria-label="A router chooses between vector, lexical and graph retrieval or skips retrieval entirely; results are fused, checked for sufficiency, and re-queried when they fall short.">
          <defs>
            <marker id="ag-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--color-line-ctl)" />
            </marker>
            <marker id="ag-l" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--color-flow)" />
            </marker>
          </defs>

          {/* router */}
          <rect x="228" y="8" width="120" height="38" rx="8" fill="var(--color-lifted)" stroke="var(--color-flow)" strokeWidth="1.3" />
          <text x="288" y="26" textAnchor="middle" fontSize="11.5" fill="var(--color-hi)" fontWeight="600">Router</text>
          <text x="288" y="39" textAnchor="middle" fontSize="8.5" fill="var(--color-mid)">retrieve? which way?</text>

          {/* fan-out */}
          {ARMS.map((a) => (
            <motion.path
              key={`e-${a.id}`}
              d={`M288 46 L288 62 L${a.x} 62 L${a.x} 80`}
              fill="none" strokeWidth={lit(a.id) ? 1.6 : 1}
              markerEnd={lit(a.id) ? "url(#ag-l)" : "url(#ag-a)"}
              animate={{ stroke: lit(a.id) ? "var(--color-flow)" : "var(--color-line-ctl)", opacity: lit(a.id) ? 1 : 0.45 }}
              transition={{ duration: 0.35 }}
            />
          ))}

          {/* skip-retrieval path */}
          <motion.path
            d="M348 27 L510 27 L510 178"
            fill="none" strokeDasharray="4 3" strokeWidth={lit("none") ? 1.6 : 1}
            markerEnd={lit("none") ? "url(#ag-l)" : "url(#ag-a)"}
            animate={{ stroke: lit("none") ? "var(--color-flow)" : "var(--color-line-ctl)", opacity: lit("none") ? 1 : 0.35 }}
            transition={{ duration: 0.35 }}
          />
          <motion.text
            x="430" y="20" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)"
            animate={{ fill: lit("none") ? "var(--color-flow)" : "var(--color-low)", opacity: lit("none") ? 1 : 0.5 }}
          >
            no retrieval needed
          </motion.text>

          {/* arms */}
          {ARMS.map((a) => (
            <g key={a.id}>
              <motion.rect
                x={a.x - 56} y="80" width="112" height="42" rx="8"
                fill="var(--color-raised)" strokeWidth="1.25"
                animate={{
                  stroke: lit(a.id) ? "var(--color-flow)" : "var(--color-line)",
                  opacity: lit(a.id) ? 1 : 0.5,
                }}
                transition={{ duration: 0.35 }}
              />
              <motion.text x={a.x} y="99" textAnchor="middle" fontSize="11.5" fontWeight="500"
                animate={{ fill: lit(a.id) ? "var(--color-hi)" : "var(--color-mid)", opacity: lit(a.id) ? 1 : 0.6 }}>
                {a.name}
              </motion.text>
              <motion.text x={a.x} y="112" textAnchor="middle" fontSize="8.5"
                animate={{ fill: "var(--color-mid)", opacity: lit(a.id) ? 0.95 : 0.5 }}>
                {a.sub}
              </motion.text>
            </g>
          ))}

          {/* fuse */}
          {ARMS.map((a) => (
            <motion.path
              key={`f-${a.id}`}
              d={`M${a.x} 122 L${a.x} 140 L288 140 L288 152`}
              fill="none" strokeWidth={lit(a.id) ? 1.6 : 1}
              animate={{ stroke: lit(a.id) ? "var(--color-flow)" : "var(--color-line-ctl)", opacity: lit(a.id) ? 1 : 0.28 }}
              transition={{ duration: 0.35 }}
            />
          ))}

          <rect x="232" y="152" width="112" height="36" rx="8" fill="var(--color-raised)" stroke="var(--color-line)" />
          <text x="288" y="174" textAnchor="middle" fontSize="11" fill="var(--color-hi)">Fuse &amp; rank</text>

          {/* sufficiency gate */}
          <motion.rect
            x="232" y="200" width="112" height="34" rx="8" fill="var(--color-lifted)" strokeWidth="1.3"
            animate={{ stroke: c.reflect ? "var(--color-block)" : "var(--color-ok)" }}
            transition={{ duration: 0.35 }}
          />
          <motion.text
            x="288" y="221" textAnchor="middle" fontSize="10.5" fontWeight="600"
            animate={{ fill: c.reflect ? "var(--color-block)" : "var(--color-ok)" }}
          >
            {c.reflect ? "not enough → re-query" : "enough → answer"}
          </motion.text>
          <line x1="288" y1="188" x2="288" y2="200" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#ag-a)" />

          {/* reflection edge back to the router */}
          <motion.path
            d="M232 217 L60 217 L60 27 L228 27"
            fill="none" strokeDasharray="5 4" strokeWidth="1.4"
            markerEnd="url(#ag-l)"
            animate={{ stroke: c.reflect ? "var(--color-block)" : "var(--color-line-ctl)", opacity: c.reflect ? 1 : 0.12 }}
            transition={{ duration: 0.35 }}
          />
          <motion.text
            x="60" y="128" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)"
            transform="rotate(-90 60 128)"
            animate={{ fill: "var(--color-block)", opacity: c.reflect ? 1 : 0.12 }}
          >
            reflect
          </motion.text>

          <rect x="456" y="178" width="100" height="36" rx="8" fill="var(--color-raised)" stroke="var(--color-line)" />
          <text x="506" y="200" textAnchor="middle" fontSize="11" fill="var(--color-hi)">Answer</text>
          <line x1="344" y1="217" x2="440" y2="217" stroke="var(--color-line-ctl)" strokeWidth="1" opacity="0.5" />
          <path d="M440 217 L506 217 L506 214" fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" markerEnd="url(#ag-a)" opacity="0.5" />
        </svg>
      </div>

      <motion.p
        key={c.q}
        initial={still ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-3 min-h-[3.4rem] text-[0.85rem] leading-relaxed text-mid"
      >
        <span className="font-mono text-[0.77rem] text-flow">{c.q}</span> — {c.why}
      </motion.p>
    </div>
  );
}
