"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Both paths a response can take. Cycling between them makes the point that a
 *  guardrail is on the path every answer travels, not a filter bolted on at
 *  the end of the happy one. */
const CASES = [
  { id: "clean", verdict: "released", note: "Nothing identifying, nothing unsafe. The response goes out unchanged.", colour: "var(--color-ok)" },
  { id: "pii", verdict: "redacted", note: "The draft repeated a customer record it had retrieved. Identifying fields are removed before anyone sees it.", colour: "var(--color-block)" },
] as const;

const STEPS = ["Input", "Pre-check", "Model", "Guardrail", "Response"] as const;

export default function SafetyDiagram() {
  const [i, setI] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setI((v) => (v + 1) % CASES.length), 3800);
    return () => clearInterval(id);
  }, [still]);

  const c = CASES[i] ?? CASES[0];

  return (
    <div className="rounded-panel border border-line bg-base/60 p-4">
      <div className="diagram-scroll">
        <svg viewBox="0 0 560 108" className="w-full min-w-[440px]" role="img"
             aria-label="Every response passes a guardrail; an output containing personal data is redacted before release.">
          {STEPS.map((s, idx) => {
            const x = 6 + idx * 112;
            const isGuard = idx === 3;
            return (
              <g key={s}>
                <motion.rect
                  x={x} y="30" width="98" height="42" rx="7"
                  fill={isGuard ? "var(--color-lifted)" : "var(--color-raised)"}
                  animate={{ stroke: isGuard ? c.colour : "var(--color-line)" }}
                  transition={{ duration: .35 }}
                  strokeWidth={isGuard ? 1.5 : 1}
                />
                <text x={x + 49} y="56" textAnchor="middle" fontSize="11"
                      fill={isGuard ? "var(--color-hi)" : "var(--color-mid)"}
                      fontWeight={isGuard ? 600 : 400}>{s}</text>
                {idx < STEPS.length - 1 && (
                  <line x1={x + 98} y1="51" x2={x + 110} y2="51" stroke="var(--color-line-ctl)" strokeWidth="1" />
                )}
              </g>
            );
          })}
          <motion.text
            key={c.id} x="455" y="22" textAnchor="middle" fontSize="10"
            fontFamily="var(--font-mono)" fill={c.colour}
            initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}
          >
            {c.verdict.toUpperCase()}
          </motion.text>
        </svg>
      </div>
      <motion.p
        key={c.note}
        initial={still ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .25 }}
        className="mt-3 min-h-[2.4rem] text-[0.84rem] leading-relaxed text-mid"
      >
        {c.note}
      </motion.p>
    </div>
  );
}
