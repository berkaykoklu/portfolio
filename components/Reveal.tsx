"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Content arrives once, on first sight, and never moves again.
 *  A small rise is enough to draw the eye down the page; anything larger reads
 *  as the effect being the point. Honours the reduced-motion setting by
 *  rendering the final state directly rather than animating to it. */
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

  if (still) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
