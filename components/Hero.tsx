import { ArrowDown, Download } from "lucide-react";
import { GitHubMark } from "./BrandIcons";
import RagPipeline from "./RagPipeline";
import Reveal from "./Reveal";

const CREDS = [
  { v: "AI Engineer since Jan 2025", l: "Bizzbee — production LLM systems" },
  { v: "M.Sc. candidate", l: "Boğaziçi University, EEE" },
  { v: "2 systems running now", l: "Open source, open to use" },
];

export default function Hero({ cv, github }: { cv: string; github: string }) {
  return (
    <header id="top" className="relative z-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24">
        <Reveal>
          <h1 className="text-[clamp(2.6rem,6.5vw,4.2rem)] font-semibold leading-[1] tracking-[-0.04em]">
            Berkay Köklü
          </h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(0.95rem,2.2vw,1.05rem)] font-medium text-brand">
            AI Engineer
            <span className="h-[3px] w-[3px] rounded-full bg-brand-deep" aria-hidden="true" />
            ML Researcher
          </p>

          <p className="mt-6 max-w-[30ch] text-[clamp(1.1rem,2.4vw,1.3rem)] font-medium leading-[1.4] tracking-[-0.015em]">
            Building production AI systems, and researching how agents learn from
            generated worlds.
          </p>

          <p className="mt-4 max-w-[50ch] text-[0.96rem] leading-relaxed text-mid">
            I build and evaluate LLM pipelines end to end — hybrid retrieval,
            safety constraints, and the evaluation loops that show whether a
            change actually helped. My research is on constrained generative
            world models and offline reinforcement learning for sequential
            decision-making.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[0.88rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit"
            >
              View selected work
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <a
              href={github}
              className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised"
            >
              <GitHubMark />
              GitHub
            </a>
            <a
              href={cv}
              className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised"
            >
              <Download size={15} aria-hidden="true" />
              CV
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
            {CREDS.map((c) => (
              <div key={c.v}>
                <dt className="text-[0.93rem] font-semibold tracking-[-0.01em]">{c.v}</dt>
                <dd className="mt-0.5 text-[0.79rem] text-low">{c.l}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <RagPipeline />
        </Reveal>
      </div>
    </header>
  );
}
