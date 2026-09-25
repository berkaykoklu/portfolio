"use client";

import { useRef, useState, type PointerEvent } from "react";
import { useInView } from "motion/react";
import { PLAYERS, results } from "@/lib/match3/results";

const W = 760;
const H = 300;
const PAD = { left: 40, right: 12, top: 12, bottom: 28 };

/** Solve rate against level, one line per player.
 *
 *  Four lines on one pair of axes rather than four charts: the claim is that
 *  difficulty depends on who is playing, and that claim is only visible when
 *  the curves share a scale. The band between the random and greedy player is
 *  what skill is worth at each level; pointing at the chart reads it out. */
export function Curves() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.3, once: true });
  const n = results.levels.length;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (n - 1)) * plotW;
  const y = (v: number) => PAD.top + (1 - v) * plotH;
  const path = (series: number[]) =>
    series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const random = results.solve_rate.random ?? [];
  const greedy = results.solve_rate.greedy ?? [];
  const band =
    path(greedy) + " " + [...random].map((v, i) => [i, v] as const).reverse().map(([i, v]) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + " Z";
  const gaps = results.skill_sensitivity;
  const peak = gaps.indexOf(Math.max(...gaps));

  const [level, setLevel] = useState<number | null>(null);
  const shown = level ?? peak;
  const players = PLAYERS.filter((p) => results.solve_rate[p.key]);

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - box.left) / box.width) * W;
    setLevel(Math.max(0, Math.min(n - 1, Math.round(((sx - PAD.left) / plotW) * (n - 1)))));
  }

  const right = x(shown) / W > 0.5;

  return (
    <div ref={ref} className="bezel">
      <figure className="screen p-4 sm:p-6">
        <figcaption className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8rem]">
          {players.map(({ key, label, colour, note }) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="h-[3px] w-4 rounded-full" style={{ background: colour }} />
              <span className="font-medium" style={{ color: colour }}>{label}</span>
              <span className="text-low">{note}</span>
            </span>
          ))}
        </figcaption>

        <div className="relative">
          <div className="diagram-scroll">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full min-w-[640px]"
              role="img"
              aria-label="Share of attempts cleared at each level, for a random player, a PPO agent trained for two lengths, and a one-move greedy heuristic"
              onPointerMove={onMove}
              onPointerLeave={() => setLevel(null)}
            >
              {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <g key={v}>
                  <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="var(--color-line)" />
                  <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" className="tnum" fill="var(--color-low)" fontSize={11} fontFamily="var(--font-mono)">
                    {v * 100}%
                  </text>
                </g>
              ))}
              {[1, 10, 20, 30, 40].map((l) => (
                <text key={l} x={x(l - 1)} y={H - 8} textAnchor="middle" className="tnum" fill="var(--color-low)" fontSize={11} fontFamily="var(--font-mono)">
                  {l}
                </text>
              ))}

              <defs>
                <linearGradient id="gap-band" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2f4bff" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#2f4bff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d={band} fill="url(#gap-band)" style={{ opacity: seen ? 1 : 0, transition: "opacity 800ms ease 1.3s" }} />

              {players.map(({ key, colour }, idx) => (
                <path
                  key={key}
                  d={path(results.solve_rate[key]!)}
                  pathLength={1}
                  fill="none"
                  stroke={colour}
                  strokeWidth={key === "agent" || key === "greedy" ? 2.4 : 1.6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="motion-reduce:[transition:none]!"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: seen ? 0 : 1,
                    transition: `stroke-dashoffset 1.6s var(--ease-in-out) ${idx * 150}ms`,
                  }}
                />
              ))}

              <line x1="0" x2="0" y1={PAD.top} y2={H - PAD.bottom} stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 3"
                    style={{ transform: `translateX(${x(shown)}px)`, transition: "transform 150ms ease-out", opacity: seen ? 1 : 0 }} />
              {players.map(({ key, colour }) => (
                <circle key={key} cx={x(shown)} cy={y(results.solve_rate[key]![shown]!)} r="4" fill={colour} stroke="var(--color-ink)" strokeWidth="1.5"
                        style={{ transition: "cx 150ms ease-out, cy 150ms ease-out, opacity 400ms 1.6s", opacity: seen ? 1 : 0 }} />
              ))}
            </svg>
          </div>

          <div
            className="pointer-events-none absolute top-2 hidden whitespace-nowrap rounded-xl bg-ink-2/95 px-3 py-2 text-[0.78rem] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.7)] ring-1 ring-line transition-[left,opacity] duration-150 ease-out sm:block"
            style={{
              left: `calc(${(x(shown) / W) * 100}% ${right ? "- 12px" : "+ 12px"})`,
              transform: right ? "translateX(-100%)" : undefined,
              opacity: seen ? 1 : 0,
            }}
          >
            <p className="mb-1 font-semibold text-hi">Level {shown + 1}</p>
            {players.map((p) => (
              <p key={p.key} className="flex justify-between gap-5 font-mono text-mid tnum">
                <span>{p.label}</span>
                <span className="text-hi">{(results.solve_rate[p.key]![shown]! * 100).toFixed(1)}%</span>
              </p>
            ))}
            <p className="mt-1 flex justify-between gap-5 border-t border-line pt-1 font-mono text-agent tnum">
              <span>skill gap</span><span>{Math.round(gaps[shown]! * 100)}pp</span>
            </p>
          </div>
        </div>
      </figure>
    </div>
  );
}
