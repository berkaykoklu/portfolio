import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id, title, lead, children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-20">
      <div className="mx-auto w-full max-w-[84rem] px-6 py-24 sm:py-36">
        {title && (
          <Reveal className="mb-16">
            <h2 className="display max-w-[16ch] text-[clamp(2.8rem,7vw,5.2rem)]">{title}</h2>
            {lead && (
              <p className="mt-5 max-w-[56ch] text-[1.1rem] leading-relaxed text-mid">
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
