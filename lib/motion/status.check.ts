/** Run: npx tsx lib/motion/status.check.ts */
import assert from "node:assert/strict";
import { statusLines } from "./status";

assert.deepEqual(statusLines("lexical", false, -1, 1), []);
assert.deepEqual(statusLines("lexical", false, 0, 1), ["routing: lexical search"]);
assert.deepEqual(statusLines("lexical", false, 1, 1), ["routing: lexical search", "fused and ranked", "enough context, answering"]);
assert.deepEqual(statusLines("none", false, 1, 1), ["routing: no retrieval needed", "answering from the conversation"]);
// The gate turns orange while the reflect edge is drawn (k = 1), so the log says so then.
assert.deepEqual(statusLines("graph", true, 1, 3), ["routing: graph traversal", "fused and ranked", "not enough context, re-querying"]);
assert.deepEqual(statusLines("graph", true, 2, 3), ["routing: graph traversal", "fused and ranked", "not enough context, re-querying"]);
assert.deepEqual(statusLines("graph", true, 3, 3).at(-1), "enough context, answering");
console.log("ok: status lines");
