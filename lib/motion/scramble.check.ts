/** Run: npx tsx lib/motion/scramble.check.ts */
import assert from "node:assert/strict";
import { scrambleFrame } from "./scramble";

const t = "AI Engineer / ML Engineer";
assert.equal(scrambleFrame(t, 1, 7), t);
assert.equal(scrambleFrame(t, 0, 7).length, t.length);
assert.equal(scrambleFrame(t, 0, 7)[2], " ");
assert.equal(scrambleFrame(t, 0, 7)[12], "/");
assert.notEqual(scrambleFrame(t, 0, 7), t);
assert.equal(scrambleFrame(t, 0.5, 7).slice(0, 12), t.slice(0, 12));
assert.equal(scrambleFrame(t, 0.3, 7), scrambleFrame(t, 0.3, 7));
assert.notEqual(scrambleFrame(t, 0, 7), scrambleFrame(t, 0, 8));
console.log("ok: scramble");
