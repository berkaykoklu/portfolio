/** Every claim here is checkable at the linked repository. Nothing is rounded
 *  up, and no project is described as finished where it is not. */

export type Project = {
  name: string;
  title: string;
  problem: string;
  finding: string;
  stack: string[];
  live?: string;
  code: string;
};

export const FEATURED: Project[] = [
  {
    name: "creative-eval",
    title: "Which AI ad creatives are worth a budget?",
    problem:
      "A model generates sixty mobile-game ad creatives in ten minutes for nothing. Choosing between them is the part a studio actually pays for. I built four automatic quality filters, rated all sixty images blind, and measured whether the filters agree with the human.",
    finding:
      "A five-line arithmetic filter beat a 600 MB vision model — and then a control proved that filter was measuring the wrong thing. Reported as the headline rather than buried.",
    stack: ["PyTorch", "Diffusers", "CLIP", "NumPy", "Next.js"],
    live: "https://creative-eval.vercel.app",
    code: "https://github.com/berkaykoklu/creative-eval",
  },
  {
    name: "equity-research-agent",
    title: "Research notes where every sentence is traceable to its source",
    problem:
      "Language models are fluent about company financials and confidently wrong about the numbers. This turns a ticker into a research note in which each claim carries the filing passage it came from, and each figure is read from the company's own filed data rather than written by the model.",
    finding:
      "The verifier is ordinary code, not a model judging a model. A claim whose citation does not resolve is rewritten twice and then dropped — never shipped. Across twenty real annual reports, zero wrong chapters.",
    stack: ["LangGraph", "Python", "pgvector", "FastAPI", "Next.js"],
    live: "https://equity-research-agent-one.vercel.app",
    code: "https://github.com/berkaykoklu/equity-research-agent",
  },
];

export const ALSO: Project[] = [
  {
    name: "ts-worldmodel-lab",
    title: "Generative models on financial time series",
    problem:
      "A data pipeline, model zoo and evaluation harness for benchmarking generative models against real market data. VAE baseline complete; further models scoped but not built.",
    finding: "",
    stack: ["PyTorch", "Python", "mypy strict"],
    code: "https://github.com/berkaykoklu/ts-worldmodel-lab",
  },
  {
    name: "stock-analyzer",
    title: "Multi-factor stock analysis with an honest composite score",
    problem:
      "Fundamentals, technicals, valuation and risk combined into one score that states what it does not know, and never implies investment advice.",
    finding: "",
    stack: ["Python", "pandas", "pytest"],
    code: "https://github.com/berkaykoklu/stock-analyzer",
  },
];
