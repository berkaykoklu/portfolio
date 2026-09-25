"use client";

import { useEffect, useMemo, useReducer, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Grab, Pointer } from "lucide-react";
import { fallMoves } from "@/lib/match3/animate";
import type { Replay as ReplayData } from "@/lib/match3/results";

const TILE = ["#6d8cff", "#4dd8e8", "#4ade80", "#ffb266"];
const GAP = 3;

/** How long each phase of a move is held, in milliseconds. The agent's hand
 *  aims first, so a reader sees which two tiles it chose before anything
 *  moves; the grab is a beat; the swap carries the tile; the pop is a burst;
 *  the fall lands with a small bounce. A long cascade still finishes before
 *  attention does. */
const HOLD = { rest: 200, aim: 560, grab: 170, swap: 340, pop: 340, fall: 330 } as const;

type Phase =
  | { kind: "rest" }
  | { kind: "aim" }
  | { kind: "grab" }
  | { kind: "swap" }
  | { kind: "pop"; round: number }
  | { kind: "fall"; round: number };

type State = { move: number; phase: Phase; playing: boolean };

type Action = { type: "tick" } | { type: "toggle" } | { type: "seek"; move: number };

function next(state: State, moves: ReplayData["moves"]): State {
  const move = moves[state.move];
  if (!move) return { ...state, playing: false };

  switch (state.phase.kind) {
    case "rest":
      return { ...state, phase: { kind: "aim" } };
    case "aim":
      return { ...state, phase: { kind: "grab" } };
    case "grab":
      return { ...state, phase: { kind: "swap" } };
    case "swap":
      return { ...state, phase: { kind: "pop", round: 0 } };
    case "pop":
      return { ...state, phase: { kind: "fall", round: state.phase.round } };
    case "fall": {
      const round = state.phase.round + 1;
      if (round < move.rounds.length) return { ...state, phase: { kind: "pop", round } };
      const nextMove = state.move + 1;
      // One past the last move: the finished board, not the one before the final swap.
      if (nextMove >= moves.length) return { move: moves.length, playing: false, phase: { kind: "rest" } };
      return { ...state, move: nextMove, phase: { kind: "rest" } };
    }
  }
}

type TileView = {
  key: string;
  r: number;
  c: number;
  colour: number;
  dy: number;
  dx: number;
  gone?: boolean;
  lift?: boolean;
  enterFrom?: number;
};

/** One player's attempt at one level, played back as the game rather than as a
 *  slideshow of boards: the agent's hand aims at the two tiles it chose, grabs
 *  one, swaps it, and the match bursts. Autoplay is off by default, since
 *  three of these sit side by side and three boards animating unasked is
 *  noise; the hero's single board autoplays, only while on screen, loops once
 *  it finishes, and stays put once the reader has paused it. */
