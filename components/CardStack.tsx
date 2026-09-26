"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";

/** Three true facts, stacked like cards on a desk. Hovering (or tabbing into)
 *  the stack fans them apart. Pure CSS: a transition retargets mid-flight if
 *  the pointer leaves early, and it needs no JS to run. Without a hover pointer
 *  and room (phones, touch tablets) the cards sit in a plain column, because
 *  overlapping links fight over taps. */

type Card = {
  href: string;
  rest: string;
  open: string;
  className: string;
  /** Stacking on the desk: DOM order is reading order, z decides which card is on top. */
  z: string;
  children: ReactNode;
};

const CARDS: Card[] = [
  {
    href: "#work",
    rest: "translate(-50%,-50%) translate(-6px,54px) rotate(-1.5deg)",
    open: "translate(-50%,-50%) translate(-40px,120px) rotate(-3deg)",
    className: "screen",
    z: "fan:z-30",
    children: (
      <>
        <p className="text-[0.85rem] font-medium text-mid">Bizzbee, since Jan 2025</p>
        <p className="display mt-3 text-[1.9rem]">AI Engineer</p>
        <p className="mt-2 text-[0.95rem] leading-snug text-mid">Production LLM systems: retrieval, routing, guardrails and the evaluation around them.</p>
      </>
    ),
  },
  {
    href: "#open-source",
    rest: "translate(-50%,-50%) translate(38px,-6px) rotate(6deg)",
    open: "translate(-50%,-50%) translate(120px,-40px) rotate(9deg)",
    z: "fan:z-20",
    className: "bg-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
    children: (
      <>
        <p className="text-[0.85rem] font-medium text-white/85">match3-rl, live</p>
        <p className="display tnum mt-2 text-[4.2rem] leading-none">63pp</p>
        <p className="mt-2 text-[0.95rem] leading-snug text-white/90">Widest gap between a careless player and a careful one, on level 27.</p>
      </>
    ),
  },
  {
    href: "#research",
    rest: "translate(-50%,-50%) translate(-34px,-40px) rotate(-8deg)",
    open: "translate(-50%,-50%) translate(-130px,-120px) rotate(-11deg)",
    className: "bezel-core text-hi",
    z: "fan:z-10",
    children: (
      <>
        <p className="text-[0.85rem] font-medium text-mid">Boğaziçi University</p>
        <p className="display mt-3 text-[1.9rem]">M.Sc. candidate</p>
        <p className="mt-2 text-[0.95rem] leading-snug text-mid">Generative world models and offline reinforcement learning.</p>
      </>
    ),
  },
];

export default function CardStack() {
  return (
    <div className="group relative flex flex-col gap-3 fan:block fan:h-[470px]">
      {CARDS.map((c) => (
        <div
          key={c.href}
          className={`bezel ${c.z} fan:absolute fan:left-1/2 fan:top-1/2 fan:w-[21rem] fan:[transform:var(--rest)] fan:transition-transform fan:duration-700 fan:ease-[var(--ease-drawer)] fan:group-hover:[transform:var(--open)] fan:group-focus-within:[transform:var(--open)] motion-reduce:transition-none`}
          style={{ "--rest": c.rest, "--open": c.open } as CSSProperties}
        >
          <TiltCard href={c.href} className={c.className}>
            {c.children}
            <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-current/10 transition-transform duration-300 ease-[var(--ease-out)] group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5">
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </TiltCard>
        </div>
      ))}
    </div>
  );
}

/** A card that leans toward the pointer and catches a light where it points,
 *  springing back when the pointer leaves. Only with a real hover pointer and
 *  without reduced motion; on touch it is a plain link. The tilt sits on the
 *  inner link, so the outer card keeps its CSS fan transform. */
function TiltCard({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const still = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);
  const on = fine && !still;

  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  const light = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgb(255 255 255 / 0.2), transparent 60%)`;
  const box = useRef<HTMLAnchorElement>(null);

  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set((0.5 - py) * 12);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const leave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.a
      ref={box}
      href={href}
      data-card
      onPointerMove={on ? move : undefined}
      onPointerLeave={on ? leave : undefined}
      style={on ? { transform } : undefined}
      className={`group/card relative isolate block overflow-hidden rounded-[22px] p-6 ${className}`}
    >
      {on && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" style={{ background: light }} />}
      {children}
    </motion.a>
  );
}
