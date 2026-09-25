"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/** Why a router exists, shown rather than argued. Four questions, each one a
 *  different kind of failure for the other strategies: an identifier the
 *  vector arm cannot embed, a paraphrase with no shared keyword, a multi-hop
 *  question no single chunk contains, and a question that needs no retrieval
 *  at all. Each question is typed, then its route is drawn with a light
 *  travelling along it; the graph question comes back short once, so its
 *  route loops back through the router before it answers. */
type Route = "vector" | "lexical" | "graph" | "none";

const CASES: { q: string; route: Route; reflect: boolean; why: string }[] = [
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
    why: "Two hops (orders to warehouse, warehouse to incident) and no single chunk holds both. The first pass came back short, so the agent re-queried and walked the graph.",
  },
  {
    q: "can you repeat that in English?",
    route: "none",
    reflect: false,
    why: "Everything needed is already in the conversation. Retrieving here would add latency and cost for nothing, so the router skips it.",
  },
];

const ARMS: { id: Exclude<Route, "none">; name: string; sub: string; x: number }[] = [
  { id: "vector", name: "Vector", sub: "meaning", x: 150 },
  { id: "lexical", name: "Lexical", sub: "identifiers", x: 288 },
  { id: "graph", name: "Graph", sub: "entities, hops", x: 426 },
];

const full = (x: number) => `M288 46 V62 H${x} V140 H288 V217 H456`;
const toGate = (x: number) => `M288 46 V62 H${x} V140 H288 V200`;
const REFLECT = "M232 217 H60 V27 H228";
const SKIP = "M348 27 H506 V199";

type Step = { d: string; tone: "flow" | "block"; dur: number };

function stepsFor(c: (typeof CASES)[number]): Step[] {
  if (c.route === "none") return [{ d: SKIP, tone: "flow", dur: 1.1 }];
  const x = ARMS.find((a) => a.id === c.route)!.x;
  if (!c.reflect) return [{ d: full(x), tone: "flow", dur: 1.7 }];
  return [
    { d: toGate(x), tone: "flow", dur: 1.3 },
    { d: REFLECT, tone: "block", dur: 1.1 },
    { d: full(x), tone: "flow", dur: 1.7 },
  ];
}

const TYPE_MS = 26;
const HOLD_MS = 3400;

