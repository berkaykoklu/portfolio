/** English content, and the shapes the Turkish bundle must match. Every figure
 *  here exists in the linked repository or the CV — the production work carries
 *  no metrics because none were measured into a public number, and inventing
 *  one would be the single most damaging thing this page could do. */

export type Project = {
  no: string;
  title: string;
  problem: string;
  approach: string;
  impact: string;
  tech: string[];
  live?: string;
  code?: string;
};

export type PlatformPart = {
  id: string;
  name: string;
  blurb: string;
  tech: string;
  to: string;
};

export type SystemStage = { id: string; name: string; detail: string };

export type ResearchNode = { name: string; what: string; why: string };

export type Jobs = {
  current: { when: string; role: string; org: string; scope: string };
  earlier: { when: string; role: string; org: string; scope: string }[];
};

export type Tier = { tier: string; weight: "primary" | "secondary"; items: string[] };

export const STACK: Tier[] = [
  {
    tier: "Core",
    weight: "primary" as const,
    items: ["Python", "PyTorch", "FastAPI", "Docker", "SQL"],
  },
  {
    tier: "AI / ML",
    weight: "primary" as const,
    items: ["Agentic RAG", "Graph RAG", "Hybrid retrieval", "Query routing", "Embeddings", "Transformers", "Diffusion", "Evaluation", "Offline RL"],
  },
  {
    tier: "Data",
    weight: "secondary" as const,
    items: ["pandas", "NumPy", "scikit-learn", "Calibration", "MongoDB"],
  },
  {
    tier: "Infrastructure",
    weight: "secondary" as const,
    items: ["GitHub Actions", "Git", "LangChain", "Hugging Face"],
  },
];

export const PLATFORM: PlatformPart[] = [
  { id: "data", name: "Data", blurb: "Documents arrive structured and unstructured; parsing and chunking decide retrieval quality before retrieval runs.", tech: "Parsing, chunking, MongoDB", to: "Document ingestion" },
  { id: "routing", name: "Routing", blurb: "Whether to retrieve at all, and which strategy fits the question. A follow-up about the last answer needs none of them.", tech: "Agentic RAG, query routing", to: "A retriever that decides" },
  { id: "retrieval", name: "Retrieval", blurb: "Vector, lexical and graph retrieval, fused and ranked — each covers what the others miss.", tech: "Embeddings, BM25, graph traversal", to: "A retriever that decides" },
  { id: "graph", name: "Knowledge graph", blurb: "Entities and relations extracted from the corpus, so questions spanning several documents can be walked instead of guessed.", tech: "Entity and relation extraction", to: "Questions spread across documents" },
  { id: "llm", name: "Generation", blurb: "The model answers from retrieved passages and the conversation so far — not from everything available.", tech: "LLM APIs, prompt design", to: "A retriever that decides" },
  { id: "guardrails", name: "Guardrails", blurb: "Unsafe content and personal data are caught on the output path, under limits set per deployment.", tech: "Moderation, PII detection", to: "Safety and PII" },
  { id: "orchestration", name: "Orchestration", blurb: "Conversation state and the sequence of calls that answer one question, including when a step has to run again.", tech: "Python, FastAPI", to: "A retriever that decides" },
  { id: "evaluation", name: "Evaluation", blurb: "Measurement and feedback loops, so a change to a prompt or a retriever is judged rather than guessed.", tech: "Eval pipelines, feedback loops", to: "Evaluation" },
];

export const SYSTEM: SystemStage[] = [
  { id: "user", name: "User", detail: "A question arrives, with the tenant and language it came in." },
  { id: "intent", name: "Route", detail: "What is being asked, whether retrieval is needed at all, and which strategy fits it." },
  { id: "retrieval", name: "Retrieval", detail: "Vector, lexical or graph traversal — fused, ranked, and re-queried if the context comes back short." },
  { id: "llm", name: "Generation", detail: "The model answers from retrieved passages, nothing else." },
  { id: "guardrail", name: "Guardrail", detail: "Unsafe content and personal data are caught before anyone sees them." },
  { id: "response", name: "Response", detail: "The answer returns, and the exchange is logged for evaluation." },
];

export const RESEARCH: ResearchNode[] = [
  { name: "Generative models", what: "Learning the distribution rather than a single answer.", why: "A model you can sample is a model you can ask for alternatives." },
  { name: "Diffusion", what: "Sampling by denoising, step by step.", why: "The steps are where control can be applied — which is the whole opening." },
  { name: "Time-series", what: "Sequences where order and dynamics carry the signal.", why: "A trajectory is a sequence; the structure has to survive generation." },
  { name: "World models", what: "A learned simulator to plan inside.", why: "If the simulator is good enough, planning no longer needs the real environment." },
  { name: "Offline RL", what: "Policies learned from logged data, without acting to explore.", why: "Exactly the setting where acting to learn is expensive or unsafe." },
  { name: "Sequential decisions", what: "Choosing under uncertainty, over time.", why: "The point of all of it." },
];

export const JOBS: Jobs = {
  current: {
    when: "Jan 2025 — now",
    role: "AI Engineer",
    org: "Bizzbee",
    scope: "Production LLM systems for a multi-tenant AI customer service platform: retrieval, generation, safety and the evaluation loops around them.",
  },
  earlier: [
    { when: "Feb 2024 — Jan 2025", role: "Startech Intern", org: "Intertech", scope: "SQL Server administration: clusters, monitoring, upgrades, archiving." },
    { when: "Jun — Oct 2023", role: "Software Support Intern", org: "Sendeo", scope: "Diagnosed production database issues across SQL, Kibana and Azure." },
    { when: "Jan 2022 — Jul 2023", role: "Coding Trainer", org: "Logiscool", scope: "Taught block-based programming and Python across age groups." },
  ],
};
