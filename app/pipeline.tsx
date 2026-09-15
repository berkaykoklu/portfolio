"use client";

import { useState } from "react";

/** The shape of the retrieval systems described below, not a generic diagram.
 *  Each stage carries what it actually does and the failure it exists to
 *  prevent, because the second half is what shows the work was run in
 *  production rather than read about. */
const STAGES = [
  {
    id: "input",
    name: "Input",
    what: "A question arrives with the tenant it belongs to and the language it was asked in.",
    guards: "Tenants share one platform, so isolation is decided here or not at all.",
  },
  {
    id: "retrieval",
    name: "Retrieval",
    what: "Dense vector search runs alongside keyword search, and the two result sets are merged.",
    guards: "Dense search alone misses exact product codes and names; keyword search alone misses paraphrase.",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    what: "The model answers from the retrieved passages, with the conversation so far as context.",
    guards: "Passing everything retrieved invites drift toward material the answer should not cite.",
  },
  {
    id: "guardrail",
    name: "Guardrail",
    what: "Output is checked for unsafe content and personal data before anyone sees it.",
    guards: "A model that has seen a customer record will repeat it unless something stops it.",
  },
  {
    id: "output",
    name: "Output",
    what: "The answer is returned, and the interaction is logged for the evaluation pipeline.",
    guards: "Without the log there is no way to tell whether a change helped or hurt.",
  },
] as const;

export default function Pipeline() {
  const [active, setActive] = useState<string>(STAGES[1].id);
  const stage = STAGES.find((s) => s.id === active) ?? STAGES[0];

  return (
    <div className="viz">
      <p className="viz-label mono">RETRIEVAL PIPELINE</p>
      <div className="nodes">
        {STAGES.map((s, i) => (
          <div key={s.id}>
            {i > 0 && <div className="node-gap" aria-hidden="true" />}
            <button
              type="button"
              className="node"
              aria-expanded={active === s.id}
              onMouseEnter={() => setActive(s.id)}
              onFocus={() => setActive(s.id)}
              onClick={() => setActive(s.id)}
            >
              <span className="i mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="n">{s.name}</span>
            </button>
          </div>
        ))}
      </div>
      <p className="viz-out" aria-live="polite">
        <b>{stage.what}</b>
        {stage.guards}
      </p>
    </div>
  );
}