export function Replay({
  data,
  label,
  colour,
  note,
  target,
  movesTotal,
  targetColour,
  size = 30,
  autoplay = false,
}: {
  data: ReplayData;
  label: string;
  colour: string;
  note: string;
  target: number;
  /** The level's move budget, shown before the first move is made. */
  movesTotal: number;
  /** The tile colour this level collects: the only colour the counter counts. */
  targetColour: number;
  size?: number;
  autoplay?: boolean;
}) {
  const SIZE = size;
  const STEP = size + GAP;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion() ?? false;
  const [userPaused, setUserPaused] = useState(false);
  // True only while a run was started by autoplay, so scrolling away never
  // pauses a run the reader started themselves.
  const autoRun = useRef(false);
  const [state, dispatch] = useReducer(
    (s: State, a: Action): State => {
      if (a.type === "toggle") {
        const done = s.move >= data.moves.length;
        return done
          ? { move: 0, phase: { kind: "rest" }, playing: true }
          : { ...s, playing: !s.playing };
      }
      if (a.type === "seek") {
        return { move: a.move, phase: { kind: "rest" }, playing: false };
      }
      return next(s, data.moves);
    },
    { move: 0, phase: { kind: "rest" }, playing: false },
  );

  useEffect(() => {
    if (!state.playing) return;
    const t = setTimeout(() => dispatch({ type: "tick" }), HOLD[state.phase.kind]);
    return () => clearTimeout(t);
  }, [state.playing, state.phase, state.move]);

  useEffect(() => {
    if (!autoplay || reduce || userPaused) return;
    if (inView && !state.playing) {
      const t = setTimeout(() => { autoRun.current = true; dispatch({ type: "toggle" }); }, state.move > 0 ? 1800 : 500);
      return () => clearTimeout(t);
    }
    if (!inView && state.playing && autoRun.current) dispatch({ type: "toggle" });
  }, [autoplay, reduce, userPaused, inView, state.playing, state.move]);

  const move = data.moves[state.move];
  const rows = data.start.length;
  const cols = data.start[0]?.length ?? 0;
  const kind = state.phase.kind;
  const roundIdx = "round" in state.phase ? state.phase.round : 0;

  /** The board before this move's swap. */
  const before = useMemo(
    () => (state.move === 0 ? data.start : data.moves[state.move - 1]?.rounds.at(-1)?.after ?? data.start),
    [state.move, data],
  );

  /** The board a round starts from: the swapped board for the first round,
   *  otherwise wherever the previous round left it. */
  const roundStart = useMemo(() => {
    if (!move) return data.start;
    if (roundIdx === 0) return move.swapped;
    return move.rounds[roundIdx - 1]?.after ?? move.swapped;
  }, [move, roundIdx, data.start]);

  const tiles = useMemo<TileView[]>(() => {
    const plain = (board: number[][]) =>
      board.flatMap((row, r) => row.map((colour, c) => ({ key: `${r}-${c}`, r, c, colour, dy: 0, dx: 0 })));

    if (!move || kind === "rest") return plain(before);

    const [r1, c1, r2, c2] = move.swap;
    // The swapped pair stays on the same elements, at the same offsets, from the
    // swap into the first pop; re-keying them there would flip their colours and
    // slide them back across each other.
    const swapped = (lift: boolean) =>
      plain(before).map((t) => {
        const isA = t.r === r1 && t.c === c1;
        const isB = t.r === r2 && t.c === c2;
        return {
          ...t,
          lift: lift && isA,
          dy: isA ? (r2 - r1) * STEP : isB ? (r1 - r2) * STEP : 0,
          dx: isA ? (c2 - c1) * STEP : isB ? (c1 - c2) * STEP : 0,
        };
      });
    if (kind === "aim" || kind === "grab") {
      return plain(before).map((t) => ({ ...t, lift: kind === "grab" && t.r === r1 && t.c === c1 }));
    }
    if (kind === "swap") return swapped(true);

    const round = move.rounds[roundIdx];
    if (!round) return plain(roundStart);
    const cleared = new Set(round.matched.map(([r, c]) => `${r},${c}`));

    if (kind === "pop" && roundIdx === 0) {
      return swapped(false).map((t) => ({
        ...t,
        gone: cleared.has(`${t.r + Math.round(t.dy / STEP)},${t.c + Math.round(t.dx / STEP)}`),
      }));
    }
    if (kind === "pop") {
      // Same keys the previous fall used, so the tiles that pop are the ones
      // already on screen and their burst transitions from full size.
      return plain(roundStart).map((t) => ({ ...t, key: `r${roundIdx - 1}-${t.c}-${t.r}`, gone: cleared.has(`${t.r},${t.c}`) }));
    }

    // Falling: every tile is drawn at its destination and offset back to where
    // it came from, so releasing the offset is the fall. The key carries the
    // round so React remounts the tile each time: a reused element keeps its
    // finished animation and would drop into place without appearing to move.
    return fallMoves(roundStart, round.matched, round.after).map((m) => ({
      key: `r${roundIdx}-${m.col}-${m.to}`,
      r: m.to,
      c: m.col,
      colour: m.colour,
      dy: 0,
      dx: 0,
      enterFrom: (m.from - m.to) * STEP,
    }));
  }, [move, kind, roundIdx, before, roundStart, STEP]);

  const width = cols * SIZE + (cols - 1) * GAP;
  const height = rows * SIZE + (rows - 1) * GAP;
  const last = data.moves.at(-1);
  const finished = state.move >= data.moves.length;
  // Before the swap the board is the previous move's result, so the counters
  // are too; they take this move's values once its matches start resolving.
  const resolving = kind === "pop" || kind === "fall";
  const shownMove = finished ? last : resolving ? move : state.move > 0 ? data.moves[state.move - 1] : undefined;
  const collected = shownMove?.collected ?? 0;
  const movesLeft = shownMove?.moves_left ?? movesTotal;

  // The agent's hand: aims at the first tile, closes on it, carries it to the
  // second, then eases off while the match resolves.
  const centre = (r: number, c: number) => ({ x: c * STEP + SIZE / 2, y: r * STEP + SIZE / 2 });
  const hand = (() => {
    if (!move || finished) return { ...centre(rows - 1, (cols - 1) / 2), shown: false, closed: false };
    const [r1, c1, r2, c2] = move.swap;
    if (kind === "rest") return { ...centre(r1, c1), shown: state.move > 0 || state.playing, closed: false, far: true };
    if (kind === "aim") return { ...centre(r1, c1), shown: true, closed: false };
    if (kind === "grab") return { ...centre(r1, c1), shown: true, closed: true };
    if (kind === "swap") return { ...centre(r2, c2), shown: true, closed: true };
    return { ...centre(r2, c2), shown: true, closed: false, far: true };
  })();

  // Effects live through the pop and the fall that follows it, so the shards
  // and the score finish their flight instead of being cut off.
  const round = (kind === "pop" || kind === "fall") && move ? move.rounds[roundIdx] : undefined;
  const gained = round ? round.matched.filter(([r, c]) => roundStart[r!]?.[c!] === targetColour).length : 0;

  return (
    <div ref={ref} className="bezel">
      <div className="screen p-4 sm:p-5">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <div>
            <p className="text-[0.95rem] font-semibold" style={{ color: colour }}>
              {label}
            </p>
            <p className="mt-0.5 font-mono text-[0.72rem] text-low">{note}</p>
          </div>
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[0.7rem]"
            style={{
              color: data.won ? "var(--color-greedy)" : "var(--color-flag)",
              background: data.won
                ? "color-mix(in srgb, var(--color-greedy) 14%, transparent)"
                : "color-mix(in srgb, var(--color-flag) 14%, transparent)",
            }}
          >
            {data.won ? "cleared" : "ran out"}
          </span>
        </div>

        <div
          className="relative mx-auto rounded-[14px] bg-black/25 p-2 shadow-[inset_0_2px_10px_rgb(0_0_0/0.45),inset_0_0_0_1px_rgb(142_160_255/0.12)]"
          style={{ width: width + 16 }}
        >
          <div
            className="relative"
            style={{ width, height }}
            role="img"
            aria-label={`${label} playing a ${rows} by ${cols} match-3 board`}
          >
            {/* empty slots, so a cleared tile leaves a hole rather than nothing */}
            {Array.from({ length: rows * cols }, (_, i) => (
              <div key={`s${i}`} className="absolute rounded-[22%] bg-white/[0.04]"
                   style={{ width: SIZE, height: SIZE, left: (i % cols) * STEP, top: Math.floor(i / cols) * STEP }} />
            ))}

            {/* aim rings on the two chosen tiles */}
            {move && !finished && (kind === "aim" || kind === "grab") &&
              [[move.swap[0], move.swap[1]], [move.swap[2], move.swap[3]]].map(([r, c], i) => (
                <div key={`aim${i}`} className="aim-ring pointer-events-none absolute rounded-[26%]"
                     style={{ width: SIZE + 8, height: SIZE + 8, left: c! * STEP - 4, top: r! * STEP - 4 }} />
              ))}

            {tiles.map(({ key, ...tile }) => (
              <Tile key={key} {...tile} size={SIZE} step={STEP} reduce={reduce} />
            ))}

            {/* the burst: shards per cleared tile, and what the round scored */}
            {round && !reduce && (
              <div key={`fx-${state.move}-${roundIdx}`} className="pointer-events-none absolute inset-0">
                {round.matched.map(([r, c], i) => {
                  const col = TILE[roundStart[r!]?.[c!] ?? 0] ?? "#fff";
                  const { x, y } = centre(r!, c!);
                  return Array.from({ length: 9 }, (_, k) => {
                    const a = (k / 9) * Math.PI * 2 + i;
                    const dist = SIZE * (0.9 + ((k * 37 + i * 11) % 10) / 14);
                    return (
                      <span key={`${i}-${k}`} className="shard absolute rounded-full"
                            style={{
                              left: x, top: y, width: SIZE * (k % 3 === 0 ? 0.3 : 0.2), height: SIZE * (k % 3 === 0 ? 0.3 : 0.2), background: k % 4 === 0 ? "#fff" : col,
                              boxShadow: `0 0 10px 1px ${col}`,
                              "--sx": `${Math.cos(a) * dist}px`, "--sy": `${Math.sin(a) * dist}px`,
                            } as CSSProperties} />
                    );
                  });
                })}
                {gained > 0 && (() => {
                  const xs = round.matched.map(([r, c]) => centre(r!, c!));
                  const cx = xs.reduce((s, p) => s + p.x, 0) / xs.length;
                  const cy = xs.reduce((s, p) => s + p.y, 0) / xs.length;
                  return (
                    <span className="score-pop absolute font-display font-bold text-white"
                          style={{ left: cx, top: cy, fontSize: SIZE * 0.55, textShadow: "0 2px 10px rgb(47 75 255 / 0.9)" }}>
                      +{gained}
                    </span>
                  );
                })()}
                {roundIdx > 0 && (
                  <span className="combo absolute left-1/2 top-2 rounded-full bg-white px-3 py-1 font-display text-[0.8rem] font-bold text-ink shadow-[0_8px_24px_-6px_rgb(142_160_255/0.9)]">
                    Combo ×{roundIdx + 1}
                  </span>
                )}
              </div>
            )}

            {/* the agent's hand */}
            {!reduce && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-10"
                style={{
                  transform: `translate(${hand.x}px, ${hand.y}px)`,
                  opacity: hand.shown ? ("far" in hand && hand.far ? 0.55 : 1) : 0,
                  transition: "transform 420ms cubic-bezier(0.77, 0, 0.175, 1), opacity 250ms ease",
                }}
              >
                <div className="-translate-x-[30%] -translate-y-[6%]">
                  <div className="relative drop-shadow-[0_6px_10px_rgb(0_0_0/0.55)]"
                       style={{ transform: hand.closed ? "scale(0.9)" : "scale(1)", transition: "transform 160ms ease-out" }}>
                    {hand.closed
                      ? <Grab size={SIZE * 0.8} strokeWidth={1.75} className="fill-white text-ink" />
                      : <Pointer size={SIZE * 0.8} strokeWidth={1.75} className="fill-white text-ink" />}
                  </div>
                  <span className="mt-0.5 block w-max rounded-full px-2 py-0.5 text-[0.62rem] font-semibold text-ink shadow-[0_4px_12px_-4px_rgb(0_0_0/0.6)]"
                        style={{ background: colour }}>
                    {label.split(",")[0]}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[0.78rem] text-mid tnum">
          <button
            type="button"
            onClick={() => { autoRun.current = false; setUserPaused(state.playing); dispatch({ type: "toggle" }); }}
            className="press rounded-full bg-white px-3.5 py-1.5 text-[0.78rem] font-semibold text-ink hover:bg-brand-soft"
          >
            {state.playing ? "Pause" : finished ? "Replay" : state.move > 0 ? "Resume" : "Play"}
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(data.moves.length - 1, 0)}
            value={Math.min(state.move, Math.max(data.moves.length - 1, 0))}
            onChange={(e) => { autoRun.current = false; setUserPaused(true); dispatch({ type: "seek", move: Number(e.target.value) }); }}
            className="flex-1 accent-[var(--color-agent)]"
            aria-label={`${label} move`}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[0.72rem] text-low tnum">
          <span className="flex flex-1 items-center gap-2">
            <span className="h-1.5 max-w-[7rem] flex-1 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-[var(--color-greedy)] transition-[width] duration-300 ease-out"
                    style={{ width: `${Math.min(collected / target, 1) * 100}%` }} />
            </span>
            {collected} / {target} tiles
          </span>
          <span>{movesLeft} moves left</span>
        </div>
      </div>
    </div>
  );
}

