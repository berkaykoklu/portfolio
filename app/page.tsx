import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Creatives from "@/components/Creatives";
import Field from "@/components/Field";
import { GitHubMark, LinkedInMark } from "@/components/BrandIcons";
import CaseStudy from "@/components/CaseStudy";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Platform from "@/components/Platform";
import Research from "@/components/Research";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Comparison from "@/components/diagrams/Comparison";
import IngestionDiagram from "@/components/diagrams/Ingestion";
import RetrievalDiagram from "@/components/diagrams/Retrieval";
import SafetyDiagram from "@/components/diagrams/Safety";
import { STACK } from "@/lib/content";

const CV = "/berkay-koklu-cv.pdf";
const GITHUB = "https://github.com/berkaykoklu";
// Percent-encoded rather than literal: browsers encode the non-ASCII form on
// the way out, but the encoded URL is the one LinkedIn actually published.
const LINKEDIN =
  "https://www.linkedin.com/in/berkay-k%C3%B6kl%C3%BC-4777b41b9/";
const EMAIL = "kokluberkay@gmail.com";

export default function Home() {
  return (
    <>
      <Field />
      <Nav cv={CV} />
      <Hero cv={CV} github={GITHUB} linkedin={LINKEDIN} />

      <Section
        id="platform"
        accent="var(--color-sec-build)"
        title="What I build"
        lead="Six parts of one production AI platform. Pick one to see what it does and where it shows up below."
      >
        <Reveal><Platform /></Reveal>
      </Section>

      <Section
        id="work"
        accent="var(--color-sec-work)"
        title="Production work"
        lead="Systems running for real users at Bizzbee. Diagrams first; the method is one click away."
      >
        <div className="space-y-4">
          <Reveal>
            <CaseStudy
              category="RETRIEVAL / RAG"
              title="Hybrid retrieval for a multi-tenant support platform"
              visual={<RetrievalDiagram />}
              summary="Built a hybrid retrieval pipeline combining dense vector search with lexical search for a production customer-service platform, tuned across multilingual collections."
              detail="Dense retrieval matches on meaning, so it handles paraphrase and misses exact tokens — order numbers, SKUs, product names. Lexical search fails the other way. Customers routinely use both in one sentence. Running both arms and fusing the result sets covers each method's blind spot, and retrieval is scoped per tenant because one deployment serves many."
              tech={["Python", "Vector search", "BM25", "LangChain", "Embeddings"]}
            />
          </Reveal>
          <Reveal>
            <CaseStudy
              category="SAFETY / GUARDRAILS"
              title="Safety constraints and PII anonymisation on model output"
              visual={<SafetyDiagram />}
              summary="Built moderation and personal-data anonymisation into the output path itself, with constraints configurable per deployment."
              detail="A model with access to customer records will repeat them. Moderation cannot be one fixed rule either, since tenants differ in what may be said and stored. Putting the checks on the output path — rather than beside it — means every answer travels through them, and making the constraints configuration rather than code means the rule changes without the pipeline changing."
              tech={["Python", "Moderation", "PII detection", "FastAPI"]}
            />
          </Reveal>
          <Reveal>
            <CaseStudy
              category="DATA / INGESTION"
              title="Document ingestion and chunking"
              visual={<IngestionDiagram />}
              summary="Built ingestion and chunking pipelines for structured and unstructured sources, shaping chunk boundaries so retrieved context stays coherent."
              detail="Retrieval quality is decided before retrieval runs. A chunk that splits mid-argument comes back as noise however good the search is, and sources arrive in formats that break differently. One path handles both, with boundaries chosen so what comes back is readable in isolation."
              tech={["Python", "Document parsing", "Chunking", "MongoDB"]}
            />
          </Reveal>
          <Reveal>
            <CaseStudy
              category="EVALUATION"
              title="Evaluation pipelines and feedback loops"
              visual={
                <div className="rounded-panel border border-line bg-base/60 p-5">
                  <p className="label mb-3">WITHOUT MEASUREMENT / WITH</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-line bg-raised p-4">
                      <p className="font-mono text-[0.75rem] text-block">CHANGE → ?</p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-mid">
                        A prompt or retriever is edited. Behaviour moves. Nobody can say in which direction, or whether to keep it.
                      </p>
                    </div>
                    <div className="rounded-lg border border-brand-deep bg-brand/[0.07] p-4">
                      <p className="font-mono text-[0.75rem] text-ok">CHANGE → SCORE → KEEP / REVERT</p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-mid">
                        The same change is scored against a fixed set before it ships, and production feedback goes back into the set.
                      </p>
                    </div>
                  </div>
                </div>
              }
              summary="Built evaluation pipelines and feedback loops that quantify model behaviour in production, so each iteration is judged rather than guessed."
              detail="Without measurement, changing a prompt or a retriever is a guess, and production behaviour drifts with nobody able to name the direction. The loop closes when production interactions feed back into the set a change is judged against — otherwise the evaluation slowly stops resembling what users actually ask."
              tech={["Python", "LLM evaluation", "Feedback loops"]}
            />
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-6 max-w-[64ch] text-[0.86rem] leading-relaxed text-low">
            No performance figures appear on these four. The work is under NDA-shaped
            constraints and nothing was measured into a number I can publish and
            stand behind. The measured results are in the open-source work below,
            where anyone can reproduce them.
          </p>
        </Reveal>
      </Section>

      <Section
        id="open-source"
        accent="var(--color-sec-open)"
        title="Open source"
        lead="Built outside work, deployed, and measured. Both publish what they found — including where the result went against me."
      >
        <Reveal className="mb-10">
          <Creatives />
        </Reveal>

        <div className="space-y-4">
          <Reveal>
            <CaseStudy
              category="GENERATIVE AI / EVALUATION"
              title="creative-eval — do automatic quality filters agree with a human?"
              visual={
                <Comparison
                  caption="MEAN HUMAN RATING OF EACH FILTER'S TOP TEN, OUT OF 5"
                  scale={5}
                  reference={{ value: 2.23, label: "no filter at all" }}
                  decimals={2}
                  bars={[
                    { name: "Button-area clarity", value: 2.7, tone: "good" },
                    { name: "CLIP (600 MB model)", value: 2.6, tone: "good" },
                    { name: "Brand colour", value: 2.0, tone: "bad" },
                    { name: "Distinctiveness", value: 1.7, tone: "bad" },
                    { name: "My own control", value: 3.3, tone: "flag" },
                  ]}
                />
              }
              headline={{ value: "5 lines", caption: "of arithmetic beat a 600 MB vision model — then a control beat both" }}
              summary="Generated sixty ad creatives, scored them four ways automatically, rated all sixty blind, and measured whether the scores agree with the human."
              detail="Thresholds were calibrated before any rating existed, so they could not be tuned toward a result. The best real filter reached rank correlation 0.59 against CLIP's 0.21. Then a control — the identical arithmetic run on a region with no rationale behind it — scored 0.69, which means the best filter was measuring visual calmness rather than ad suitability, and the domain rationale was written after the numbers arrived. That is published as the headline on the project rather than a footnote."
              tech={["PyTorch", "Diffusers", "CLIP", "NumPy", "Next.js"]}
              live="https://creative-eval.vercel.app"
              code="https://github.com/berkaykoklu/creative-eval"
            />
          </Reveal>
          <Reveal>
            <CaseStudy
              category="AGENTS / RETRIEVAL"
              title="equity-research-agent — notes that cannot cite what does not exist"
              visual={
                <Comparison
                  caption="ANNUAL REPORTS PARSED WITH NO WRONG CONTENT, OUT OF 20"
                  scale={20}
                  reference={{ value: 14, label: "the regex parser it replaced" }}
                  bars={[
                    { name: "Pure regex", value: 14, tone: "bad" },
                    { name: "Model picks, code cuts", value: 20, tone: "good" },
                  ]}
                />
              }
              headline={{ value: "0", caption: "wrong chapters across 20 filings, against 14 of 20 before" }}
              summary="A LangGraph agent that turns a ticker into a research note where every claim carries the filing passage behind it and every figure comes from the company's own filed data."
              detail="The model never writes a number: it names a metric, and code looks that name up in the company's XBRL data and attaches the real tag, period and value. A deterministic checker — not a model judging a model — runs at generation time and again as the CI gate; a claim whose citation does not resolve is rewritten twice and then dropped rather than shipped. Chapter boundaries are chosen by a model and cut by code, which is what took the parser from 14 of 20 to nothing wrong across all 20."
              tech={["LangGraph", "Python", "pgvector", "FastAPI", "Opik"]}
              live="https://equity-research-agent-one.vercel.app"
              code="https://github.com/berkaykoklu/equity-research-agent"
            />
          </Reveal>
        </div>
      </Section>

      <Section
        id="research"
        accent="var(--color-sec-research)"
        title="Where I'm going next"
        lead="M.Sc. thesis direction, and the chain of work leading into it. Early research — there are no results here yet."
      >
        <Reveal><Research /></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-5 rounded-panel border border-brand-deep bg-brand/[0.06] p-5">
            <p className="label mb-2 !text-brand">THE OPEN QUESTION</p>
            <p className="max-w-[64ch] text-[0.95rem] leading-relaxed text-hi">
              A world model that generates plausible trajectories lets a policy be
              trained and tested without acting in the real environment — which
              matters most exactly where acting to learn is expensive or unsafe.
              The part I care about is constraint: a generated trajectory is only
              useful if it could actually have happened.
            </p>
            <a
              href="https://github.com/berkaykoklu/ts-worldmodel-lab"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3.5 py-2 text-[0.83rem] font-medium transition-colors hover:bg-raised"
            >
              ts-worldmodel-lab — benchmarking harness
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Section>

      <Section id="experience" accent="var(--color-sec-exp)" title="Experience">
        <Reveal><Experience /></Reveal>
      </Section>

      <Section id="stack" title="Stack">
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {STACK.map((tier, i) => (
            <Reveal key={tier.tier} delay={i * 0.04}>
              <p className="label mb-3">{tier.tier.toUpperCase()}</p>
              <div className="flex flex-wrap gap-1.5">
                {tier.items.map((item) => (
                  <span
                    key={item}
                    className={
                      tier.weight === "primary"
                        ? "rounded-md border border-line-ctl bg-lifted px-2.5 py-1.5 text-[0.85rem] font-medium"
                        : "rounded-md border border-line bg-raised px-2.5 py-1.5 font-mono text-[0.76rem] text-mid"
                    }
                  >
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
            <h2 className="display text-[clamp(1.8rem,4.5vw,2.6rem)]">
              Building an AI team?
            </h2>
            <p className="mx-auto mt-3 max-w-[38ch] text-mid">
              Open to AI engineering, ML engineering and data science roles.
            </p>
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
                <FileText size={15} aria-hidden="true" />CV
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-2 px-6 py-8 text-[0.8rem] text-low">
          <span>İstanbul, Turkey</span>
          <span>Every figure here is checkable in the linked CV or repository.</span>
        </div>
      </footer>
    </>
  );
}
