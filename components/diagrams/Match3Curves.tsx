"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MATCH3 } from "@/lib/match3";

/** The real clear-rate curves from match3-rl, drawn on arrival. The band
 *  between the careless (random) and careful (greedy) player is the skill
 *  sensitivity the case study is about; it peaks at level 27. Pointing at the
 *  chart reads out every player at that level. */
const SERIES = [
  { key: "random", name: "Random", color: "rgb(170 180 220 / 0.6)", width: 1.5 },
  { key: "agent_200k", name: "PPO 200k", color: "#6c7cff", width: 1.75 },
  { key: "agent", name: "PPO 2M", color: "#9aaaff", width: 2.25 },
  { key: "greedy", name: "Greedy", color: "#ffffff", width: 2.25 },
] as const;

const W = 640;
const H = 290;
const PAD = { l: 44, r: 16, t: 16, b: 30 };
const N = MATCH3.random.length;

const px = (i: number) => PAD.l + (i / (N - 1)) * (W - PAD.l - PAD.r);
const py = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);
const line = (vals: readonly number[]) => vals.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");

const band =
  line(MATCH3.greedy) + " " +
  [...MATCH3.random].map((v, i) => [i, v] as const).reverse().map(([i, v]) => `L${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ") + " Z";

const gaps = MATCH3.greedy.map((g, i) => g - MATCH3.random[i]!);
const PEAK = gaps.indexOf(Math.max(...gaps));

export default function Match3Curves() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const still = useReducedMotion();
  const [level, setLevel] = useState<number | null>(null);
  const drawn = still || inView;

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * (N - 1));
    setLevel(Math.max(0, Math.min(N - 1, i)));
  }

  const shown = level ?? PEAK;

  return (
    <div ref={ref} className="bezel">
      <div className="screen p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.85rem] font-medium text-mid">Clear rate by level, 40 levels</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {SERIES.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5 text-[0.78rem] text-mid">
                <span className="h-[3px] w-4 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full touch-pan-y"
            role="img"
            aria-label="Clear rate falls with level for all four players; greedy stays highest, random lowest, and the gap between them peaks at 63 points on level 27."
            onPointerMove={onMove}
            onPointerLeave={() => setLevel(null)}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={py(v)} y2={py(v)} stroke="var(--color-line)" />
                <text x={PAD.l - 8} y={py(v) + 3} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-low)">{v * 100}%</text>
              </g>
            ))}
            {[1, 10, 20, 30, 40].map((l) => (
              <text key={l} x={px(l - 1)} y={H - 10} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-low)">{l}</text>
            ))}

            <defs>
              <linearGradient id="m3-band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2f4bff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#2f4bff" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <motion.path
              d={band} fill="url(#m3-band)"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: drawn ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            />

            {SERIES.map((s, idx) => (
              <motion.path
                key={s.key}
                d={line(MATCH3[s.key])} fill="none" stroke={s.color} strokeWidth={s.width}
                strokeLinejoin="round" strokeLinecap="round"
                initial={still ? false : { pathLength: 0 }}
                animate={{ pathLength: drawn ? 1 : 0 }}
                transition={{ duration: 1.6, delay: 0.15 * idx, ease: [0.77, 0, 0.175, 1] }}
              />
            ))}

            {/* level read-out */}
            <line x1="0" x2="0" y1={PAD.t} y2={H - PAD.b} stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 3"
                  style={{ transform: `translateX(${px(shown)}px)`, transition: "transform .15s ease-out" }} />
            {SERIES.map((s) => (
              <circle key={s.key} cx={px(shown)} cy={py(MATCH3[s.key][shown]!)} r="3.5" fill={s.color} stroke="var(--color-ink)" strokeWidth="1.5"
                      opacity={drawn ? 1 : 0} style={{ transition: "cx .15s ease-out, cy .15s ease-out, opacity .4s 1.6s" }} />
            ))}
          </svg>

          <div
            className="pointer-events-none absolute top-2 hidden whitespace-nowrap rounded-xl sm:block bg-ink-2/95 px-3 py-2 text-[0.75rem] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.7)] ring-1 ring-line transition-[left,opacity] duration-150 ease-out"
            style={{
              left: `calc(${(px(shown) / W) * 100}% ${px(shown) / W > 0.5 ? "- 12px" : "+ 12px"})`,
              transform: px(shown) / W > 0.5 ? "translateX(-100%)" : undefined,
              opacity: drawn ? 1 : 0,
            }}
          >
            <p className="mb-1 font-semibold text-hi">Level {shown + 1}</p>
            {SERIES.map((s) => (
              <p key={s.key} className="flex justify-between gap-4 font-mono text-mid tnum">
                <span>{s.name}</span><span className="text-hi">{Math.round(MATCH3[s.key][shown]! * 100)}%</span>
              </p>
            ))}
            <p className="mt-1 flex justify-between gap-4 border-t border-line pt-1 font-mono text-flow tnum">
              <span>gap</span><span>{Math.round(gaps[shown]! * 100)}pp</span>
            </p>
          </div>
        </div>

        {/* On a phone the chart is too short for a floating box; read out below it. */}
        <div className="mt-3 grid grid-cols-5 gap-1 text-center font-mono text-[0.68rem] text-mid tnum sm:hidden">
          <span className="col-span-5 mb-1 text-left font-sans text-[0.8rem] font-semibold text-hi">Level {shown + 1}</span>
          {SERIES.map((s) => (
            <span key={s.key}>{s.name}<br /><span className="text-hi">{Math.round(MATCH3[s.key][shown]! * 100)}%</span></span>
          ))}
          <span className="text-flow">gap<br />{Math.round(gaps[shown]! * 100)}pp</span>
        </div>
      </div>
    </div>
  );
}
