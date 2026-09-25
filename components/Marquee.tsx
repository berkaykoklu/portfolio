"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

/** The stack as one sliding band: breadth, not something to read item by
 *  item. It pauses on hover and has a real pause control, since motion that
 *  runs longer than five seconds must be stoppable. */
export default function Marquee({ label, items }: { label: string; items: string[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label={label} className="group relative border-y border-line bg-panel/60">
      <div className="overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className={`marquee flex w-max gap-10 pr-10 group-hover:[animation-play-state:paused] ${paused ? "[animation-play-state:paused]" : ""}`}>
          {[...items, ...items].map((item, i) => (
            <span key={i} aria-hidden={i >= items.length} className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-hi/80">
              {item}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? "Play the scrolling list" : "Pause the scrolling list"}
        className="press absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-panel text-mid shadow-[0_0_0_1px_rgb(18_21_29/0.1)] hover:text-hi motion-reduce:hidden"
      >
        {paused ? <Play size={13} strokeWidth={2} aria-hidden="true" /> : <Pause size={13} strokeWidth={2} aria-hidden="true" />}
      </button>
    </section>
  );
}
