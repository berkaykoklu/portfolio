"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

/** The case flat retrieval cannot win. The answer needs three facts that live
 *  in three different documents, so no chunk contains it and similarity to the
 *  question does not surface the chain. First the flat search is shown coming
 *  back with loose chunks; then traversal walks the chain hop by hop, and the
 *  answer assembles only once the last edge is crossed. */
const NODES = [
  { id: "cust", label: "Customer", doc: "CRM record", x: 70, y: 150 },
  { id: "order", label: "Order 84-5512", doc: "orders table", x: 210, y: 70 },
  { id: "wh", label: "İzmir warehouse", doc: "fulfilment doc", x: 350, y: 150 },
  { id: "inc", label: "Delay incident", doc: "ops incident log", x: 490, y: 70 },
];

const EDGES = [
  { label: "placed" },
  { label: "ships from" },
  { label: "affected by" },
];

// Curved edges read as relations rather than wiring.
const edgePath = (a: (typeof NODES)[number], b: (typeof NODES)[number]) => {
  const mx = (a.x + b.x) / 2;
  const my = Math.min(a.y, b.y) - 18;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
};

const HOP_MS = 1300;
const FLAT_MS = 2200;
const HOLD_MS = 3600;

export default function GraphHop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const still = useReducedMotion();
  // -1: flat retrieval shown; 0: start node; 1-3: hops crossed.
  const [hop, setHop] = useState(-1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (still) { setHop(3); return; }
    if (!inView || paused) return;
    const wait = hop === -1 ? FLAT_MS : hop < 3 ? HOP_MS : HOLD_MS;
    const t = setTimeout(() => setHop(hop < 3 ? hop + 1 : -1), wait);
    return () => clearTimeout(t);
  }, [hop, inView, still, paused]);

  const answered = hop >= 3;

  return (
    <div ref={ref} className="bezel">
      <div className="screen overflow-hidden p-4 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.85rem] font-medium text-mid">
            {hop === -1 ? "Flat top-k retrieval" : "Graph traversal"}
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[0.72rem] text-flow ring-1 ring-line tnum">
              {hop === -1 ? "3 chunks, no chain" : `${Math.max(hop, 0)} / 3 hops`}
            </span>
            {!still && (
              <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused}
                      className="press rounded-full px-3 py-1 text-[0.72rem] font-medium text-mid ring-1 ring-line hover:text-hi">
                {paused ? "Play" : "Pause"}
              </button>
            )}
          </span>
        </div>

        <div className="diagram-scroll">
          <div className="relative min-w-[520px]">
            <svg viewBox="0 0 560 210" className="w-full" role="img"
                 aria-label="Customer to order to warehouse to delay incident: three hops across three documents, which no single retrieved chunk contains.">
              {EDGES.map((e, idx) => {
                const a = NODES[idx]!;
                const b = NODES[idx + 1]!;
                const d = edgePath(a, b);
                const on = hop >= idx + 1;
                const current = hop === idx + 1;
                const mx = (a.x + b.x) / 2;
                const my = Math.min(a.y, b.y) - 4;
                return (
                  <g key={e.label}>
                    <path d={d} fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" strokeDasharray="3 5" opacity={hop === -1 ? 0.25 : 0.5} />
                    {on && (
                      <motion.path
                        key={`e-${idx}`}
                        d={d} fill="none" stroke="var(--color-flow)" strokeWidth="2.2" strokeLinecap="round"
                        initial={still ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
                      />
                    )}
                    {current && !still && (
                      <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
                            className="comet" style={{ "--dur": "0.9s" } as CSSProperties} />
                    )}
                    <text x={mx} y={my} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)"
                          fill={on ? "var(--color-flow)" : "var(--color-low)"} opacity={on ? 1 : 0.75}
                          style={{ transition: "fill .3s, opacity .3s" }}>
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {NODES.map((n, idx) => {
                const on = hop >= idx;
                const arrived = hop === idx;
                return (
                  <g key={n.id}>
                    {arrived && !still && (
                      <motion.circle
                        key={`burst-${idx}`}
                        cx={n.x} cy={n.y} r="12" fill="none" stroke="var(--color-flow)" strokeWidth="1.5"
                        initial={{ r: 12, opacity: 0.9 }}
                        animate={{ r: 34, opacity: 0 }}
                        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                      />
                    )}
                    <circle cx={n.x} cy={n.y} r="22" fill="var(--color-flow)" opacity={on ? 0.16 : 0}
                            style={{ transition: "opacity .4s" }} />
                    <circle cx={n.x} cy={n.y} r="11" strokeWidth="1.5"
                            fill={on ? "var(--color-flow)" : "var(--color-raised)"}
                            stroke={on ? "#fff" : "var(--color-line-ctl)"}
                            style={{ transition: "fill .35s, stroke .35s", filter: on ? "drop-shadow(0 0 8px var(--color-glow))" : "none" }} />
                    <text x={n.x} y={n.y + 34} textAnchor="middle" fontSize="11.5" fontWeight="600"
                          fill="var(--color-hi)" opacity={on || hop === -1 ? 1 : 0.5} style={{ transition: "opacity .3s" }}>
                      {n.label}
                    </text>
                    <text x={n.x} y={n.y + 47} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill="var(--color-low)">
                      {n.doc}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Flat retrieval's result: similar-looking chunks, none holding the chain. */}
            <AnimatePresence>
              {hop === -1 && !still && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.35 } }}
                >
                  {["“order status and delivery times…”", "“our İzmir warehouse opened in…”", "“how to report a late order…”"].map((t, idx) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, transform: "translateY(10px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      transition={{ delay: 0.12 * idx, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="rounded-xl bg-ink-2/95 px-3 py-2.5 text-[0.78rem] leading-snug text-mid shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] ring-1 ring-line"
                    >
                      <span className="mb-1 block font-mono text-[0.68rem] text-block">top-k chunk {idx + 1}</span>
                      {t}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3 min-h-[3.2rem]">
          <motion.p
            key={answered ? "yes" : hop === -1 ? "flat" : "walking"}
            initial={still ? false : { opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-[68ch] text-[0.9rem] leading-relaxed text-mid"
          >
            {answered ? (
              <>
                <span className="font-semibold text-ok">Answerable.</span> Three documents, one path: the order ships from İzmir, and İzmir has an open delay incident.
              </>
            ) : hop === -1 ? (
              <>
                <span className="font-semibold text-block">Not answerable.</span> Each chunk is similar to the question, and none of them holds the chain.
              </>
            ) : (
              "Walking the relations instead of ranking by similarity…"
            )}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
