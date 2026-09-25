"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import AgenticRetrieval, { CASES } from "@/components/diagrams/AgenticRetrieval";

/** The router explained one question per scroll step: the diagram stays put
 *  while the reader moves through the four questions, so they drive it rather
 *  than wait for it. */
export default function RouterStory({ intro }: { intro: ReactNode }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const still = useReducedMotion();

  useEffect(() => {
    // Steps in the centre band right now. A step entering takes over; when one
    // leaves and a single step remains, that one is active again, so a small
    // scroll back never leaves the previous step highlighted.
    const inBand = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.storyStep);
          if (e.isIntersecting) { inBand.add(i); setActive(i); } else inBand.delete(i);
        });
        if (inBand.size === 1) setActive([...inBand][0]!);
      },
      { rootMargin: "-45% 0px -45% 0px" }, // a 10% band at the viewport centre
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => refs.current[i]?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });

  return (
    <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0">
      <div>
        {intro}
        {CASES.map((c, i) => (
          <div
            key={c.q}
            ref={(el) => { refs.current[i] = el; }}
            data-story-step={i}
            className={`flex min-h-[70vh] flex-col justify-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-35"}`}
          >
            <p className="font-mono text-[0.95rem] text-brand">“{c.q}”</p>
            <p className="mt-3 max-w-[44ch] text-[1.05rem] leading-relaxed text-mid">{c.why}</p>
          </div>
        ))}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <AgenticRetrieval index={active} onIndex={jump} />
      </div>
    </div>
  );
}
