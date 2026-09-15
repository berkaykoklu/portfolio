import type { ReactNode } from "react";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { GitHubMark, LinkedInMark } from "@/components/BrandIcons";
import CaseStudy from "@/components/CaseStudy";
import Creatives from "@/components/Creatives";
import Experience from "@/components/Experience";
import Field from "@/components/Field";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Platform from "@/components/Platform";
import Research from "@/components/Research";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import AgenticRetrieval from "@/components/diagrams/AgenticRetrieval";
import Comparison from "@/components/diagrams/Comparison";
import GraphHop from "@/components/diagrams/GraphHop";
import IngestionDiagram from "@/components/diagrams/Ingestion";
import SafetyDiagram from "@/components/diagrams/Safety";
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
 *  file untranslatable. A case with no entry here simply renders without a
 *  visual, which is the right default for one that has no diagram yet. */
function visualFor(id: string, locale: Locale): ReactNode {
  const tr = locale === "tr";
  switch (id) {
    case "agentic":
      return <AgenticRetrieval />;
    case "graph":
      return <GraphHop />;
    case "safety":
      return <SafetyDiagram />;
    case "ingestion":
      return <IngestionDiagram />;
    case "churn":
      return (
        <Comparison
          caption={tr
            ? "HER MODELİN SÖYLEDİĞİ CHURN ORANI, GERÇEKTE AYRILAN %20.4'E KARŞI"
            : "WHAT EACH MODEL SAYS THE CHURN RATE IS, AGAINST 20.4% WHO ACTUALLY LEFT"}
          scale={40}
          reference={{ value: 20.4, label: tr ? "gerçekleşen oran" : "the rate that actually occurred" }}
          decimals={1}
          unit="%"
          bars={[
            { name: tr ? "Düz" : "Plain", value: 19.4, tone: "good" },
            { name: tr ? "Sınıf ağırlıklı" : "Class-weighted", value: 34.1, tone: "bad" },
            { name: tr ? "Kalibre" : "Calibrated", value: 19.4, tone: "good" },
          ]}
        />
      );
    case "experiment":
      return (
        <Comparison
          caption={tr
            ? "KAÇ KEZ BAKILDIĞINA GÖRE, YANLIŞ SONUÇ GÖSTEREN A/A DENEYLERİNİN ORANI"
            : "SHARE OF A/A EXPERIMENTS SHOWING A FALSE RESULT, BY HOW OFTEN THEY WERE CHECKED"}
          scale={30}
          reference={{ value: 5, label: tr ? "testin vaat ettiği hata oranı" : "the error rate the test promises" }}
          decimals={1}
          unit="%"
          bars={[
            { name: tr ? "Bir kez bakıldı" : "Checked once", value: 4.8, tone: "good" },
            { name: tr ? "5 kez bakıldı" : "Checked 5 times", value: 14.1, tone: "bad" },
            { name: tr ? "12 kez bakıldı" : "Checked 12 times", value: 20.2, tone: "bad" },
            { name: tr ? "30 kez bakıldı" : "Checked 30 times", value: 28.0, tone: "bad" },
          ]}
        />
      );
    case "creative":
      return (
        <Comparison
          caption={tr
            ? "HER FİLTRENİN İLK ONUNA VERDİĞİM ORTALAMA PUAN, 5 ÜZERİNDEN"
            : "MEAN HUMAN RATING OF EACH FILTER'S TOP TEN, OUT OF 5"}
          scale={5}
          reference={{ value: 2.23, label: tr ? "hiç filtrelemeden" : "no filter at all" }}
          decimals={2}
          bars={[
            { name: tr ? "Buton alanı netliği" : "Button-area clarity", value: 2.7, tone: "good" },
            { name: tr ? "CLIP (600 MB model)" : "CLIP (600 MB model)", value: 2.6, tone: "good" },
            { name: tr ? "Marka rengi" : "Brand colour", value: 2.0, tone: "bad" },
            { name: tr ? "Farklılık" : "Distinctiveness", value: 1.7, tone: "bad" },
            { name: tr ? "Kendi kontrolüm" : "My own control", value: 3.3, tone: "flag" },
          ]}
        />
      );
    case "equity":
      return (
        <Comparison
          caption={tr
            ? "20 YILLIK RAPORDAN, HİÇ YANLIŞ İÇERİK ÇIKARILMADAN AYRIŞTIRILANLAR"
            : "ANNUAL REPORTS PARSED WITH NO WRONG CONTENT, OUT OF 20"}
          scale={20}
          reference={{ value: 14, label: tr ? "yerini aldığı regex parser" : "the regex parser it replaced" }}
          bars={[
            { name: tr ? "Saf regex" : "Pure regex", value: 14, tone: "bad" },
            { name: tr ? "Model seçer, kod keser" : "Model picks, code cuts", value: 20, tone: "good" },
          ]}
        />
      );
    default:
      return null;
  }
}

