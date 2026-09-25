import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { Curves } from "@/components/match3/Curves";
import { Replay } from "@/components/match3/Replay";
import { Skill } from "@/components/match3/Skill";
import { bundle } from "@/lib/bundle";
import { replays } from "@/lib/match3/replays";
import { PLAYERS, mean, results } from "@/lib/match3/results";

const REPO = "https://github.com/berkaykoklu/match3-rl";
const CV = "/berkay-koklu-cv.pdf";

const DESCRIPTION =
  "A match-3 game, agents that learn to play it, and the finding that a level's difficulty is not one number: it depends on who is holding the controller.";

export const metadata: Metadata = {
  title: "Difficulty depends on who is playing | match3-rl",
  description: DESCRIPTION,
  openGraph: { title: "Difficulty depends on who is playing", description: DESCRIPTION, type: "article", locale: "en" },
  alternates: { canonical: "/projects/match3-rl" },
};

const pct = (v: number) => `${Math.round(v * 100)}%`;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The level and player the hero plays on a loop: a clear, mid-game win, so
 *  the first thing a visitor sees is the game working. */
const HERO_LEVEL = 20;
const HERO_PLAYER = "greedy";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[72rem] px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="display max-w-[18ch] text-[clamp(2.2rem,5.5vw,4rem)]">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

const Prose = ({ children }: { children: ReactNode }) => (
  <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-mid">{children}</p>
);

