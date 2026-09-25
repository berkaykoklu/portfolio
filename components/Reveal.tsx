"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Content arrives once, on first sight: a heavy rise out of a slight blur,
 *  then it never moves again. Reduced motion keeps the fade and drops the
 *  movement. */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={still ? { opacity: 0 } : { opacity: 0, transform: "translateY(28px)", filter: "blur(8px)" }}
      whileInView={still ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
