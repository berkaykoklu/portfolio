import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { GitHubMark, LinkedInMark } from "@/components/BrandIcons";
import CaseStudy from "@/components/CaseStudy";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { JOBS, OPEN_SOURCE, PRODUCTION, RESEARCH, STACK } from "@/lib/content";

const CV = "/berkay-koklu-cv.pdf";
const GITHUB = "https://github.com/berkaykoklu";
const LINKEDIN = "https://www.linkedin.com/in/berkay-köklü-4777b41b9/";
const EMAIL = "kokluberkay@gmail.com";

export default function Home() {
  return (
    <>
      <Nav cv={CV} />
      <Hero cv={CV} github={GITHUB} />

      <Section
        id="work"
        title="Production work"
        lead="LLM systems running for real users at Bizzbee. Open any card for the method."
      >
        <div className="space-y-4">
          {PRODUCTION.map((item, i) => (
            <Reveal key={item.no} delay={i * 0.05}>
              <CaseStudy item={item} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="open-source"
        title="Open source"
        lead="Both are deployed and the code is public. Each publishes what it measured — and where it failed."
      >
        <div className="space-y-4">
          {OPEN_SOURCE.map((item, i) => (
            <Reveal key={item.no} delay={i * 0.05}>
              <CaseStudy item={item} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="experience" title="Experience">
        <div>
          {JOBS.map((job, i) => (
            <Reveal key={job.org} delay={i * 0.04}>
              <div
                className={`grid gap-x-6 gap-y-1 py-6 sm:grid-cols-[9rem_1fr] ${
                  i > 0 ? "border-t border-line" : "pt-0"
                }`}
              >
                <p className="pt-0.5 font-mono text-[0.78rem] text-low tnum">
                  {job.when}
                </p>
                <div>
                  <h3 className="text-[1rem] font-semibold">{job.role}</h3>
                  <p className="mb-2.5 text-[0.88rem] text-brand">{job.org}</p>
                  <ul className="space-y-1.5">
                    {job.points.map((p) => (
                      <li
                        key={p}
                        className="relative pl-4 text-[0.91rem] leading-relaxed text-mid before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-line-ctl"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="research"
        title="Where I'm going next"
        lead="M.Sc. thesis area, and the line of work leading into it."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH.map((node, i) => (
            <Reveal key={node.name} delay={i * 0.04}>
              <div
                className={`h-full rounded-panel border bg-panel p-4 ${
                  i === RESEARCH.length - 1
                    ? "border-brand-deep bg-brand/[0.07]"
                    : "border-line"
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[0.68rem] text-brand tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[0.95rem] font-semibold">{node.name}</h3>
                </div>
                <p className="text-[0.86rem] leading-relaxed text-mid">{node.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[62ch] text-[0.95rem] leading-relaxed text-mid">
            A world model that generates plausible trajectories lets a policy be
            trained and tested without acting in the real environment — which
            matters most exactly where acting to learn is expensive or unsafe.
            The open question I care about is constraint: a generated trajectory
            is only useful if it could actually have happened. This is early
            research, not a result.
          </p>
          <a
            href="https://github.com/berkaykoklu/ts-worldmodel-lab"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3.5 py-2 text-[0.83rem] font-medium transition-colors hover:bg-raised"
          >
            ts-worldmodel-lab — benchmarking harness
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </Reveal>
      </Section>

      <Section id="stack" title="Stack">
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((col, i) => (
            <Reveal key={col.group} delay={i * 0.04}>
              <h3 className="mb-2 text-[0.79rem] font-medium text-low">{col.group}</h3>
              <p className="text-[0.92rem] leading-[1.75] text-mid">{col.items}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="contact" title="">
        <Reveal>
          <div className="rounded-panel border border-line bg-gradient-to-br from-panel to-base p-8 text-center sm:p-12">
            <h2 className="text-[clamp(1.5rem,3.4vw,2rem)] font-semibold tracking-[-0.03em]">
              Building an AI team?
            </h2>
            <p className="mx-auto mt-2 max-w-[36ch] text-mid">
              Open to AI engineering, ML engineering and data science roles.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[0.88rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit"
              >
                <Mail size={15} aria-hidden="true" />
                {EMAIL}
              </a>
              <a
                href={LINKEDIN}
                className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised"
              >
                <LinkedInMark />
                LinkedIn
              </a>
              <a
                href={GITHUB}
                className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised"
              >
                <GitHubMark />
                GitHub
              </a>
              <a
                href={CV}
                className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised"
              >
                <FileText size={15} aria-hidden="true" />
                CV
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 px-6 py-8 text-[0.82rem] text-low">
          <span>İstanbul, Turkey</span>
          <span>Every figure here is checkable in the linked CV or repository.</span>
        </div>
      </footer>
    </>
  );
}
