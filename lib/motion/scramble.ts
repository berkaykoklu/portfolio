const GLYPHS = "01<>[]{}/*#%=+ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** One frame of a decode: settled characters on the left, noise on the right.
 *  Spaces and slashes never scramble, so the word shapes hold. Seeded, so the
 *  same frame is the same string every time. */
export function scrambleFrame(target: string, progress: number, seed: number): string {
  const settled = Math.floor(Math.min(Math.max(progress, 0), 1) * target.length);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i]!;
    if (i < settled || ch === " " || ch === "/") { out += ch; continue; }
    out += GLYPHS[(i * 31 + seed * 17) % GLYPHS.length];
  }
  return out;
}
