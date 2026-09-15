/** Every claim here is checkable against the CV linked on the page. Where the
 *  brief and the CV disagreed, the CV wins: a portfolio that overstates what
 *  the CV says is the one thing a recruiter is guaranteed to catch. */

export const PRODUCTION = [
  {
    no: "01",
    title: "Hybrid retrieval for a multi-tenant support platform",
    problem:
      "Dense vector search retrieves on meaning, so it paraphrases well and misses exact tokens — order numbers, SKUs, proper nouns. Keyword search has the opposite failure. Customers ask using both at once, across several languages.",
    approach:
      "Combined dense retrieval with keyword-based retrieval and merged the result sets, tuned against multilingual document collections rather than a single-language benchmark.",
    impact:
      "More relevant answers on queries that either method alone handled badly, on a platform serving multiple tenants from one deployment.",
    tech: ["Python", "RAG", "Vector Search", "Semantic Retrieval", "LangChain"],
  },
  {
    no: "02",
    title: "Safety constraints and PII anonymisation on model output",
    problem:
      "A model with access to customer records will repeat them. Moderation cannot be one fixed rule either, because tenants have different tolerances for what may be said and stored.",
    approach:
      "Built content moderation and personal-data anonymisation into the output path, with constraints configurable per deployment rather than hard-coded.",
    impact:
      "Unsafe and identifying content is caught before a response reaches a user, on a path every answer travels.",
    tech: ["Python", "Guardrails", "PII detection", "FastAPI"],
  },
  {
    no: "03",
    title: "Document ingestion and chunking",
    problem:
      "Retrieval quality is decided before retrieval runs. Documents arrive structured and unstructured, and a chunk that splits mid-argument retrieves as noise no matter how good the search is.",
    approach:
      "Built ingestion and chunking pipelines for both kinds of source, shaping chunks so retrieved context stays coherent.",
    impact:
      "Accurate, context-aware retrieval over collections that mix formats.",
    tech: ["Python", "Document parsing", "Embeddings", "MongoDB"],
  },
  {
    no: "04",
    title: "Evaluation pipelines and feedback loops",
    problem:
      "Without measurement, a change to a prompt or a retriever is a guess. Production behaviour drifts and nobody can say in which direction.",
    approach:
      "Built evaluation pipelines and feedback loops that quantify model behaviour, so iterations are judged against numbers rather than impressions.",
    impact:
      "Model behaviour in production is measured and improved deliberately rather than anecdotally.",
    tech: ["Python", "LLM evaluation", "Feedback loops"],
  },
];

export const OPEN_SOURCE = [
  {
    no: "05",
    title: "creative-eval — do automatic quality filters agree with a human?",
    problem:
      "A model generates sixty mobile-game ad creatives in ten minutes for nothing. Choosing which deserves ad spend is the part that costs something.",
    approach:
      "Four automatic filters — CLIP prompt adherence, brand colour, button-area clarity, distinctiveness — then sixty images rated blind and the two compared. Thresholds were calibrated before any rating existed, so they could not be tuned toward a result.",
    impact:
      "Five lines of arithmetic beat a 600 MB vision model. Then a control running the same arithmetic on a region with no rationale beat everything, showing the best filter measured calmness rather than ad suitability. Published as the headline.",
    tech: ["PyTorch", "Diffusers", "CLIP", "NumPy", "Next.js"],
    live: "https://creative-eval.vercel.app",
    code: "https://github.com/berkaykoklu/creative-eval",
  },
  {
    no: "06",
    title: "equity-research-agent — research notes that cannot cite what does not exist",
    problem:
      "Language models are fluent about company financials and confidently wrong about the figures. A note nobody can check is worth nothing.",
    approach:
      "A LangGraph agent drafts five sections in parallel; every claim carries the filing passage behind it and every figure is read from the company's own XBRL data, never written by the model. A deterministic checker — not a model judging a model — runs at generation time and again as the CI gate.",
    impact:
      "A claim whose citation does not resolve is rewritten twice and then dropped rather than shipped. Across twenty annual reports the parser extracted nothing wrong, against 14 of 20 for the regex version it replaced.",
    tech: ["LangGraph", "Python", "pgvector", "FastAPI", "Opik"],
    live: "https://equity-research-agent-one.vercel.app",
    code: "https://github.com/berkaykoklu/equity-research-agent",
  },
];

export const JOBS = [
  {
    when: "Jan 2025 — now",
    role: "AI Engineer",
    org: "Bizzbee",
    points: [
      "Production LLM pipelines for a multi-tenant AI customer service platform: RAG, semantic search and conversation orchestration.",
      "Hybrid retrieval combining dense vector search with keyword search across multilingual collections.",
      "Document ingestion and chunking for structured and unstructured sources.",
      "Content moderation and PII anonymisation with configurable safety constraints.",
      "Evaluation pipelines and feedback loops measuring model behaviour in production.",
    ],
  },
  {
    when: "Feb 2024 — Jan 2025",
    role: "Startech Intern",
    org: "Intertech",
    points: [
      "SQL Server administration: cluster installation, monitoring, upgrade and archiving procedures.",
    ],
  },
  {
    when: "Jun — Oct 2023",
    role: "Software Support Intern",
    org: "Sendeo",
    points: [
      "Diagnosed production database issues across SQL, Kibana and Azure.",
    ],
  },
  {
    when: "Jan 2022 — Jul 2023",
    role: "Coding Trainer",
    org: "Logiscool",
    points: ["Taught block-based programming and Python across age groups."],
  },
];

export const RESEARCH_CHAIN = [
  "Generative models",
  "Diffusion",
  "Time-series",
  "World models",
  "Offline RL",
  "Sequential decisions",
];

export const STACK = [
  { group: "AI / ML", items: "Python, PyTorch, scikit-learn, Transformers, Diffusion models, LoRA, Reinforcement learning" },
  { group: "AI systems", items: "RAG, Hybrid retrieval, Semantic search, Embeddings, Guardrails, LLM evaluation" },
  { group: "Data", items: "pandas, NumPy, SQL, Analysis and visualisation" },
  { group: "Backend and infrastructure", items: "FastAPI, MongoDB, Docker, GitHub Actions, Git" },
];
