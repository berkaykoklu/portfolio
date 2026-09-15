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
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-14 pt-14 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-20">
        <Reveal>
          <h1 className="display text-[clamp(2.8rem,7vw,4.6rem)]">Berkay Köklü</h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 text-[clamp(0.95rem,2.2vw,1.08rem)] font-medium text-brand">
            AI Engineer
            <span className="h-[3px] w-[3px] rounded-full bg-brand-deep" aria-hidden="true" />
            ML Engineer
          </p>

          <p className="mt-6 max-w-[32ch] text-[clamp(1.15rem,2.6vw,1.4rem)] font-medium leading-[1.35] tracking-[-0.02em]">
            Building production AI systems, and researching how agents learn
            from generated worlds.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href="#work" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[0.88rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit">
              View work
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <a href={github} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
              <GitHubMark />GitHub
            </a>
            <a href={linkedin} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
              <LinkedInMark />LinkedIn
            </a>
            <a href={cv} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
              <Download size={15} aria-hidden="true" />CV
            </a>
          </div>

          <dl className="mt-10 grid gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="label">{f.k.toUpperCase()}</dt>
                <dd className="mt-1.5 text-[1.02rem] font-semibold tracking-[-0.02em]">{f.v}</dd>
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
