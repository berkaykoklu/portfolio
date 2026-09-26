"use client";

import { useEffect, useRef } from "react";

/* Silk: the uv is warped by a few layered sines that drift with time and lean
   toward the pointer; the result tints the page ground toward cobalt, weighted
   to the right so the name on the left always sits on pale ground. */
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
uniform vec4 k; // the text column, in uv (x0, y0, x1, y1): kept pale
void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = uv * 3.0 + (m - 0.5) * 0.6;
  for (int i = 1; i < 5; i++) {
    float fi = float(i);
    p += vec2(0.6 / fi * sin(fi * p.y + t * 0.25 + 0.3 * fi), 0.5 / fi * cos(fi * p.x + t * 0.2 + 0.4 * fi));
  }
  float s = 0.5 + 0.5 * sin(p.x + p.y);
  vec3 base = vec3(0.949, 0.957, 0.973);
  vec3 blue = vec3(0.184, 0.294, 1.0);
  vec3 soft = vec3(0.557, 0.627, 1.0);
  float w = smoothstep(0.3, 1.0, uv.x * 0.85 + uv.y * 0.5);
  // Soft-edged cut-out under the text, so brand-coloured type keeps its contrast
  // whatever the layout (on a phone the text spans the whole width).
  float e = 0.04;
  float inside = smoothstep(k.x - e, k.x, uv.x) * (1.0 - smoothstep(k.z, k.z + e, uv.x))
               * smoothstep(k.y - e, k.y, uv.y) * (1.0 - smoothstep(k.w, k.w + e, uv.y));
  w *= 1.0 - 0.9 * inside;
  vec3 col = mix(base, mix(soft, blue, s * s), w * (0.35 + 0.4 * s));
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

/** A living background for the hero, and nothing more expensive than it needs
 *  to be: resolution capped at 1.5x, about 30 frames a second, paused when
 *  off screen or in a hidden tab, one still frame under reduced motion. The
 *  CSS gradient underneath is what shows if WebGL is missing or fails. */
export default function ShaderBackdrop({ className = "", avoid }: { className?: string; /** CSS selector of the text to keep pale ground under. */ avoid?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    const buf = gl.createBuffer();
    const free = () => { gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf); };
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { free(); return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");
    const uK = gl.getUniformLocation(prog, "k");
    let cut = [2, 2, 2, 2]; // off-canvas until measured

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let visible = true;
    let lost = false;
    let raf = 0;
    let last = 0;
    const start = performance.now();

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const t = avoid ? document.querySelector(avoid)?.getBoundingClientRect() : undefined;
      const c = canvas.getBoundingClientRect();
      if (t && c.width && c.height) {
        // GL's y runs bottom-up.
        cut = [(t.left - c.left) / c.width, 1 - (t.bottom - c.top) / c.height, (t.right - c.left) / c.width, 1 - (t.top - c.top) / c.height];
      }
    };
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform4f(uK, cut[0]!, cut[1]!, cut[2]!, cut[3]!);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // About 30fps; stops scheduling while off screen and restarts on return.
    const loop = (now: number) => {
      if (!visible || lost) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (now - last < 30) return;
      last = now - ((now - last) % 33);
      draw(now);
    };
    const kick = () => { if (!raf && !still && !lost) raf = requestAnimationFrame(loop); };

    size();
    canvas.style.opacity = "1";
    if (still) draw(start + 4000);
    else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => { visible = e?.isIntersecting ?? true; if (visible) kick(); });
    io.observe(canvas);
    const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0; canvas.style.opacity = "0"; };
    canvas.addEventListener("webglcontextlost", onLost);
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; };
    const onResize = () => { size(); if (still) draw(start + 4000); };
    if (fine && !still) addEventListener("pointermove", onMove, { passive: true });
    // The header's height changes without a window resize (fonts, wrapping, dvh).
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    const avoidEl = avoid ? document.querySelector(avoid) : null;
    if (avoidEl) ro.observe(avoidEl);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      removeEventListener("pointermove", onMove);
      free();
    };
  }, [avoid]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div data-shader-fallback className="absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_15%,rgb(47_75_255/0.35),rgb(142_160_255/0.18)_50%,transparent)]" />
      {/* Fades in only once WebGL has drawn, so a failed context never covers the fallback. */}
      <canvas ref={ref} data-shader className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
    </div>
  );
}
