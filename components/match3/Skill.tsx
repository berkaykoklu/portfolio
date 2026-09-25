"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { results } from "@/lib/match3/results";

const W = 760;
const H = 190;
const PAD = { left: 40, right: 12, top: 18, bottom: 26 };

/** How far apart a level pulls a careless player and a considered one.
 *
 *  Difficulty says how many attempts fail. This says whether playing better
 *  changes that, which is the part a designer can act on. Bars grow in level
 *  order when the chart arrives, so the rise and fall across the game reads
 *  as a sweep. */
export function Skill() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.3, once: true });
  const gaps = results.skill_sensitivity;
  const n = gaps.length;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const barW = plotW / n - 3;
  const peak = Math.max(...gaps);
  // Room above today's peak, and never less than the peak if the data changes.
  const top = Math.max(0.7, peak);
  const base = PAD.top + plotH;

  return (
    <div ref={ref} className="bezel">
      <figure className="screen p-4 sm:p-6">
        <div className="diagram-scroll">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" role="img"
               aria-label="Gap between the greedy player's and the random player's clear rate, per level">
            {[0, top / 2, top].map((v) => (
              <g key={v}>
                <line x1={PAD.left} y1={PAD.top + (1 - v / top) * plotH} x2={W - PAD.right} y2={PAD.top + (1 - v / top) * plotH} stroke="var(--color-line)" />
                <text x={PAD.left - 8} y={PAD.top + (1 - v / top) * plotH + 4} textAnchor="end" fill="var(--color-low)" fontSize={11} fontFamily="var(--font-mono)">
                  {Math.round(v * 100)}
                </text>
              </g>
            ))}
            {gaps.map((g, i) => {
              const h = Math.max((g / top) * plotH, 0);
              const isPeak = g === peak;
              return (
                <rect
                  key={i}
                  x={PAD.left + (i * plotW) / n}
                  y={base - h}
                  width={barW}
                  height={h}
                  rx={2}
                  fill={isPeak ? "var(--color-flag)" : "var(--color-greedy)"}
                  opacity={isPeak ? 1 : 0.6}
                  className="motion-reduce:[transition:none]!"
                  style={{
                    transformOrigin: `0 ${base}px`,
                    transform: seen ? "scaleY(1)" : "scaleY(0)",
                    transition: `transform 700ms var(--ease-out) ${i * 22}ms`,
                  }}
                />
              );
            })}
            {(() => {
              const i = gaps.indexOf(peak);
              const cx = PAD.left + (i * plotW) / n + barW / 2;
              return (
                <text x={cx} y={base - (peak / top) * plotH - 6} textAnchor="middle" fontSize={11} fontWeight={600}
                      fill="var(--color-flag)" style={{ opacity: seen ? 1 : 0, transition: "opacity 400ms ease 1.1s" }}>
                  {Math.round(peak * 100)}pp
                </text>
              );
            })()}
            {[1, 10, 20, 30, 40].map((level) => (
              <text key={level} x={PAD.left + ((level - 1) * plotW) / n + barW / 2} y={H - 7} textAnchor="middle" fill="var(--color-low)" fontSize={11} fontFamily="var(--font-mono)">
                {level}
              </text>
            ))}
          </svg>
        </div>
        <figcaption className="mt-2 text-[0.82rem] text-mid">
          Percentage points between the greedy player and the random one, level by level.
        </figcaption>
      </figure>
    </div>
  );
}
