"use client";

import { useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** The point of the evaluation case is that the loop closes: production
 *  traffic feeds the set every change is judged against. A light runs the
 *  loop continuously and each stage lights as it passes, which is constant
 *  motion with a meaning (the cycle), so it runs linear and only while seen. */
const T = 7; // seconds per lap

// Stadium loop: top run left to right, right arc, bottom run right to left, left arc.
const LOOP = "M120 42 H780 A50 50 0 0 1 780 142 H120 A50 50 0 0 1 120 42 Z";
const LEN = 660 * 2 + Math.PI * 50 * 2;

const STAGES = [
  { label: "Production traffic", sub: "real questions", x: 190, y: 42, at: 70 },
  { label: "Eval set", sub: "sampled, labelled", x: 450, y: 42, at: 330 },
  { label: "A change", sub: "prompt or retriever", x: 710, y: 42, at: 590 },
  { label: "Judged", sub: "against the set", x: 610, y: 142, at: 660 + Math.PI * 50 + 170 },
  { label: "Shipped", sub: "or rolled back", x: 290, y: 142, at: 660 + Math.PI * 50 + 490 },
];

export default function EvalLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const still = useReducedMotion();
  const state = inView ? "running" : "paused";

  return (
    <div ref={ref} className="bezel">
      <div className="screen p-4 sm:p-6">
        <p className="mb-2 text-[0.85rem] font-medium text-mid">The loop that keeps evaluation honest</p>
        <div className="diagram-scroll">
          <svg viewBox="0 -12 900 214" className="w-full min-w-[640px]" role="img"
               aria-label="A closed loop: production traffic is sampled into the evaluation set, a change is judged against it, and it is shipped or rolled back, which produces new production traffic.">
            <path d={LOOP} fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" strokeDasharray="4 5" opacity="0.6" />
            <path d={LOOP} pathLength={1} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
                  className="motion-reduce:hidden"
                  style={{ strokeDasharray: "0.07 0.93", animation: `lap ${T}s linear infinite ${state}`, filter: "drop-shadow(0 0 6px var(--color-glow))" }} />
            {STAGES.map((s) => (
              <g key={s.label}>
                <circle cx={s.x} cy={s.y} r="9" fill="var(--color-raised)" stroke="var(--color-flow)" strokeWidth="1.5"
                        style={still ? undefined : { animation: `hit ${T}s linear ${(s.at / LEN) * T}s infinite ${state}` } as CSSProperties} />
                <text x={s.x} y={s.y < 100 ? s.y - 34 : s.y + 30} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-hi)">{s.label}</text>
                <text x={s.x} y={s.y < 100 ? s.y - 20 : s.y + 44} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--color-low)">{s.sub}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes lap { from { stroke-dashoffset: 0.07; } to { stroke-dashoffset: -0.93; } }
        @keyframes hit {
          0% { fill: var(--color-flow); filter: drop-shadow(0 0 8px var(--color-glow)); }
          14%, 100% { fill: var(--color-raised); filter: none; }
        }
      `}</style>
    </div>
  );
}
