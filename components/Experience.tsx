"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Jobs } from "@/lib/content";

/** The AI role carries the weight; the earlier roles are real and stay, but
 *  collapsed, because detail about SQL Server administration competes with the
 *  thing a reader came for. */
export default function Experience({ jobs, labels }: { jobs: Jobs; labels: { earlier: string; hideEarlier: string } }) {
  const CURRENT = jobs.current;
  const EARLIER = jobs.earlier;
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();

  return (
    <div>
      <div className="bezel"><div className="screen p-7 sm:p-10">
        <p className="font-mono text-[0.8rem] text-mid tnum">{CURRENT.when}</p>
        <h3 className="display mt-3 text-[clamp(2.4rem,6vw,4rem)]">{CURRENT.role}</h3>
        <p className="mt-1 text-[1.1rem] font-semibold text-flow">{CURRENT.org}</p>
        <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-mid">
          {CURRENT.scope}
        </p>
      </div></div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="press mt-3 inline-flex items-center gap-1.5 rounded-full py-2 pr-3 text-[0.88rem] font-medium text-mid hover:text-hi"
      >
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {open ? labels.hideEarlier : labels.earlier}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } }}
            exit={still ? undefined : { height: 0, opacity: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
            className="overflow-hidden"
          >
            <ol className="ml-2 space-y-6 border-l-2 border-line py-2 pl-6">
              {EARLIER.map((job) => (
                <li key={job.org}>
                  <p className="font-mono text-[0.78rem] text-mid tnum">{job.when}</p>
                  <h4 className="mt-1 text-[1rem] font-semibold">
                    {job.role}, <span className="font-normal text-mid">{job.org}</span>
                  </h4>
                  <p className="mt-0.5 max-w-[62ch] text-[0.92rem] text-mid">{job.scope}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
