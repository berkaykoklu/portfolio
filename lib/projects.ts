/** Every figure here is reproducible at the linked repository. Where a result
 *  is unflattering it stays in: a portfolio that only reports its wins is
 *  arguing the opposite of what these projects are about. */

export type Bar = {
  name: string;
  value: number;
  /** Where this sits against the reference. */
  verdict: "better" | "worse" | "reference";
};

export type Measurement = {
  /** What the bars are measuring, in plain words. */
  caption: string;
  /** Shared upper bound so the bars are comparable by length. */
  scale: number;
  reference: { value: number; label: string };
  bars: Bar[];
  note: string;
};

export type Project = {
  name: string;
  title: string;
  problem: string;
  measurement: Measurement;
  stack: string[];
  live: string;
  code: string;
};

export const PROJECTS: Project[] = [
  {
    name: "creative-eval",
    title: "Which AI ad creatives are worth a budget?",
    problem:
      "A model generates sixty mobile-game ad creatives in ten minutes for nothing. Choosing between them is the part a studio actually pays for. I built four automatic quality filters, rated all sixty images blind, then measured whether the filters agree with the human.",
    measurement: {
      caption: "Average human rating of each filter's top ten, out of 5",
      scale: 5,
      reference: { value: 2.23, label: "no filter" },
      bars: [
        { name: "Button-area clarity", value: 2.7, verdict: "better" },
        { name: "CLIP model", value: 2.6, verdict: "better" },
        { name: "Distinctiveness", value: 1.7, verdict: "worse" },
        { name: "My own control", value: 3.3, verdict: "better" },
      ],
      note:
        "Five lines of arithmetic beat a 600 MB vision model. Filtering for distinctiveness scored below picking at random. And the control — the same arithmetic run on a region my explanation did not cover — beat everything, which means my best filter was never measuring what I claimed. That result is the headline on the project page rather than a footnote.",
    },
    stack: ["PyTorch", "Diffusers", "Stable Diffusion", "CLIP", "NumPy", "Next.js"],
    live: "https://creative-eval.vercel.app",
    code: "https://github.com/berkaykoklu/creative-eval",
  },
  {
    name: "equity-research-agent",
    title: "Research notes where every sentence is traceable to its source",
    problem:
      "Language models are fluent about company financials and confidently wrong about the numbers. This turns a ticker into a research note where each claim carries the filing passage it came from, and each figure is read from the company's own filed data rather than written by the model. The checker is ordinary code, not a model judging a model.",
    measurement: {
      caption: "Annual reports handled without a single wrong chapter, out of 20",
      scale: 20,
      reference: { value: 14, label: "regex parser" },
      bars: [
        { name: "Pure regex parser", value: 14, verdict: "reference" },
        { name: "Model picks, code cuts", value: 20, verdict: "better" },
      ],
      note:
        "A 10-K runs 60 to 400 pages and every company formats it differently. Regex got 14 of 20 right and its failures were silent — it would return a line from the table of contents as though it were a chapter. Letting a model choose the boundary indices while code does the cutting fixed that: across all 20 filings nothing wrong was ever extracted. Handled honestly includes reporting a chapter as missing, which happened for four of them; 15 produced all three chapters.",
    },
    stack: ["LangGraph", "Python", "pgvector", "FastAPI", "Next.js", "Opik"],
    live: "https://equity-research-agent-one.vercel.app",
    code: "https://github.com/berkaykoklu/equity-research-agent",
  },
];

export const MINOR = [
  {
    name: "ts-worldmodel-lab",
    title: "Generative models on financial time series",
    blurb:
      "Data pipeline, model zoo and evaluation harness for benchmarking generative models against real market data. The VAE baseline is complete; further models are scoped and not yet built.",
    code: "https://github.com/berkaykoklu/ts-worldmodel-lab",
  },
  {
    name: "stock-analyzer",
    title: "Multi-factor stock analysis with an honest composite score",
    blurb:
      "Fundamentals, technicals, valuation and risk combined into one score that states what it does not know and never implies investment advice.",
    code: "https://github.com/berkaykoklu/stock-analyzer",
  },
];