export default function Portfolio({ locale }: { locale: Locale }) {
  const b = bundle(locale);
  const { ui } = b;

  const render = (item: Case) => (
    <Reveal key={item.id}>
      <CaseStudy
        category={item.category}
        title={item.title}
        visual={visualFor(item.id, locale)}
        headline={item.headline}
        summary={item.summary}
        detail={item.detail}
        tech={item.tech}
        live={item.live}
        code={item.code}
        t={ui.caseStudy}
      />
    </Reveal>
  );

  return (
    <>
      <Field />
      {/* Turkish is written and typed but not routed yet -- pass ui.switchTo and
          ui.switchHref back in, and restore app/tr/page.tsx, to publish it. */}
      <Nav cv={CV} labels={ui.nav} />
      <Hero
        cv={CV}
        github={GITHUB}
        linkedin={LINKEDIN}
        ui={ui.hero}
        system={b.system}
        pipelineLabel={ui.pipeline.label}
      />

      <Section id="platform" accent="var(--color-sec-build)" {...ui.sections.platform}>
        <Reveal><Platform parts={b.platform} idle={ui.platformIdle(b.platform.length)} /></Reveal>
      </Section>

      <Section id="work" accent="var(--color-sec-work)" {...ui.sections.work}>
        <div className="space-y-4">{b.production.map(render)}</div>
        <Reveal>
          <p className="mt-6 max-w-[64ch] text-[0.86rem] leading-relaxed text-low">{ui.noMetrics}</p>
        </Reveal>
      </Section>

      <Section id="open-source" accent="var(--color-sec-open)" {...ui.sections.open}>
        <Reveal className="mb-10"><Creatives /></Reveal>
        <div className="space-y-4">{b.open.map(render)}</div>
      </Section>

      <Section id="research" accent="var(--color-sec-research)" {...ui.sections.research}>
        <Reveal><Research nodes={b.research} /></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-5 rounded-panel border border-brand-deep bg-brand/[0.06] p-5">
            <p className="label mb-2 !text-brand">{ui.researchNote.label}</p>
            <p className="max-w-[64ch] text-[0.95rem] leading-relaxed text-hi">{ui.researchNote.body}</p>
            <a href={WORLDMODEL} className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3.5 py-2 text-[0.83rem] font-medium transition-colors hover:bg-raised">
              {ui.researchNote.repo}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Section>

      <Section id="experience" accent="var(--color-sec-exp)" title={ui.sections.experience.title}>
        <Reveal><Experience
            jobs={b.jobs}
            labels={{
              earlier: ui.experience.earlier(b.jobs.earlier.length),
              hideEarlier: ui.experience.hideEarlier,
            }}
          /></Reveal>
      </Section>

      <Section id="stack" title={ui.sections.stack.title}>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {b.stack.map((tier, i) => (
            <Reveal key={tier.tier} delay={i * 0.04}>
              <p className="label mb-3">{tier.tier.toUpperCase()}</p>
              <div className="flex flex-wrap gap-1.5">
                {tier.items.map((item) => (
                  <span key={item} className={tier.weight === "primary"
                    ? "rounded-md border border-line-ctl bg-lifted px-2.5 py-1.5 text-[0.85rem] font-medium"
                    : "rounded-md border border-line bg-raised px-2.5 py-1.5 font-mono text-[0.76rem] text-mid"}>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="contact" title="">
        <Reveal>
          <div className="rounded-panel border border-line bg-gradient-to-br from-panel to-base p-8 text-center sm:p-14">
            <h2 className="display text-[clamp(1.8rem,4.5vw,2.6rem)]">{ui.contact.title}</h2>
            <p className="mx-auto mt-3 max-w-[38ch] text-mid">{ui.contact.lead}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[0.88rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit">
                <Mail size={15} aria-hidden="true" />{EMAIL}
              </a>
              <a href={LINKEDIN} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
                <LinkedInMark />LinkedIn
              </a>
              <a href={GITHUB} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
                <GitHubMark />GitHub
              </a>
              <a href={CV} className="inline-flex items-center gap-2 rounded-lg border border-line-ctl bg-lifted px-4 py-2.5 text-[0.88rem] font-medium transition-colors hover:bg-raised">
                <FileText size={15} aria-hidden="true" />{ui.nav.cv}
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-[84rem] flex-wrap justify-between gap-2 px-6 py-8 text-[0.8rem] text-low">
          <span>{ui.footer.place}</span>
          <span>{ui.footer.note}</span>
        </div>
      </footer>
    </>
  );
}
