export type RouteKind = "vector" | "lexical" | "graph" | "none";

const ROUTE: Record<RouteKind, string> = {
  vector: "vector search",
  lexical: "lexical search",
  graph: "graph traversal",
  none: "no retrieval needed",
};

/** What the router has said so far, one line per decision it has made.
 *  `k` is the diagram's step: -1 while the question is typed, the index of
 *  the route being drawn, then `steps` once the answer is reached. */
export function statusLines(route: RouteKind, reflect: boolean, k: number, steps: number): string[] {
  if (k < 0) return [];
  const lines = [`routing: ${ROUTE[route]}`];
  if (route === "none") return k >= steps ? [...lines, "answering from the conversation"] : lines;
  if (k >= 1) lines.push("fused and ranked");
  if (reflect && k >= 1) lines.push("not enough context, re-querying");
  if (k >= steps) lines.push("enough context, answering");
  return lines;
}
