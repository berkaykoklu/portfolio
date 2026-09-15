"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, Code2 } from "lucide-react";

export type Headline = { value: string; caption: string };

/** Ordered for two readers at once: category and diagram answer "what is this"
 *  before any prose, the headline figure answers "did it work", one sentence
 *  answers "what did you do", and the method — the only part that needs
 *  paragraphs — waits behind a click. Nothing a fast reader needs is hidden. */
export default function CaseStudy({
  category,
  title,
  visual,
  headline,
  summary,
  detail,
  tech,
  live,
  code,
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
}) {
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();

  return (
    <article className="lift overflow-hidden rounded-[14px] transition-shadow duration-300 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--sec,var(--color-brand))_38%,transparent),0_26px_60px_-28px_rgba(0,0,0,.95)]">
      <div className="p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label" style={{ color: "var(--sec, var(--color-brand))" }}>{category}</span>
          {live && (
            <span className="rounded border border-ok/35 px-2 py-0.5 text-[0.68rem] text-ok">
              Live
            </span>
          )}
        </div>

        <h3 className="mb-6 max-w-[34ch] text-[clamp(1.35rem,3.2vw,1.9rem)] font-semibold tracking-[-0.03em] leading-[1.1]">
          {title}
        </h3>

        {visual && <div className="mb-5">{visual}</div>}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-7">
          {headline && (
            <div className="shrink-0 sm:w-52">
              <div className="display text-[clamp(2.4rem,6vw,3.4rem)] tnum"
                style={{ color: "var(--sec, var(--color-hi))" }}>
                {headline.value}
              </div>
              <div className="mt-1 text-[0.78rem] leading-snug text-low">
                {headline.caption}
              </div>
            </div>
          )}
          <p className="max-w-[58ch] text-[0.95rem] leading-relaxed text-mid">
            {summary}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={still ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={still ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-line pt-5">
                <p className="label mb-2">HOW IT WORKS</p>
                <p className="max-w-[70ch] text-[0.93rem] leading-relaxed text-mid">
                  {detail}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded border border-line bg-raised px-2 py-1 font-mono text-[0.71rem] text-mid"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3.5 sm:px-7">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-lg py-1.5 text-[0.83rem] font-medium text-mid transition-colors hover:text-hi"
        >
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          {open ? "Hide technical details" : "View technical details"}
        </button>

        <div className="ml-auto flex flex-wrap gap-2">
          {live && (
            <a href={live} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[0.83rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit">
              Open it
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {code && (
            <a href={code} className="inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3.5 py-2 text-[0.83rem] font-medium transition-colors hover:bg-raised">
              <Code2 size={14} aria-hidden="true" />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
