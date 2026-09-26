"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** One word of the lede that changes every few seconds: each rises out of a
 *  blur and leaves upward. Paused while the tab is hidden; reduced motion keeps
 *  the first word. The full list is in the accessible text, so nothing is
 *  only visible in passing. */
export default function RotatingWord({ words, interval = 2600 }: { words: readonly string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still || words.length < 2) return;
    const id = setInterval(() => { if (!document.hidden) setI((v) => (v + 1) % words.length); }, interval);
    return () => clearInterval(id);
  }, [still, words.length, interval]);

  return (
    // Every word sits invisibly in the same cell, so the slot is as wide as the
    // widest rendered word and the sentence never reflows.
    <span className="relative inline-grid overflow-hidden align-bottom [&>*]:[grid-area:1/1]">
      <span className="sr-only">{words.join(", ")}</span>
      {words.map((w) => <span key={w} aria-hidden="true" className="invisible whitespace-nowrap">{w}</span>)}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden="true"
          data-focus-word
          className="inline-block whitespace-nowrap text-brand"
          initial={{ transform: "translateY(70%)", opacity: 0, filter: "blur(6px)" }}
          animate={{ transform: "translateY(0%)", opacity: 1, filter: "blur(0px)" }}
          exit={{ transform: "translateY(-70%)", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
