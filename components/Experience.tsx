"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

/** The AI role carries the weight; the earlier roles are real and stay, but
 *  collapsed, because detail about SQL Server administration competes with the
 *  thing a reader came for. Scope only — the method is in Work, and repeating
 *  it here would make the page longer without making it say more. */
const CURRENT = {
  when: "Jan 2025 — now",
  role: "AI Engineer",
  org: "Bizzbee",
  scope:
    "Production LLM systems for a multi-tenant AI customer service platform: retrieval, generation, safety and the evaluation loops around them.",
};

const EARLIER = [
  { when: "Feb 2024 — Jan 2025", role: "Startech Intern", org: "Intertech", scope: "SQL Server administration: clusters, monitoring, upgrades, archiving." },
  { when: "Jun — Oct 2023", role: "Software Support Intern", org: "Sendeo", scope: "Diagnosed production database issues across SQL, Kibana and Azure." },
  { when: "Jan 2022 — Jul 2023", role: "Coding Trainer", org: "Logiscool", scope: "Taught block-based programming and Python across age groups." },
];

export default function Experience() {
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();

  return (
    <div>
      <div className="lift rounded-[14px] p-6 sm:p-9">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
          <span className="font-mono text-[0.78rem] text-mid tnum">{CURRENT.when}</span>
        </div>
        <h3 className="display text-[clamp(1.8rem,4.4vw,2.6rem)]">{CURRENT.role}</h3>
        <p className="mt-1 text-[1rem] font-medium text-brand">{CURRENT.org}</p>
        <p className="mt-3 max-w-[62ch] text-[0.95rem] leading-relaxed text-mid">
          {CURRENT.scope}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg py-2 text-[0.85rem] font-medium text-mid transition-colors hover:text-hi"
      >
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {open ? "Hide earlier roles" : `Earlier roles (${EARLIER.length})`}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={still ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-px overflow-hidden rounded-panel border border-line bg-line">
              {EARLIER.map((job) => (
                <div key={job.org} className="grid gap-x-5 gap-y-1 bg-panel p-4 sm:grid-cols-[9rem_1fr]">
                  <p className="pt-0.5 font-mono text-[0.76rem] text-low tnum">{job.when}</p>
                  <div>
                    <h4 className="text-[0.93rem] font-semibold">
                      {job.role} <span className="font-normal text-mid">· {job.org}</span>
                    </h4>
                    <p className="mt-0.5 text-[0.88rem] text-mid">{job.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
