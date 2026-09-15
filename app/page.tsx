import { ALSO, FEATURED, type Project } from "@/lib/projects";

/** Contact details live here rather than inline so there is one place to
 *  change them, and so an unset value renders nothing at all instead of a
 *  dead link. */
const CONTACT = {
  github: "https://github.com/berkaykoklu",
  linkedin: "",
  email: "",
  cv: "",
};

function Card({ project }: { project: Project }) {
  return (
    <article className="card live">
      <div>
        <p className="mono" style={{ fontSize: ".74rem", color: "var(--muted)" }}>
          {project.name}
        </p>
        <h3>{project.title}</h3>
      </div>
      <p className="problem">{project.problem}</p>
      <p className="finding">{project.finding}</p>
      <div className="chips">
        {project.stack.map((tech) => (
          <span className="chip" key={tech}>{tech}</span>
        ))}
      </div>
      <div className="links">
        {project.live && (
          <a className="btn primary" href={project.live}>
            Open the live site →
          </a>
        )}
        <a className="btn" href={project.code}>Read the code</a>
      </div>
    </article>
  );
}

export default function Home() {
  const hasContact = CONTACT.linkedin || CONTACT.email || CONTACT.cv;

  return (
    <>
      <header className="masthead">
        <h1>Berkay Köklü</h1>
        <p className="roles">AI Engineer · ML Engineer · Data Scientist</p>
        <p className="deck">
          Building production AI systems with Python, PyTorch and LangGraph.
          Both projects below are live — open them and try them.
        </p>
      </header>

      <h2>Projects</h2>
      <div className="cards">
        {FEATURED.map((project) => (
          <Card key={project.name} project={project} />
        ))}
      </div>

      <h2>How I work</h2>
      <div className="approach">
        <div>
          <h3>Measure, don&rsquo;t ask</h3>
          <p>
            Where a question is decidable — does this citation resolve, does this
            figure match the filing, does this image match its prompt — it gets
            decided in code. Using a language model to judge it would trade a
            guarantee for a probability.
          </p>
        </div>
        <div>
          <h3>Check the measurement</h3>
          <p>
            A metric that agrees with you is not the same as a metric that works.
            In creative-eval a control ran the identical arithmetic on a region
            with no rationale behind it, scored higher, and refuted the metric it
            was auditing. That result is on the page.
          </p>
        </div>
        <div>
          <h3>Report the gaps</h3>
          <p>
            A chapter that cannot be parsed is reported missing, not guessed. A
            claim that fails verification twice is dropped, not shipped. Every
            project page ends with what it does not prove.
          </p>
        </div>
      </div>

      <h2>Also on GitHub</h2>
      <div className="secondary">
        {ALSO.map((project) => (
          <article className="mini" key={project.name}>
            <p className="mono" style={{ fontSize: ".72rem", color: "var(--muted)" }}>
              {project.name}
            </p>
            <h3>{project.title}</h3>
            <p>{project.problem}</p>
            <div className="chips">
              {project.stack.map((tech) => (
                <span className="chip" key={tech}>{tech}</span>
              ))}
            </div>
            <div className="links">
              <a className="btn" href={project.code}>Read the code</a>
            </div>
          </article>
        ))}
      </div>

      <h2>Get in touch</h2>
      <div className="contact">
        <a className="btn" href={CONTACT.github}>GitHub</a>
        {CONTACT.linkedin && (
          <a className="btn" href={CONTACT.linkedin}>LinkedIn</a>
        )}
        {CONTACT.email && (
          <a className="btn primary" href={`mailto:${CONTACT.email}`}>Email</a>
        )}
        {CONTACT.cv && (
          <a className="btn" href={CONTACT.cv}>Download CV (PDF)</a>
        )}
      </div>
      {!hasContact && (
        <p style={{ fontSize: ".88rem", color: "var(--muted)" }}>
          More ways to reach me are on the way.
        </p>
      )}
    </>
  );
}
