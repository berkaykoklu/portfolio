/** Content only. Every figure here exists in the linked repository or the CV —
 *  the production work carries no metrics because none were measured into a
 *  public number, and inventing one would be the single most damaging thing
 *  this page could do. */

export const STACK = [
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
    items: ["pandas", "NumPy", "scikit-learn", "A/B testing", "Power analysis", "MongoDB"],
  },
  {
    tier: "Infrastructure",
    weight: "secondary" as const,
    items: ["GitHub Actions", "Git", "LangChain", "Hugging Face"],
  },
];
