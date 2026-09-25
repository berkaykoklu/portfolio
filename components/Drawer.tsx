"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

/** A sheet for reading more without leaving the page: from the right on wide
 *  screens, from the bottom on phones. Focus moves in, stays in, and returns
 *  to whatever opened it; Esc and the backdrop close it. */
export default function Drawer({
  open, onClose, title, children, returnFocus,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const panel = useRef<HTMLDivElement>(null);
  // Held in a ref so a new onClose each render does not re-run the open effect.
  const close = useRef(onClose);
  close.current = onClose;
  const still = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
    const mq = matchMedia("(min-width: 768px)");
    setWide(mq.matches);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = returnFocus.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // After the panel mounts, move focus to its first control.
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close.current(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
      const first = f[0];
      const last = f[f.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!panel.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
      // If the layout switched while open, the trigger may now be in a hidden
      // copy; land on the visible twin instead of dropping focus to <body>.
      if (trigger && document.activeElement !== trigger) {
        const twin = [...document.querySelectorAll<HTMLElement>('[aria-haspopup="dialog"]')].find((el) => el.offsetParent !== null);
        twin?.focus();
      }
    };
  }, [open, returnFocus]);

  if (!mounted) return null;

  const hidden = wide ? "translateX(105%)" : "translateY(100%)";
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-panel p-7 shadow-[0_-20px_60px_-20px_rgb(10_15_44/0.5)] md:inset-x-auto md:bottom-3 md:right-3 md:top-3 md:max-h-none md:w-[min(34rem,calc(100vw-1.5rem))] md:rounded-[28px] md:p-9"
            initial={still ? { opacity: 0 } : { transform: hidden }}
            animate={still ? { opacity: 1 } : { transform: "translate(0%, 0%)" }}
            exit={still ? { opacity: 0 } : { transform: hidden, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="display text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.05]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="press -mr-2 -mt-1 shrink-0 rounded-full p-2.5 text-mid hover:bg-black/[0.05] hover:text-hi"
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
