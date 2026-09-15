"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** The case flat retrieval cannot win. The answer needs three facts that live
 *  in three different documents, so no chunk contains it and similarity to the
 *  question does not surface the chain. Traversal does: the hops light in
 *  order, and the answer appears only once the last edge is crossed. */
const NODES = [
  { id: "cust", label: "Customer", x: 58, y: 118, hop: 0 },
  { id: "order", label: "Order 84-5512", x: 190, y: 56, hop: 1 },
  { id: "wh", label: "İzmir warehouse", x: 340, y: 118, hop: 2 },
  { id: "inc", label: "Delay incident", x: 486, y: 56, hop: 3 },
];

const EDGES = [
  { from: "cust", to: "order", label: "placed", hop: 1 },
  { from: "order", to: "wh", label: "ships from", hop: 2 },
  { from: "wh", to: "inc", label: "affected by", hop: 3 },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

export default function GraphHop() {
  const [hop, setHop] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) { setHop(3); return; }
    const id = setInterval(() => setHop((h) => (h + 1) % 5), 1250);
    return () => clearInterval(id);
  }, [still]);

  return (
    <div className="rounded-[14px] border border-line bg-base/50 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="label">MULTI-HOP · WHAT FLAT RETRIEVAL MISSES</span>
        <span className="font-mono text-[0.7rem] text-flow tnum">
          {Math.min(hop, 3)} / 3 hops
        </span>
      </div>

      <div className="diagram-scroll">
        <svg viewBox="0 0 560 180" className="w-full min-w-[520px]" role="img"
             aria-label="Customer to order to warehouse to delay incident: three hops across three documents, which no single retrieved chunk contains.">
          {EDGES.map((e) => {
            const a = byId(e.from);
            const b = byId(e.to);
            const on = hop >= e.hop;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={`${e.from}-${e.to}`}>
                <motion.line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  strokeWidth={on ? 1.8 : 1}
                  animate={{ stroke: on ? "var(--color-flow)" : "var(--color-line-ctl)", opacity: on ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.text
                  x={mx} y={my - 7} textAnchor="middle" fontSize="9"
                  fontFamily="var(--font-mono)"
                  animate={{ fill: on ? "var(--color-flow)" : "var(--color-low)", opacity: on ? 1 : 0.5 }}
                >
                  {e.label}
                </motion.text>
              </g>
            );
          })}

          {NODES.map((n) => {
            const on = hop >= n.hop;
            return (
              <g key={n.id}>
                {on && !still && n.hop === hop && (
                  <motion.circle
                    cx={n.x} cy={n.y} r="10" fill="var(--color-flow)"
                    animate={{ r: [10, 26], opacity: [0.3, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <motion.circle
                  cx={n.x} cy={n.y} r="9" strokeWidth="1.5"
                  animate={{
                    fill: on ? "var(--color-flow)" : "var(--color-base)",
                    stroke: on ? "var(--color-flow)" : "var(--color-line-ctl)",
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.text
                  x={n.x} y={n.y + 26} textAnchor="middle" fontSize="10.5"
                  animate={{ fill: on ? "var(--color-hi)" : "var(--color-mid)", opacity: on ? 1 : 0.55 }}
                >
                  {n.label}
                </motion.text>
                <text x={n.x} y={n.y - 17} textAnchor="middle" fontSize="8"
                      fill="var(--color-low)" fontFamily="var(--font-mono)">
                  doc {n.hop + 1}
                </text>
              </g>
            );
          })}

          <motion.text
            x="280" y="170" textAnchor="middle" fontSize="10.5"
            animate={{ opacity: hop >= 3 ? 1 : 0.25, fill: hop >= 3 ? "var(--color-ok)" : "var(--color-low)" }}
            transition={{ duration: 0.3 }}
          >
            {hop >= 3
              ? "answerable — three documents, one path"
              : "no single chunk holds this chain"}
          </motion.text>
        </svg>
      </div>
    </div>
  );
}
