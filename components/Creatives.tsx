"use client";

import { motion, useReducedMotion } from "motion/react";
import gallery from "@/lib/gallery.json";

/** Real output, not stock imagery: these are creatives the diffusion model in
 *  creative-eval actually produced, and the strip shows the ones that scored
 *  highest when rated blind. The page finally has something to look at, and
 *  what there is to look at is the work. */
export default function Creatives() {
  const still = useReducedMotion();
  const shots = gallery.strong;

  return (
    <div className="relative">
      <div className="diagram-scroll -mx-6 px-6 pb-2">
        <div className="flex min-w-max gap-3">
          {shots.map((s, i) => (
            <motion.figure
              key={s.file}
              className="group relative m-0 h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-line sm:h-52 sm:w-52"
              initial={still ? false : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.045, 0.4) }}
            >
              <img
                src={`/work/${s.file}`}
                alt={s.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-base/95 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="font-mono text-[0.66rem] leading-tight text-hi">
                  {s.alt}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-[0.72rem] text-low">
        GENERATED ON-DEVICE · THE ELEVEN THAT SCORED HIGHEST WHEN RATED BLIND
      </p>
    </div>
  );
}
