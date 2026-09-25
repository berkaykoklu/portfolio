"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import Drawer from "@/components/Drawer";
import { ArrowUpRight, Code2, Plus } from "lucide-react";

export type Headline = { value: string; caption: string };

/** Counts a figure like "63pp" up from zero the first time it is seen, writing
 *  straight to the DOM so the count never re-renders React. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const still = useReducedMotion();
  const m = value.match(/^(\d+)(.*)$/);

  // Start from zero before first paint, so the final figure never flashes
  // and then drops when the count begins.
  useLayoutEffect(() => {
    if (m && !still && ref.current && !inView) ref.current.textContent = `0${m[2]}`;
  }, []);

  useEffect(() => {
    if (!m || !inView || still || !ref.current) return;
    const el = ref.current;
    const target = Number(m[1]);
    const c = animate(0, target, {
      duration: 1.4,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => { el.textContent = `${Math.round(v)}${m[2]}`; },
    });
    return () => c.stop();
  }, [inView, still, m?.[1], m?.[2]]);

  return <span ref={ref}>{value}</span>;
}

/** Text on one side, the working diagram on the other; `flip` swaps sides so
 *  consecutive cases do not repeat the same composition. The method, the only
 *  part that needs paragraphs, waits behind a click. */
export default function CaseStudy({
  category, title, visual, headline, summary, detail, tech, live, code, t, flip = false, wide = false,
}: {
  category: string;
  title: string;
  visual?: ReactNode;
  headline?: Headline;
  summary: string;
  detail: string;
  tech: string[];
  live?: string;
  code?: string;
  t: { show: string; open: string; code: string; live: string; production: string };
  flip?: boolean;
  /** Visual spans the full width under the text instead of beside it. */
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <article className={`grid items-center gap-10 [&>*]:min-w-0 ${visual && !wide ? "lg:grid-cols-[0.8fr_1.2fr] lg:gap-14" : ""}`}>
      <div className={flip && visual && !wide ? "lg:order-2" : ""}>
        <p className="mb-3 inline-flex rounded-full bg-brand-soft px-3 py-1 text-[0.8rem] font-semibold text-brand">{category}</p>

        <h3 className="display max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1.02]">{title}</h3>

        {headline && (
          <div className="mt-6">
            <div className="display tnum text-[clamp(4rem,9vw,6.5rem)] leading-none text-brand">
              <CountUp value={headline.value} />
            </div>
            <div className="mt-2 max-w-[28ch] text-[0.9rem] leading-snug text-mid">{headline.caption}</div>
          </div>
        )}

        <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-relaxed text-mid">{summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {tech.map((item) => (
            <span key={item} className="rounded-full bg-panel px-2.5 py-1 font-mono text-[0.72rem] text-mid ring-1 ring-line">
              {item}
            </span>
          ))}
        </div>

        <Drawer open={open} onClose={() => setOpen(false)} title={title} returnFocus={trigger}>
          <p className="mb-3 inline-flex rounded-full bg-brand-soft px-3 py-1 text-[0.8rem] font-semibold text-brand">{category}</p>
          <p className="text-[1rem] leading-relaxed text-mid">{detail}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {tech.map((item) => (
              <span key={item} className="rounded-full bg-raised px-2.5 py-1 font-mono text-[0.72rem] text-mid ring-1 ring-line">{item}</span>
            ))}
          </div>
          {(live || code) && (
            <div className="mt-7 flex flex-wrap gap-2">
              {live && <a href={live} className="press rounded-full bg-brand px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-brand-lit">{t.open}</a>}
              {code && <a href={code} className="press rounded-full px-4 py-2 text-[0.88rem] font-medium text-mid ring-1 ring-line hover:text-hi">{t.code}</a>}
            </div>
          )}
        </Drawer>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="press group inline-flex items-center gap-2.5 rounded-full bg-panel py-1.5 pl-1.5 pr-4 text-[0.88rem] font-medium shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:shadow-[0_0_0_1px_rgb(18_21_29/0.25)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hi text-white">
              <Plus size={14} strokeWidth={2} aria-hidden="true"
                    className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-90" />
            </span>
            {t.show}
          </button>

          {live && (
            <a href={live} className="press group inline-flex items-center gap-2.5 rounded-full bg-brand py-1.5 pl-4 pr-1.5 text-[0.88rem] font-semibold text-white hover:bg-brand-lit">
              {t.open}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </a>
          )}
          {code && (
            <a href={code} className="press inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.88rem] font-medium text-mid hover:text-hi">
              <Code2 size={15} strokeWidth={1.75} aria-hidden="true" />
              {t.code}
            </a>
          )}
        </div>
      </div>

      {visual && <div className={flip ? "lg:order-1" : ""}>{visual}</div>}
    </article>
  );
}