function Tile({
  r, c, colour, dy, dx, gone, lift, enterFrom, size: SIZE, step: STEP, reduce,
}: Omit<TileView, "key"> & { size: number; step: number; reduce: boolean }) {
  const base = TILE[colour] ?? "#333";
  return (
    <div
      className="absolute rounded-[22%]"
      style={{
        width: SIZE,
        height: SIZE,
        left: c * STEP,
        top: r * STEP,
        zIndex: lift ? 5 : 1,
        // A gem rather than a flat square: a highlight top-left, a deeper
        // bottom edge, and the colour's own glow when it is picked up.
        background: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.6), transparent 42%), linear-gradient(160deg, ${base}, color-mix(in srgb, ${base} 62%, #0a0f2c))`,
        boxShadow: lift
          ? `inset 0 1px 0 rgb(255 255 255 / 0.5), 0 10px 22px -6px ${base}, 0 0 0 2px rgb(255 255 255 / 0.9)`
          : "inset 0 1px 0 rgb(255 255 255 / 0.45), inset 0 -3px 0 rgb(0 0 0 / 0.22)",
        transform: `translate(${dx}px, ${dy}px) scale(${gone ? 1.3 : lift ? 1.1 : 1})`,
        opacity: gone ? 0 : 1,
        filter: gone ? "brightness(2.2)" : "none",
        transition: reduce
          ? "opacity 200ms ease-out"
          : "transform 320ms cubic-bezier(0.77, 0, 0.175, 1), opacity 260ms ease-out, filter 200ms ease-out, box-shadow 200ms ease-out",
        ...(enterFrom !== undefined
          ? {
              ["--drop-from" as string]: `${enterFrom}px`,
              animation: "drop 330ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          : {}),
      }}
    />
  );
}
