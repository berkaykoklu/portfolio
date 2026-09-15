import { ArrowDown, Download } from "lucide-react";
import SystemGraph from "./SystemGraph";
import Reveal from "./Reveal";
import { GitHubMark, LinkedInMark } from "./BrandIcons";

/** Descriptive where a number would have to be invented. "Since Jan 2025" is a
 *  date anyone can check against the CV; "2+ years" would be a claim that
 *  outruns it. */
const FACTS = [
  { k: "AI Engineer", v: "since Jan 2025", sub: "Bizzbee — production LLM systems" },
  { k: "M.Sc. candidate", v: "Boğaziçi", sub: "Electrical & Electronics Engineering" },
  { k: "Open source", v: "2 live systems", sub: "deployed, measured, documented" },
];

export default function Hero({
  cv, github, linkedin,
}: { cv: string; github: string; linkedin: string }) {
  return (
    <header id="top" className="relative z-10">
      <div className="mx-auto grid w-full max-w-[84rem] items-center gap-12 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pb-28">
        <Reveal>
          <h1 className="display text-[clamp(3.4rem,10vw,7rem)]">
            Berkay
            <br />
            Köklü
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-x-4 text-[clamp(1.05rem,2.6vw,1.35rem)] font-semibold tracking-[-0.02em]">
            <span className="text-brand">AI Engineer</span>
            <span className="h-4 w-px bg-line-ctl" aria-hidden="true" />
            <span className="text-flow">ML Engineer</span>
          </p>

          <p className="mt-7 max-w-[34ch] text-[clamp(1.25rem,3vw,1.7rem)] font-medium leading-[1.3] tracking-[-0.025em]">
            Building production AI systems, and researching how agents learn
            from generated worlds.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-[0.92rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit">
              View work
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <a href={github} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-5 py-3 text-[0.92rem] font-medium transition-colors hover:bg-raised">
              <GitHubMark />GitHub
            </a>
            <a href={linkedin} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-5 py-3 text-[0.92rem] font-medium transition-colors hover:bg-raised">
              <LinkedInMark />LinkedIn
            </a>
            <a href={cv} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-5 py-3 text-[0.92rem] font-medium transition-colors hover:bg-raised">
              <Download size={15} aria-hidden="true" />CV
            </a>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="label">{f.k.toUpperCase()}</dt>
                <dd className="mt-2 text-[clamp(1.1rem,2.4vw,1.4rem)] font-semibold tracking-[-0.03em]">{f.v}</dd>
                <dd className="mt-0.5 text-[0.76rem] leading-snug text-low">{f.sub}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <SystemGraph />
        </Reveal>
      </div>
    </header>
  );
}