export default function Match3Page() {
  const averages = Object.fromEntries(
    PLAYERS.filter((p) => results.solve_rate[p.key]).map((p) => [
      p.key,
      mean(results.solve_rate[p.key] as number[]),
    ]),
  ) as Record<string, number>;

  const gaps = results.skill_sensitivity;
  const peak = Math.max(...gaps);
  const peakLevel = results.levels[gaps.indexOf(peak)]?.number ?? 0;
  const flat = gaps.filter((g) => g < 0.05).length;
  const spikeCount = Object.values(results.spikes).reduce((a, b) => a + b.length, 0);
  const curves = results.learning_curves;

  const heroLevel = results.levels.find((l) => l.number === HERO_LEVEL);
  const heroReplay = replays[String(HERO_LEVEL)]?.[HERO_PLAYER];
  const heroPlayer = PLAYERS.find((p) => p.key === HERO_PLAYER)!;

  return (
    <>
      <Nav cv={CV} labels={bundle("en").ui.nav} />

      <header className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_30%,transparent_95%)]">
          <div className="absolute -right-[10%] -top-[20%] h-[90%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(47_75_255/0.5),rgb(77_216_232/0.22)_55%,transparent)] blur-2xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0)_0px,rgb(255_255_255/0.55)_18px,rgb(255_255_255/0)_36px)] mix-blend-soft-light" />
        </div>

        <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[72rem] items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="display text-[clamp(3rem,8vw,6.2rem)] leading-[0.92]">
              <span className="block overflow-hidden pb-[0.08em]"><span className="unmask" style={d(80)}>Difficulty</span></span>
              <span className="block overflow-hidden pb-[0.08em]"><span className="unmask" style={d(170)}>depends on</span></span>
              <span className="block overflow-hidden pb-[0.08em]"><span className="unmask text-brand" style={d(260)}>who is playing</span></span>
            </h1>
            <p className="rise mt-7 max-w-[46ch] text-[1.12rem] leading-relaxed text-mid" style={d(480)}>
              Studios tune level difficulty by watching bots play, because waiting for real
              players means shipping the wall before you know it is there. So I built the
              game, trained an agent on it, and asked how hard each level is. The answer
              was not a number. It was a number per player.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={d(600)}>
              <a href="#curves" className="press group inline-flex items-center gap-3 rounded-full bg-hi py-2 pl-6 pr-2 text-[0.95rem] font-semibold text-white hover:bg-brand">
                See the result
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0.5">↓</span>
              </a>
              <a href={REPO} className="press inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-[0.95rem] font-medium shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:bg-white">
                Code and every number
              </a>
            </div>
          </div>

          {heroReplay && heroLevel && (
            <div className="rise mx-auto w-full max-w-[26rem]" style={d(350)}>
              <Replay
                data={heroReplay}
                label={`${heroPlayer.label}, level ${heroLevel.number}`}
                colour={heroPlayer.colour}
                note={`${heroLevel.target} tiles in ${heroLevel.moves} moves`}
                target={heroLevel.target}
                movesTotal={heroLevel.moves}
                targetColour={heroLevel.colour}
                size={42}
                autoplay
              />
            </div>
          )}
        </div>
      </header>

      <div id="curves" className="scroll-mt-16" />
      <Section title="Clear rate by level">
        <Reveal className="mt-10"><Curves /></Reveal>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLAYERS.filter((p) => averages[p.key] !== undefined).map((p, i) => (
            <Reveal key={p.key} delay={i * 0.070}>
              <div className="bezel h-full">
                <div className="bezel-core h-full p-5">
                  <p className="label">{p.label}</p>
                  <p className="display tnum mt-2 text-[2.8rem] leading-none" style={{ color: p.colour }}>
                    {pct(averages[p.key] as number)}
                  </p>
                  <p className="mt-2 text-[0.82rem] text-low">across all 40 levels</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Prose>
            Ten times the training moved the agent from{" "}
            <strong className="text-hi">{pct(averages.agent_200k ?? 0)}</strong> to{" "}
            <strong className="text-hi">{pct(averages.agent ?? 0)}</strong>. A twenty-line
            greedy rule, which simply takes whichever swap clears the most target tiles
            right now, still reaches{" "}
            <strong className="text-hi">{pct(averages.greedy ?? 0)}</strong>. That gap is
            the honest result: PPO learns, more training helps, and in this environment a
            one-move heuristic is still ahead of it.
          </Prose>
        </Reveal>
      </Section>

      <Section title="Watch the gap">
        <Reveal>
          <Prose>
            Every player below is dealt the identical starting board, so what differs is
            the choices, not the luck. One deal is still one deal: on levels 3 and 20
            every player clears it, and on level 31 every player runs out, with the
            random player collecting more tiles than greedy. What the boards show is how
            each one plays, not who wins. The curves above are the measurement; these
            are one episode inside them.
          </Prose>
        </Reveal>

        {results.replay_levels.map((number) => {
          const level = results.levels.find((l) => l.number === number);
          const set = replays[String(number)];
          if (!level || !set) return null;
          return (
            <div key={number} className="mt-14">
              <Reveal>
                <p className="mb-4 inline-flex rounded-full bg-brand-soft px-3.5 py-1.5 text-[0.85rem] font-semibold text-brand">
                  Level {level.number}: {level.target} tiles in {level.moves} moves
                </p>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {PLAYERS.filter((p) => set[p.key]).map((p, i) => (
                  <Reveal key={p.key} delay={i * 0.080}>
                    <Replay
                      data={set[p.key]!}
                      label={p.label}
                      colour={p.colour}
                      note={p.note}
                      target={level.target}
                      movesTotal={level.moves}
                      targetColour={level.colour}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="Which levels reward playing well">
        <Reveal>
          <Prose>
            Subtracting the random player&rsquo;s clear rate from the greedy player&rsquo;s
            gives a number per level: how much skill is worth there. It peaks at{" "}
            <strong className="text-hi">{pct(peak)}</strong> on level{" "}
            <strong className="text-hi">{peakLevel}</strong>. On{" "}
            <strong className="text-hi">{flat}</strong> levels it is under five points.
            Those levels cannot tell a careful player from a careless one, which is worth
            knowing before shipping them as a tutorial.
          </Prose>
        </Reveal>
        <Reveal className="mt-10"><Skill /></Reveal>
      </Section>

      <Section title="The walls that were not there">
        <Reveal>
          <Prose>
            A spike detector looks for a level-to-level drop too large to be chance. My
            first version used one fixed threshold for every curve, and flagged three
            walls on the greedy curve. They were measured with sixty episodes against the
            others&rsquo; two hundred; re-measured with five times as many, those drops
            fell from twenty-odd points to single digits. They were never levels. They
            were the sample size.
          </Prose>
          <Prose>
            The threshold now scales with the measurement behind it:{" "}
            {results.spike_sigmas} standard errors of a difference in proportions, so a
            curve built from fewer episodes has to clear a higher bar.
          </Prose>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLAYERS.filter((p) => results.spike_threshold[p.key] !== undefined).map((p, i) => (
            <Reveal key={p.key} delay={i * 0.070}>
              <div className="bezel h-full">
                <div className="bezel-core h-full p-5">
                  <p className="font-semibold" style={{ color: p.colour }}>{p.label}</p>
                  <p className="mt-3 font-mono text-[0.84rem] text-mid tnum">
                    {results.episodes_per_level[p.key]} episodes/level
                  </p>
                  <p className="mt-1 font-mono text-[0.84rem] text-mid tnum">
                    threshold {(results.spike_threshold[p.key] as number).toFixed(3)}
                  </p>
                  <p className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[0.8rem] font-medium"
                     style={{ color: p.colour, background: `color-mix(in srgb, ${p.colour} 12%, transparent)` }}>
                    {results.spikes[p.key]?.length
                      ? `spikes: ${results.spikes[p.key]!.join(", ")}`
                      : "no spikes"}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Prose>
            {spikeCount === 0
              ? "Nothing survives the threshold on any curve, which is the right answer, because the level table was built as a straight line. A detector that always finds something is not a detector."
              : `${spikeCount} drop${spikeCount === 1 ? "" : "s"} clear the threshold. The level table was built as a straight line, so anything flagged is worth opening before it is believed.`}
          </Prose>
        </Reveal>
      </Section>

      {curves ? (
        <Section title="The PPO is mine, and checked">
          <Reveal>
            <Prose>
              Every number above rests on an agent, so the algorithm behind it had to be
              verified rather than trusted. I wrote PPO out (actor and critic, advantage
              estimation, the clipped objective, action masking) and trained it on the
              same environment as{" "}
              <code className="rounded bg-brand-soft px-1.5 py-0.5 font-mono text-[0.9rem] text-brand">stable-baselines3</code>,
              for the same number of steps, from the same seed.
            </Prose>
          </Reveal>
          <Reveal className="mt-10">
            <div className="bezel">
              <div className="screen grid gap-8 p-7 sm:grid-cols-3 sm:p-10">
                <div>
                  <p className="text-[0.85rem] font-medium text-mid">Mine</p>
                  <p className="display tnum mt-2 text-[3rem] leading-none text-agent">
                    {mean(curves.ours.slice(-Math.ceil(curves.ours.length / 2))).toFixed(3)}
                  </p>
                  <p className="mt-2 text-[0.82rem] text-low">mean episode reward, last half</p>
                </div>
                <div>
                  <p className="text-[0.85rem] font-medium text-mid">Reference</p>
                  <p className="display tnum mt-2 text-[3rem] leading-none text-greedy">
                    {mean(curves.sb3.slice(-Math.ceil(curves.sb3.length / 2))).toFixed(3)}
                  </p>
                  <p className="mt-2 text-[0.82rem] text-low">stable-baselines3</p>
                </div>
                <div>
                  <p className="text-[0.85rem] font-medium text-mid">Updates</p>
                  <p className="display tnum mt-2 text-[3rem] leading-none">
                    {Math.min(curves.ours.length, curves.sb3.length)}
                  </p>
                  <p className="mt-2 text-[0.82rem] text-low">compared point for point</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <Prose>
              The verdict was decided before the run: the two agree if the mean gap
              between the curves is smaller than the spread of the reference curve itself.
              It was.
            </Prose>
          </Reveal>
        </Section>
      ) : null}

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[72rem] flex-wrap items-center justify-between gap-4 px-6 py-10 text-[0.9rem] text-mid">
          <p className="max-w-[52ch]">
            Every figure on this page is read from a results file produced by the
            repository, including the ones that went against me.
          </p>
          <a href={REPO} className="press rounded-full bg-hi px-5 py-2.5 font-medium text-white hover:bg-brand">
            Code and every number
          </a>
        </div>
      </footer>
    </>
  );
}
