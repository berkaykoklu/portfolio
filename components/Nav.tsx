"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, FileText, Languages } from "lucide-react";
import { PROJECTS } from "@/lib/content";

/** A floating glass island rather than a bar glued to the top edge. Links are
 *  absolute ("/#work") so the same nav works from a project page, and every
 *  project page sits under the Projects menu on this one domain. */
export default function Nav({
  cv, labels, switchTo, switchHref,
}: {
  cv: string;
  labels: { work: string; open: string; experience: string; research: string; cv: string };
  /** Omitted while Turkish is unpublished: an unset pair renders no button at
   *  all rather than a link to a route that does not exist. */
  switchTo?: string;
  switchHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const still = useReducedMotion();

  // Close on a click anywhere else, or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!menu.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const link = "press hidden rounded-full px-3.5 py-2 text-[0.86rem] text-mid hover:bg-black/[0.04] hover:text-hi md:block";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="rise pointer-events-auto flex items-center gap-1 rounded-full bg-white/70 p-1.5 pl-5 shadow-[0_0_0_1px_rgb(18_21_29/0.07),0_12px_32px_-16px_rgb(47_75_255/0.35)] backdrop-blur-xl">
        <a href="/" className="mr-3 font-display text-[0.98rem] font-bold tracking-[-0.02em]">
          Berkay Köklü
        </a>
        <a href="/#work" className={link}>{labels.work}</a>

        <div
          ref={menu}
          className="relative"
          onBlur={(e) => { if (!menu.current?.contains(e.relatedTarget as Node | null)) setOpen(false); }}
        >
          <button
            ref={btn}
            type="button"
            aria-expanded={open}
            aria-controls="projects-menu"
            onClick={() => setOpen((v) => !v)}
            className={`press inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.86rem] hover:bg-black/[0.04] hover:text-hi ${open ? "bg-black/[0.04] text-hi" : "text-mid"}`}
          >
            Projects
            <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true"
                         className={`transition-transform duration-200 ease-[var(--ease-out)] ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={still ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px) scale(0.97)" }}
                animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                exit={{ opacity: 0, transform: still ? "none" : "translateY(-4px) scale(0.98)", transition: { duration: 0.12 } }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: "top center" }}
                id="projects-menu"
                className="absolute left-1/2 top-[calc(100%+12px)] w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2"
              >
                <div className="bezel !rounded-[24px] bg-white/80 backdrop-blur-xl">
                  <div className="bezel-core !rounded-[18px] p-1.5">
                    {PROJECTS.map((p) => (
                      <a key={p.href} href={p.href} onClick={() => setOpen(false)}
                         className="group flex items-start gap-3 rounded-[14px] p-3 transition-colors hover:bg-brand-soft">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-[0.7rem] font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]">
                          RL
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 text-[0.92rem] font-semibold text-hi">
                            {p.name}
                            <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true"
                                          className="text-brand opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </span>
                          <span className="mt-0.5 block text-[0.8rem] leading-snug text-mid">{p.blurb}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a href="/#research" className={link}>{labels.research}</a>
        <a href="/#experience" className={link}>{labels.experience}</a>

        {/* A plain link, not a toggle: each language is its own address, so a
            reader can share the page they actually read. */}
        {switchTo && switchHref && (
          <a
            href={switchHref}
            hrefLang={switchHref === "/tr" ? "tr" : "en"}
            className="press inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.86rem] font-medium hover:bg-black/[0.04]"
          >
            <Languages size={14} strokeWidth={1.75} aria-hidden="true" />
            {switchTo}
          </a>
        )}

        <a href={cv}
           className="press ml-1 inline-flex items-center gap-1.5 rounded-full bg-hi px-4 py-2 text-[0.86rem] font-medium text-white hover:bg-brand">
          <FileText size={14} strokeWidth={1.75} aria-hidden="true" />
          {labels.cv}
        </a>
      </nav>
    </div>
  );
}
