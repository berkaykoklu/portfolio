import Pipeline from "./pipeline";
import { JOBS, OPEN_SOURCE, PRODUCTION, RESEARCH_CHAIN, STACK } from "@/lib/content";

const CV = "/berkay-koklu-cv.pdf";
const GITHUB = "https://github.com/berkaykoklu";
const LINKEDIN = "https://www.linkedin.com/in/berkay-köklü-4777b41b9/";
const EMAIL = "kokluberkay@gmail.com";

type Case = (typeof PRODUCTION)[number] & { live?: string; code?: string };

function CaseStudy({ item }: { item: Case }) {
  return (
    <article className="case">
      <div className="case-top">
        <span className="case-no">{item.no}</span>
        <h3>{item.title}</h3>
        {item.live ? (
          <span className="tag live">Live</span>
        ) : (
          <span className="tag">Production</span>
        )}
      </div>
      <dl className="rows">
        <div className="row"><dt>Problem</dt><dd>{item.problem}</dd></div>
        <div className="row"><dt>Approach</dt><dd>{item.approach}</dd></div>
        <div className="row"><dt>Outcome</dt><dd>{item.impact}</dd></div>
        <div className="row">
          <dt>Tech</dt>
          <dd><span className="techline">{item.tech.map((t) => <span key={t}>{t}</span>)}</span></dd>
        </div>
      </dl>
      {(item.live || item.code) && (
        <div className="case-links">
          {item.live && <a className="btn key" href={item.live}>Open it</a>}
          {item.code && <a className="btn" href={item.code}>Read the code</a>}
        </div>
      )}
    </article>
  );
}

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="shell">
          <span className="who">Berkay Köklü</span>
          <div className="links">
            <a href="#work">Work</a>
            <a href="#experience" className="hide-sm">Experience</a>
            <a href="#research" className="hide-sm">Research</a>
            <a href="#contact">Contact</a>
            <a className="btn" href={CV}>CV</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="shell hero-grid">
          <div>
            <h1>Berkay Köklü</h1>
            <p className="title-pair">
              AI Engineer <span className="sep" aria-hidden="true" /> ML Researcher
            </p>
            <p className="lede">
              Building production AI systems, and researching how agents learn
              from generated worlds.
            </p>
            <p className="sub">
              I build and evaluate LLM pipelines end to end — hybrid retrieval,
              safety constraints, and the evaluation loops that show whether a
              change actually helped. My research is on constrained generative
              world models and offline reinforcement learning for sequential
              decision-making.
            </p>
            <div className="cta-row">
              <a className="btn key" href="#work">View selected work</a>
              <a className="btn" href={GITHUB}>GitHub</a>
              <a className="btn" href={CV}>Download CV</a>
            </div>
            <div className="creds">
              <div className="cred">
                <div className="v">AI Engineer since Jan 2025</div>
                <div className="l">Bizzbee, production LLM systems</div>
              </div>
              <div className="cred">
                <div className="v">M.Sc. candidate</div>
                <div className="l">Boğaziçi University, EEE</div>
              </div>
              <div className="cred">
                <div className="v">2 live systems</div>
                <div className="l">Open source, running now</div>
              </div>
            </div>
          </div>
          <Pipeline />
        </div>
      </header>

      <section id="work">
        <div className="shell">
          <div className="sec-head">
            <h2>Production work</h2>
            <p>LLM systems running for real users at Bizzbee.</p>
          </div>
          <div className="work">
            {PRODUCTION.map((item) => <CaseStudy key={item.no} item={item} />)}
          </div>
        </div>
      </section>

      <section id="open-source">
        <div className="shell">
          <div className="sec-head">
            <h2>Open source</h2>
            <p>
              Both are deployed and the code is public — open one and use it.
              Each publishes what it measured and where it failed.
            </p>
          </div>
          <div className="work">
            {OPEN_SOURCE.map((item) => <CaseStudy key={item.no} item={item} />)}
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="shell">
          <div className="sec-head"><h2>Experience</h2></div>
          <div className="tl">
            {JOBS.map((job) => (
              <div className="job" key={job.org}>
                <div className="when">{job.when}</div>
                <div>
                  <h3>{job.role}</h3>
                  <p className="org">{job.org}</p>
                  <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="research">
        <div className="shell">
          <div className="sec-head">
            <h2>Where I&rsquo;m going next</h2>
            <p>M.Sc. thesis area, and the line of work leading into it.</p>
          </div>
          <div className="chain">
            {RESEARCH_CHAIN.map((node, i) => (
              <span key={node} style={{ display: "contents" }}>
                {i > 0 && <span className="arr" aria-hidden="true">→</span>}
                <span className={`link-node ${i === RESEARCH_CHAIN.length - 1 ? "end" : ""}`}>
                  {node}
                </span>
              </span>
            ))}
          </div>
          <p style={{ color: "var(--fg-2)", maxWidth: "62ch", fontSize: ".96rem" }}>
            A world model that generates plausible trajectories lets a policy be
            trained and tested without acting in the real environment — which
            matters most exactly where acting to learn is expensive or unsafe.
            The open question I care about is constraint: a generated trajectory
            is only useful if it could actually have happened. This is early
            research, not a result.
          </p>
          <div className="case-links" style={{ borderTop: "none", paddingTop: ".4rem" }}>
            <a className="btn" href="https://github.com/berkaykoklu/ts-worldmodel-lab">
              ts-worldmodel-lab — benchmarking harness
            </a>
          </div>
        </div>
      </section>

      <section id="stack">
        <div className="shell">
          <div className="sec-head"><h2>Stack</h2></div>
          <div className="stack-grid">
            {STACK.map((col) => (
              <div className="stack-col" key={col.group}>
                <h3>{col.group}</h3>
                <p>{col.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="shell">
          <div className="contact-box">
            <h2>Building an AI team?</h2>
            <p>
              I&rsquo;m open to AI engineering, ML engineering and data science
              roles.
            </p>
            <div className="contact-row">
              <a className="btn key" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn" href={LINKEDIN}>LinkedIn</a>
              <a className="btn" href={GITHUB}>GitHub</a>
              <a className="btn" href={CV}>CV</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell" style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: ".5rem" }}>
          <span>İstanbul, Turkey</span>
          <span>Every figure on this page is checkable in the linked CV or repository.</span>
        </div>
      </footer>
    </>
  );
}