export default function AgenticRetrieval() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const still = useReducedMotion();

  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [typed, setTyped] = useState(0);
  // -1 while typing; then the index of the step being drawn; steps.length when done.
  const [k, setK] = useState(-1);

  const c = CASES[i]!;
  const steps = useMemo(() => stepsFor(CASES[i]!), [i]);
  const done = k >= steps.length;

  // Changing the question resets its sequence in the same render, so no frame
  // pairs the new question with the old one's progress.
  function go(idx: number) {
    setI(idx);
    setTyped(still ? CASES[idx]!.q.length : 0);
    setK(still ? stepsFor(CASES[idx]!).length : -1);
  }

  // Typing, then each step in turn, but only while the reader can see it.
  useEffect(() => {
    if (!inView || still) return;
    if (k === -1) {
      if (typed < c.q.length) {
        const t = setTimeout(() => setTyped(typed + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setK(0), 260);
      return () => clearTimeout(t);
    }
    if (k < steps.length) {
      const t = setTimeout(() => setK(k + 1), steps[k]!.dur * 1000 + 180);
      return () => clearTimeout(t);
    }
    if (held) return;
    const t = setTimeout(() => go((i + 1) % CASES.length), HOLD_MS);
    return () => clearTimeout(t);
  }, [inView, still, k, typed, held, c.q.length, steps, i]);

  const armLit = (id: Route) => k >= 0 && c.route === id;
  const gate =
    c.route === "none" || k < 1 ? "idle"
    : c.reflect && k === 1 ? "short"
    : c.reflect && k === 2 ? "idle"
    : "ok";

  return (
    <div ref={ref} className="bezel">
      <div className="screen overflow-hidden p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {CASES.map((x, idx) => {
            const on = idx === i;
            return (
              <button
                key={x.q}
                type="button"
                aria-pressed={on}
                onClick={() => { go(idx); setHeld(true); }}
                className={`press relative rounded-full px-3 py-1.5 text-left font-mono text-[0.72rem] ${on ? "text-ink" : "text-mid hover:text-hi"}`}
              >
                {on && (
                  <motion.span
                    layoutId="agentic-chip"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                  />
                )}
                <span className="relative">{x.q.length > 30 ? x.q.slice(0, 29) + "…" : x.q}</span>
              </button>
            );
          })}
          <button type="button" onClick={() => setHeld((v) => !v)} aria-pressed={held}
                  className="press ml-auto rounded-full px-3 py-1.5 text-[0.72rem] font-medium text-mid ring-1 ring-line hover:text-hi">
            {held ? "Play" : "Pause"}
          </button>
        </div>

        {/* The query line: a terminal prompt with a caret while typing. */}
        <div className="mb-3 flex min-h-[2.6rem] items-center gap-3 rounded-xl bg-white/[0.04] px-4 font-mono text-[0.85rem] ring-1 ring-line">
          <span className="text-flow">user</span>
          <span className="text-hi">
            {c.q.slice(0, typed)}
            {k === -1 && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-flow" />}
          </span>
        </div>

        <div className="diagram-scroll">
          <svg viewBox="0 0 560 250" className="w-full min-w-[520px]" role="img"
               aria-label="A router chooses between vector, lexical and graph retrieval or skips retrieval entirely; results are fused, checked for sufficiency, and re-queried when they fall short.">
            {/* the whole network, faint */}
            <g fill="none" stroke="var(--color-line-ctl)" strokeWidth="1" opacity="0.45">
              {ARMS.map((a) => <path key={a.id} d={`M288 46 V62 H${a.x} V80 M${a.x} 122 V140 H288 V152`} />)}
              <path d="M288 188 V200 M344 217 H456" />
              <path d={SKIP} strokeDasharray="4 4" />
              <path d={REFLECT} strokeDasharray="4 4" opacity="0.5" />
            </g>

            {/* drawn routes: each step draws itself, and a light runs along it */}
            {steps.slice(0, Math.min(k + 1, steps.length)).map((s, idx) => {
              const color = s.tone === "block" ? "var(--color-block)" : "var(--color-flow)";
              const current = idx === k;
              return (
                <g key={`${i}-${idx}`}>
                  <motion.path
                    d={s.d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={s.tone === "block" ? "5 4" : undefined}
                    initial={still ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: current || done ? 1 : 0.55 }}
                    transition={{ pathLength: { duration: s.dur, ease: [0.77, 0, 0.175, 1] }, opacity: { duration: 0.3 } }}
                  />
                  {current && !still && (
                    <path
                      d={s.d} pathLength={1} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
                      className="comet" style={{ "--dur": `${s.dur}s` } as CSSProperties}
                    />
                  )}
                </g>
              );
            })}

            {/* router */}
            <motion.g
              key={`router-${i}-${k}`}
              initial={still || k < 0 ? false : { scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              style={{ transformOrigin: "288px 27px" }}
            >
              <rect x="228" y="8" width="120" height="38" rx="10" fill="var(--color-lifted)"
                    stroke={k >= 0 ? "var(--color-flow)" : "var(--color-line-lit)"} strokeWidth="1.3" />
              <text x="288" y="26" textAnchor="middle" fontSize="11.5" fill="var(--color-hi)" fontWeight="600">Router</text>
              <text x="288" y="39" textAnchor="middle" fontSize="8.5" fill="var(--color-mid)">retrieve? which way?</text>
            </motion.g>

            <text x="428" y="20" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)"
                  fill={armLit("none") ? "var(--color-flow)" : "var(--color-low)"} opacity={armLit("none") ? 1 : 0.8}>
              no retrieval needed
            </text>

            {ARMS.map((a) => {
              const lit = armLit(a.id);
              return (
                <g key={a.id} style={{ transition: "opacity .4s" }} opacity={k >= 0 && !lit ? 0.6 : 1}>
                  <rect x={a.x - 56} y="80" width="112" height="42" rx="10"
                        fill={lit ? "var(--color-lifted)" : "var(--color-raised)"}
                        stroke={lit ? "var(--color-flow)" : "var(--color-line)"} strokeWidth="1.25"
                        style={{ transition: "stroke .3s, fill .3s" }} />
                  <text x={a.x} y="99" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--color-hi)">{a.name}</text>
                  <text x={a.x} y="112" textAnchor="middle" fontSize="8.5" fill="var(--color-mid)">{a.sub}</text>
                </g>
              );
            })}

            <rect x="232" y="152" width="112" height="36" rx="10" fill="var(--color-raised)" stroke="var(--color-line)" />
            <text x="288" y="174" textAnchor="middle" fontSize="11" fill="var(--color-hi)">Fuse &amp; rank</text>

            {/* sufficiency gate */}
            <rect x="232" y="200" width="112" height="34" rx="10" fill="var(--color-lifted)" strokeWidth="1.3"
                  stroke={gate === "ok" ? "var(--color-ok)" : gate === "short" ? "var(--color-block)" : "var(--color-line-lit)"}
                  style={{ transition: "stroke .3s" }} />
            <text x="288" y="221" textAnchor="middle" fontSize="10.5" fontWeight="600"
                  fill={gate === "ok" ? "var(--color-ok)" : gate === "short" ? "var(--color-block)" : "var(--color-mid)"}>
              {gate === "ok" ? "enough → answer" : gate === "short" ? "not enough → re-query" : "enough context?"}
            </text>

            <text x="60" y="128" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)" transform="rotate(-90 60 128)"
                  fill="var(--color-block)" opacity={gate === "short" ? 1 : 0.25} style={{ transition: "opacity .3s" }}>
              reflect
            </text>

            <rect x="456" y="199" width="100" height="36" rx="10"
                  fill={done ? "var(--color-flow)" : "var(--color-raised)"}
                  stroke={done ? "var(--color-flow)" : "var(--color-line)"}
                  style={{ transition: "fill .4s, stroke .4s" }} />
            <text x="506" y="221" textAnchor="middle" fontSize="11" fontWeight="600"
                  fill={done ? "var(--color-ink)" : "var(--color-hi)"} style={{ transition: "fill .4s" }}>Answer</text>
          </svg>
        </div>

        <motion.p
          key={`why-${i}-${done}`}
          initial={still ? false : { opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: done ? 1 : 0.35, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mt-3 min-h-[3.4rem] max-w-[68ch] text-[0.9rem] leading-relaxed text-mid"
        >
          {done ? c.why : "Routing…"}
        </motion.p>
      </div>
    </div>
  );
}
