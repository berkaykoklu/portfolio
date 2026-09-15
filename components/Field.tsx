"use client";

import { useEffect, useRef } from "react";

/** The atmosphere the page was missing, drawn from its own subject: points in
 *  an embedding space, with an edge wherever two are close enough to be
 *  retrieved together. Drifting changes which points are neighbours, so the
 *  graph rewires itself the way a nearest-neighbour graph does when the space
 *  moves — the motion means something rather than filling space.
 *
 *  Canvas rather than DOM: one paint per frame instead of hundreds of nodes
 *  the browser has to lay out. It pauses when the tab is hidden and never
 *  starts at all if the visitor asked for reduced motion. */

const DENSITY = 1 / 16000; // points per px², capped below
const MAX_POINTS = 90;
const LINK = 148; // px within which two points are "neighbours"
const DRIFT = 0.16;

type Point = { x: number; y: number; vx: number; vy: number; r: number };

export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let points: Point[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr());
      canvas.height = Math.floor(h * dpr());
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);

      const target = Math.min(MAX_POINTS, Math.round(w * h * DENSITY));
      points = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT,
        vy: (Math.random() - 0.5) * DRIFT,
        r: Math.random() * 1.1 + 0.6,
      }));
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Edges first, so points sit on top of their own connections.
      for (let i = 0; i < points.length; i++) {
        const a = points[i]!;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const near = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = `rgba(109,140,255,${near * 0.16})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of points) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        // Points near the cursor read as the current query's neighbourhood.
        const lit = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 190);
        ctx.fillStyle = lit > 0.02
          ? `rgba(77,216,232,${0.3 + lit * 0.62})`
          : "rgba(109,140,255,0.34)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + lit * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function onPointer(e: PointerEvent) {
      if (!canvas) return;
      const box = canvas.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
    }
    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.55]"
    />
  );
}
