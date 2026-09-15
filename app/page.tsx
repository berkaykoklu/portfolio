import { MINOR, PROJECTS, type Measurement, type Project } from "@/lib/projects";

const CONTACT = {
  github: "https://github.com/berkaykoklu",
  linkedin: "https://www.linkedin.com/in/berkay-köklü-4777b41b9/",
  email: "kokluberkay@gmail.com",
};

const ROLES = ["AI Engineer", "ML Engineer", "Data Scientist"];

/** Bars on a shared scale with the reference drawn through them, so a value
 *  that fails to clear it is obvious at a glance rather than needing the
 *  reader to compare two numbers in their head. */
function Strip({ measurement }: { measurement: Measurement }) {
  const { caption, scale, reference, bars, note } = measurement;
  const pct = (value: number) => `${Math.min(100, (value / scale) * 100)}%`;

  return (
    <div className="strip">
      <p className="strip-head">{caption}</p>
      <div>
        {bars.map((bar) => (
          <div className="bar" key={bar.name}>
            <span className="name">{bar.name}</span>
            <span className="track">
              <span className={`fill ${bar.verdict}`} style={{ width: pct(bar.value) }} />
              <span className="tick" style={{ left: pct(reference.value) }} data-label="" />
            </span>
            <span className="val">{bar.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="note">
        <span style={{ color: "var(--reference)", fontWeight: 600 }}>
          The vertical line is {reference.label}, at {reference.value}.
        </span>{" "}
        {note}
      </p>
    </div>
  );
}

function Entry({ project }: { project: Project }) {
  return (
    <article className="project">
      <h3>{project.title}</h3>
      <p className="problem">{project.problem}</p>
      <Strip measurement={project.measurement} />
      <p className="stack">
        {project.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </p>
      <p className="actions">
        <a className="open" href={project.live}>Open {project.name}</a>
        <a className="plain" href={project.code}>Read the code</a>
      </p>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <header className="masthead">
        <h1>Berkay Köklü</h1>
        <p className="roles">
          {ROLES.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </p>
        <p className="thesis">
          I build AI systems, then try to prove they do not work.
          <span className="q">
            Both projects below are running right now — open one and use it. Each
            shows what it measured, what it was measured against, and where it
            failed.
          </span>
        </p>
      </header>

      <h2>Projects</h2>
      {PROJECTS.map((project) => (
        <Entry key={project.name} project={project} />
      ))}

      <h2>How I work</h2>
      <div className="practice">
        <div>
          <h3>Measure, don&rsquo;t ask</h3>
          <p>
            Where a question is decidable — does this citation resolve, does this
            figure match the filing, does this image match its prompt — it is
            decided in code. Asking a language model to judge it would trade a
            guarantee for a probability.
          </p>
        </div>
        <div>
          <h3>Then attack the measurement</h3>
          <p>
            A metric that agrees with you is not the same as a metric that works.
            In creative-eval a control ran the identical arithmetic on a region
            with no rationale behind it, scored higher, and refuted the metric it
            was auditing.
          </p>
        </div>
        <div>
          <h3>Publish the gap</h3>
          <p>
            A chapter that cannot be parsed is reported missing, not guessed. A
            claim that fails verification twice is dropped, not shipped. Every
            project page ends with what it does not prove.
          </p>
        </div>
      </div>

      <h2>Smaller work</h2>
      <div className="minor">
        {MINOR.map((project) => (
          <div key={project.name}>
            <h3>{project.title}</h3>
            <p>{project.blurb}</p>
            <a href={project.code}>Read the code</a>
          </div>
        ))}
      </div>

      <h2>Get in touch</h2>
      <p className="contact">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.linkedin}>LinkedIn</a>
        <a href={CONTACT.github}>GitHub</a>
      </p>
    </>
  );
}
