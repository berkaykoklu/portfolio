/** Case-study copy in both languages. The diagram for each is looked up by id
 *  in Portfolio.tsx rather than stored here, because a React component is not
 *  content and putting one in a data file makes the file untranslatable.
 *
 *  Both arrays are the same type, so a case missing from Turkish is a type
 *  error rather than a page that silently drops a project. */

export type Case = {
  id: string;
  category: string;
  title: string;
  headline?: { value: string; caption: string };
  summary: string;
  detail: string;
  tech: string[];
  live?: string;
  code?: string;
};

export const PRODUCTION_EN: Case[] = [
  {
    id: "agentic",
    category: "AGENTIC RAG / ROUTING",
    title: "A retriever that decides how to retrieve",
    summary:
      "Built retrieval as an agent rather than a fixed pipeline: it decides whether to retrieve at all, which strategy fits the question, and whether what came back is enough to answer with.",
    detail:
      "A fixed retrieve-then-generate chain runs the same way for every question, which means it pays retrieval cost on questions already answered by the conversation, and gives up when one strategy is the wrong one. Routing first turns that into a decision: an identifier goes to lexical search, a paraphrase to vectors, a question spanning entities to the graph, and a follow-up about the previous answer to none of them. The second decision matters more — after fusing and ranking, the agent judges whether the context actually supports an answer, and re-queries with what it learned instead of generating from thin evidence. That loop is where most of the quality comes from, and it is also where cost can run away, so it is bounded.",
    tech: ["Python", "Agentic RAG", "Query routing", "Self-reflection", "LangChain", "Vector search", "BM25"],
  },
  {
    id: "graph",
    category: "GRAPH RAG",
    title: "Questions whose answer is spread across documents",
    summary:
      "Extracted entities and relations from the corpus into a graph, so questions that need several facts connected can be answered by traversal rather than similarity.",
    detail:
      "Chunk retrieval ranks passages by similarity to the question, which works while the answer sits inside one passage. It fails on the questions people actually escalate — the ones needing a customer's order, the warehouse it ships from, and an incident affecting that warehouse, three facts in three documents with no single chunk holding the chain, and no chunk similar enough to the question to surface. Extracting entities and their relations turns that into a path to walk. The cost is real: extraction quality decides everything downstream, and a wrong edge is worse than a missing one because it produces a confident answer along a connection that does not exist.",
    tech: ["Python", "Graph RAG", "Entity extraction", "Relation extraction", "Multi-hop retrieval"],
  },
  {
    id: "safety",
    category: "SAFETY / GUARDRAILS",
    title: "Safety constraints and PII anonymisation on model output",
    summary:
      "Built moderation and personal-data anonymisation into the output path itself, with constraints configurable per deployment.",
    detail:
      "A model with access to customer records will repeat them. Moderation cannot be one fixed rule either, since tenants differ in what may be said and stored. Putting the checks on the output path — rather than beside it — means every answer travels through them, and making the constraints configuration rather than code means the rule changes without the pipeline changing.",
    tech: ["Python", "Moderation", "PII detection", "FastAPI"],
  },
  {
    id: "ingestion",
    category: "DATA / INGESTION",
    title: "Document ingestion and chunking",
    summary:
      "Built ingestion and chunking pipelines for structured and unstructured sources, shaping chunk boundaries so retrieved context stays coherent.",
    detail:
      "Retrieval quality is decided before retrieval runs. A chunk that splits mid-argument comes back as noise however good the search is, and sources arrive in formats that break differently. One path handles both, with boundaries chosen so what comes back is readable in isolation.",
    tech: ["Python", "Document parsing", "Chunking", "MongoDB"],
  },
  {
    id: "evaluation",
    category: "EVALUATION",
    title: "Evaluation pipelines and feedback loops",
    summary:
      "Built evaluation pipelines and feedback loops that quantify model behaviour in production, so each iteration is judged rather than guessed.",
    detail:
      "Without measurement, changing a prompt or a retriever is a guess, and production behaviour drifts with nobody able to name the direction. The loop closes when production interactions feed back into the set a change is judged against — otherwise the evaluation slowly stops resembling what users actually ask.",
    tech: ["Python", "LLM evaluation", "Feedback loops"],
  },
];

export const OPEN_EN: Case[] = [
  {
    id: "churn",
    category: "ML / DECISION SYSTEMS",
    title: "churn-decisions — a probability is not yet a decision",
    headline: { value: "947 vs 431", caption: "customers sent an offer at the same threshold — from models whose AUC differs by 0.004" },
    summary:
      "Trained a churn model, checked whether its probabilities mean what they say, then derived the decision threshold from what a retention offer costs rather than defaulting to 0.5.",
    detail:
      "Class weighting is the standard reflex for imbalanced labels. It moved AUC by 0.004 and inflated the predicted churn rate from 20.4% to 34.1% — ranking metrics cannot see this, because ranking survives any monotonic distortion of the probabilities, which is why a project reporting only AUC never finds it. Applied to a decision rule, that model spends more than twice as much. The threshold itself is arithmetic: treating a customer pays when p·e·V > C, so the break-even probability is C/(e·V) and the classifier appears nowhere in it. Derived it lands at 0.333, the empirical best is 0.300, and the 0.5 convention leaves 12% of the value behind.",
    tech: ["Python", "scikit-learn", "Calibration", "Decision theory", "pandas", "NumPy"],
    live: "https://churn-decisions.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/churn-decisions",
  },
  {
    id: "creative",
    category: "GENERATIVE AI / EVALUATION",
    title: "creative-eval — do automatic quality filters agree with a human?",
    headline: { value: "5 lines", caption: "of arithmetic beat a 600 MB vision model — then a control beat both" },
    summary:
      "Generated sixty ad creatives, scored them four ways automatically, rated all sixty blind, and measured whether the scores agree with the human.",
    detail:
      "Thresholds were calibrated before any rating existed, so they could not be tuned toward a result. The best real filter reached rank correlation 0.59 against CLIP's 0.21. Then a control — the identical arithmetic run on a region with no rationale behind it — scored 0.69, which means the best filter was measuring visual calmness rather than ad suitability, and the domain rationale was written after the numbers arrived. That is published as the headline on the project rather than a footnote.",
    tech: ["PyTorch", "Diffusers", "CLIP", "NumPy", "Next.js"],
    live: "https://creative-eval.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/creative-eval",
  },
  {
    id: "equity",
    category: "AGENTS / RETRIEVAL",
    title: "equity-research-agent — notes that cannot cite what does not exist",
    headline: { value: "0", caption: "wrong chapters across 20 filings, against 14 of 20 before" },
    summary:
      "A LangGraph agent that turns a ticker into a research note where every claim carries the filing passage behind it and every figure comes from the company's own filed data.",
    detail:
      "The model never writes a number: it names a metric, and code looks that name up in the company's XBRL data and attaches the real tag, period and value. A deterministic checker — not a model judging a model — runs at generation time and again as the CI gate; a claim whose citation does not resolve is rewritten twice and then dropped rather than shipped. Chapter boundaries are chosen by a model and cut by code, which is what took the parser from 14 of 20 to nothing wrong across all 20.",
    tech: ["LangGraph", "Python", "pgvector", "FastAPI", "Opik"],
    live: "https://equity.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/equity-research-agent",
  },
];
