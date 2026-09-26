import type { CSSProperties } from "react";
import { ArrowDown, Download } from "lucide-react";
import CardStack from "./CardStack";
import ShaderBackdrop from "./ShaderBackdrop";
import ScrambleText from "./ScrambleText";
import RotatingWord from "./RotatingWord";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The name is the loud moment: each line rises out of its own mask. The card
 *  stack beside it is three true facts a recruiter checks first, not
 *  decoration, and each one links to the section that backs it up. */
export default function Hero({
  cv, ui,
}: {
  cv: string;
  ui: { roleA: string; roleB: string; ledeBefore: string; focus: readonly string[]; ledeAfter: string; viewWork: string };
}) {
  return (
    <header id="top" className="relative overflow-hidden">
      {/* Ribbed light: vertical glass flutes over a cobalt glow, faded into
          the page so it reads as light through a window, not a banner. */}
      {/* Silk shader under ribbed glass, faded into the page. */}
      <ShaderBackdrop avoid="[data-hero-text]" className="[mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0)_0px,rgb(255_255_255/0.45)_18px,rgb(255_255_255/0)_36px)] mix-blend-soft-light [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]" />

      <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[84rem] items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div data-hero-text>
          <h1 className="display text-[clamp(4rem,13vw,10rem)] leading-[0.88]">
            <span className="block overflow-hidden pb-[0.06em]"><span className="unmask" style={d(80)}>Berkay</span></span>
            <span className="block overflow-hidden pb-[0.06em]"><span className="unmask" style={d(180)}>Köklü</span></span>
          </h1>

          <p className="rise mt-7 text-[clamp(1.05rem,2.4vw,1.25rem)] font-semibold tracking-[-0.01em] text-brand" style={d(420)}>
            <ScrambleText text={`${ui.roleA} / ${ui.roleB}`} delay={450} />
          </p>

          <p className="rise mt-4 max-w-[32ch] text-[clamp(1.2rem,2.6vw,1.6rem)] font-medium leading-[1.3] tracking-[-0.02em]" style={d(500)}>
            {ui.ledeBefore} <RotatingWord words={ui.focus} /> {ui.ledeAfter}
          </p>

          <div className="rise mt-10 flex flex-wrap gap-3" style={d(600)}>
            <a href="#work" className="press group inline-flex items-center gap-3 rounded-full bg-hi py-2 pl-6 pr-2 text-[0.95rem] font-semibold text-white hover:bg-brand">
              {ui.viewWork}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0.5">
                <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </a>
            <a href={cv} className="press inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-[0.95rem] font-medium shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:bg-white">
              <Download size={16} strokeWidth={1.75} aria-hidden="true" />CV
            </a>
          </div>
        </div>

        <div className="rise" style={d(350)}>
          <CardStack />
        </div>
      </div>
    </header>
  );
}
