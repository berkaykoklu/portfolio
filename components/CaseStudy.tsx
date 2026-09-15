"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, Code2 } from "lucide-react";
import type { Project } from "@/lib/content";

/** Collapsed by default: a recruiter scanning gets the problem and the outcome,
 *  an engineer who wants the method opens it. The summary is never hidden --
 *  only the detail is, so nothing needed for a fast read is behind a click. */
export default function CaseStudy({ item }: { item: Project }) {
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();

  return (
    <article className="rounded-panel border border-line bg-panel transition-colors duration-200 hover:border-line-lit">
      <div className="p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-mono text-[0.75rem] text-brand tnum">{item.no}</span>
          <h3 className="flex-1 text-[clamp(1.05rem,2.4vw,1.3rem)] font-semibold tracking-[-0.02em]">
            {item.title}
          </h3>
          <span
            className={`rounded border px-2 py-0.5 text-[0.68rem] ${
              item.live
                ? "border-ok/35 text-ok"
                : "border-line text-low"
            }`}
          >
            {item.live ? "Live" : "Production"}
          </span>
        </div>

        <p className="max-w-3xl text-[0.94rem] leading-relaxed text-mid">
          {item.problem}
        </p>

        <p className="mt-3 max-w-3xl text-[0.94rem] leading-relaxed text-hi">
          {item.impact}
        </p>

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
                <p className="mb-1 font-mono text-[0.7rem] tracking-wide text-low">
                  APPROACH
                </p>
                <p className="max-w-3xl text-[0.94rem] leading-relaxed text-mid">
                  {item.approach}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {item.tech.map((t) => (
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
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[0.83rem] font-medium text-mid transition-colors hover:text-hi"
        >
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          {open ? "Hide approach" : "How it works"}
        </button>

        <div className="ml-auto flex flex-wrap gap-2">
          {item.live && (
            <a
              href={item.live}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[0.83rem] font-semibold text-[#060810] transition-colors hover:bg-brand-lit"
            >
              Open it
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {item.code && (
            <a
              href={item.code}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3.5 py-2 text-[0.83rem] font-medium transition-colors hover:bg-raised"
            >
              <Code2 size={14} aria-hidden="true" />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
