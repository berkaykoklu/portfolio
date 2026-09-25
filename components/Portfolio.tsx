import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { GitHubMark, LinkedInMark } from "@/components/BrandIcons";
import CaseStudy from "@/components/CaseStudy";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Research from "@/components/Research";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import AgenticRetrieval from "@/components/diagrams/AgenticRetrieval";
import GraphHop from "@/components/diagrams/GraphHop";
import EvalLoop from "@/components/diagrams/EvalLoop";
import Match3Curves from "@/components/diagrams/Match3Curves";
import { bundle } from "@/lib/bundle";
import type { Case } from "@/lib/cases";
import type { Locale } from "@/lib/copy";

const CV = "/berkay-koklu-cv.pdf";
const GITHUB = "https://github.com/berkaykoklu";
const LINKEDIN = "https://www.linkedin.com/in/berkay-k%C3%B6kl%C3%BC-4777b41b9/";
const EMAIL = "kokluberkay@gmail.com";
const WORLDMODEL = "https://github.com/berkaykoklu/ts-worldmodel-lab";

/** Diagrams are looked up by case id rather than stored with the copy: a React
 *  component is not content, and putting one in the data file would make the
 *  file untranslatable. A case with no entry renders without a visual. */
function visualFor(id: string): ReactNode {
  switch (id) {
    case "agentic": return <AgenticRetrieval />;
    case "graph": return <GraphHop />;
    case "evaluation": return <EvalLoop />;
    case "match3": return <Match3Curves />;
    default: return null;
  }
}

export default function Portfolio({ locale }: { locale: Locale }) {
  const b = bundle(locale);
  const { ui } = b;

  const render = (item: Case, i: number) => (
    <Reveal key={item.id}>
      <CaseStudy
        category={item.category}
        title={item.title}
        visual={visualFor(item.id)}
        headline={item.headline}
        summary={item.summary}
        detail={item.detail}
        tech={item.tech}
        live={item.live}
        code={item.code}
        t={ui.caseStudy}
        flip={i % 2 === 1}
        wide={item.id === "evaluation"}
      />
    </Reveal>
  );

  return (
    <>
      {/* Turkish is written and typed but not routed yet -- pass ui.switchTo and
          ui.switchHref back in, and restore app/tr/page.tsx, to publish it. */}
      <Nav cv={CV} labels={ui.nav} />
      <Hero cv={CV} ui={ui.hero} />

      {/* One marquee on the page: the stack is breadth, not a list to read. */}
      <Marquee label={ui.sections.stack.title} items={b.stack.flatMap((tier) => tier.items)} />

      <Section id="work" {...ui.sections.work}>
        <div className="space-y-28 sm:space-y-36">{b.production.map(render)}</div>
        <Reveal>
          <p className="mt-20 max-w-[64ch] text-[0.95rem] leading-relaxed text-mid">{ui.noMetrics}</p>
        </Reveal>
      </Section>

      <Section id="open-source" {...ui.sections.open}>
        <div className="space-y-24">{b.open.map((item) => render(item, 0))}</div>
      </Section>

      <Section id="research" {...ui.sections.research}>
        <Reveal><Research nodes={b.research} /></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-6 rounded-[28px] bg-brand p-8 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_30px_60px_-30px_rgb(47_75_255/0.8)] sm:p-12">
            <p className="max-w-[52ch] text-[clamp(1.1rem,2vw,1.35rem)] font-medium leading-[1.5]">{ui.researchNote.body}</p>
            <a href={WORLDMODEL} className="press group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[0.9rem] font-semibold text-hi">
              {ui.researchNote.repo}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </span>
            </a>
          </div>
        </Reveal>
      </Section>

      <Section id="experience" title={ui.sections.experience.title}>
        <Reveal>
          <Experience
            jobs={b.jobs}
            labels={{
              earlier: ui.experience.earlier(b.jobs.earlier.length),
              hideEarlier: ui.experience.hideEarlier,
            }}
          />
        </Reveal>
      </Section>

      <section id="contact" className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[84rem] px-6 pb-16 pt-24 sm:pt-36">
          <Reveal>
            <h2 className="display max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)] leading-[0.9]">{ui.contact.title}</h2>
            <p className="mt-6 max-w-[48ch] text-[1.15rem] text-mid">{ui.contact.lead}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="press group inline-flex items-center gap-4 rounded-full bg-hi py-2 pl-7 pr-2 text-[clamp(1rem,2.4vw,1.25rem)] font-semibold text-white hover:bg-brand">
                {EMAIL}
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
              </a>
              <a href={LINKEDIN} className="press inline-flex items-center gap-2 rounded-full bg-panel px-5 py-3.5 text-[0.95rem] font-medium shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:shadow-[0_0_0_1px_rgb(18_21_29/0.25)]">
                <LinkedInMark />LinkedIn
              </a>
              <a href={GITHUB} className="press inline-flex items-center gap-2 rounded-full bg-panel px-5 py-3.5 text-[0.95rem] font-medium shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:shadow-[0_0_0_1px_rgb(18_21_29/0.25)]">
                <GitHubMark />GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[84rem] flex-wrap justify-between gap-2 px-6 py-8 text-[0.85rem] text-low">
          <span>{ui.footer.place}</span>
          <span>{ui.footer.note}</span>
        </div>
      </footer>
    </>
  );
}
