import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative z-10 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <Reveal className="mb-10">
          <h2 className="text-[clamp(1.6rem,3.4vw,2.1rem)] font-semibold tracking-[-0.03em]">
            {title}
          </h2>
          {lead && <p className="mt-2 max-w-2xl text-mid">{lead}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
