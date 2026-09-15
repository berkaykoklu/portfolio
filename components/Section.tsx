import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** Sections carry a hue as a CSS variable so everything inside — rules, marks,
 *  glows — takes its colour from where it sits, without each component having
 *  to be told which section it is in. */
export default function Section({
  id, title, lead, accent, children,
}: {
  id: string;
  title: string;
  lead?: string;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative z-10 border-t border-line/70"
      style={accent ? ({ "--sec": accent } as React.CSSProperties) : undefined}
    >
      <div className="mx-auto w-full max-w-[84rem] px-6 py-24 sm:py-32">
        {title && (
          <Reveal className="mb-12">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10 shrink-0"
                style={{ background: "var(--sec, var(--color-brand))" }}
                aria-hidden="true"
              />
              <h2 className="display text-[clamp(2.1rem,5vw,3.4rem)]">{title}</h2>
            </div>
            {lead && (
              <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed text-mid">
                {lead}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
