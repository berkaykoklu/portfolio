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
];
