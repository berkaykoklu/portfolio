/** Turkish content. Same types as the English bundle, so a missing case is a
 *  type error rather than a page that silently drops a project.
 *
 *  Technical vocabulary stays in English — retrieval, guardrail, embedding,
 *  RAG — because that is how Turkish engineers write and say it. Translating
 *  those produces text nobody in the field would have written, which costs
 *  more credibility than the translation buys. */

import type { Case } from "./cases";
import type { Jobs, PlatformPart, ResearchNode, SystemStage, Tier } from "./content";

export const PRODUCTION_TR: Case[] = [
  {
    id: "agentic",
    category: "AGENTIC RAG / YÖNLENDİRME",
    title: "Nasıl arayacağına kendi karar veren bir retriever",
    summary:
      "Retrieval'ı sabit bir hat olarak değil, bir karar dizisi olarak kurdum. Aramaya gerek var mı, hangi strateji uyar, gelen bağlam cevap vermeye yetiyor mu.",
    detail:
      "Sabit bir retrieve-then-generate zinciri her soruyu aynı şekilde işler. Konuşmadan zaten cevaplanabilecek bir soruda bile arama maliyeti öder, yanlış stratejiye denk geldiğinde de pes eder. Yönlendirme bunu bir karara dönüştürüyor. Sipariş numarası lexical aramaya gidiyor, başka kelimelerle sorulmuş bir soru vektörlere, varlıklar arasına yayılan bir soru graph'a. Önceki cevaba dair bir takip sorusu ise hiçbirine gitmiyor. İkinci karar daha önemli. Füzyon ve sıralamadan sonra ajan elindeki bağlama bakıyor, cevabı gerçekten destekliyor mu diye. Desteklemiyorsa öğrendiğiyle yeniden sorguluyor. Kalitenin çoğu bu döngüden geliyor. Maliyetin kaçabileceği yer de burası olduğu için döngüyü sınırlı tuttum.",
    tech: ["Python", "Agentic RAG", "Query routing", "Self-reflection", "LangChain", "Vector search", "BM25"],
  },
  {
    id: "graph",
    category: "GRAPH RAG",
    title: "Cevabı birkaç belgeye yayılmış sorular",
    summary:
      "Corpus'tan varlıkları ve aralarındaki ilişkileri çıkarıp graph'a aldım. Böylece birkaç olgunun birleşmesini gerektiren sorular benzerlikle değil, gezinerek cevaplanıyor.",
    detail:
      "Chunk retrieval pasajları soruya benzerliğine göre sıralar. Cevap tek bir pasajın içindeyse bu çalışır. İnsanların gerçekten üst kademeye taşıdığı sorularda çöker. Müşterinin siparişi, siparişin sevk edildiği depo, o depoyu etkileyen aksaklık: üç belgede üç ayrı olgu. Hiçbir chunk bu zinciri barındırmıyor, hiçbiri de soruya üste çıkacak kadar benzemiyor. Varlıkları ve ilişkilerini çıkarmak bunu yürünebilir bir yola dönüştürüyor. Bedeli var. Çıkarım kalitesi sonraki her şeyi belirliyor. Yanlış bir kenar, eksik olandan daha kötü: var olmayan bir bağlantı üzerinden kendinden emin bir cevap üretir.",
    tech: ["Python", "Graph RAG", "Entity extraction", "Relation extraction", "Multi-hop retrieval"],
  },
  {
    id: "evaluation",
    category: "DEĞERLENDİRME",
    title: "Değerlendirme hatları ve geri besleme döngüleri",
    summary:
      "Üretimdeki model davranışını sayıya döken değerlendirme hatları kurdum. Her yineleme izlenime göre değil, ölçüme göre yargılanıyor.",
    detail:
      "Ölçüm olmadan bir prompt'u ya da retriever'ı değiştirmek tahmin yürütmektir. Üretimdeki davranış kayar, kimse de hangi yöne kaydığını söyleyemez. Döngü ancak üretimdeki etkileşimler değerlendirme kümesine geri beslendiğinde kapanıyor. Yoksa değerlendirme zamanla kullanıcıların gerçekten sorduğu şeye benzemeyi bırakıyor.",
    tech: ["Python", "LLM evaluation", "Geri besleme döngüleri"],
  },
];

export const OPEN_TR: Case[] = [
];

export const JOBS_TR: Jobs = {
  current: {
    when: "Oca 2025 — bugün",
    role: "AI Engineer",
    org: "Bizzbee",
    scope:
      "Çok kiracılı bir AI müşteri hizmetleri platformu için üretimde LLM sistemleri: retrieval, üretim, güvenlik ve bunların etrafındaki değerlendirme döngüleri.",
  },
  earlier: [
    { when: "Şub 2024 — Oca 2025", role: "Startech Intern", org: "Intertech", scope: "SQL Server yönetimi: cluster kurulumu, izleme, sürüm yükseltme, arşivleme." },
    { when: "Haz — Eki 2023", role: "Software Support Intern", org: "Sendeo", scope: "SQL, Kibana ve Azure üzerinde üretim veritabanı sorunlarını teşhis ettim." },
    { when: "Oca 2022 — Tem 2023", role: "Coding Trainer", org: "Logiscool", scope: "Farklı yaş gruplarına blok tabanlı programlama ve Python öğrettim." },
  ],
};

export const RESEARCH_TR: ResearchNode[] = [
  { name: "Üretken modeller", what: "Tek bir cevap yerine bir dağılım öğrenmek.", why: "Örnekleyebildiğin bir model, alternatif isteyebileceğin bir modeldir." },
  { name: "Diffusion", what: "Adım adım gürültü gidererek örnekleme.", why: "Kontrolün uygulanabileceği yer o adımlar. Asıl açık kapı orası." },
  { name: "Zaman serisi", what: "Sıranın ve dinamiğin sinyali taşıdığı diziler.", why: "Bir yörünge bir dizidir; yapının üretim sırasında ayakta kalması gerekir." },
  { name: "Dünya modelleri", what: "İçinde plan yapılabilen öğrenilmiş bir simülatör.", why: "Simülatör yeterince iyiyse, planlama artık gerçek ortama ihtiyaç duymaz." },
  { name: "Offline RL", what: "Keşfetmek için hareket etmeden, kayıtlı veriden öğrenilen politikalar.", why: "Tam olarak öğrenmek için hareket etmenin pahalı ya da tehlikeli olduğu durum." },
  { name: "Ardışık kararlar", what: "Belirsizlik altında, zaman içinde seçim yapmak.", why: "Hepsinin varlık sebebi." },
];

export const PLATFORM_TR: PlatformPart[] = [
  { id: "data", name: "Veri", blurb: "Belgeler yapılı ve yapısız geliyor; ayrıştırma ve chunk'lama, retrieval kalitesini retrieval çalışmadan önce belirliyor.", tech: "Ayrıştırma, chunking, MongoDB", to: "Belge alımı" },
  { id: "routing", name: "Yönlendirme", blurb: "Aramaya gerek var mı, hangi strateji soruya uyar. Son cevaba dair bir takip sorusu hiçbirine ihtiyaç duymaz.", tech: "Agentic RAG, query routing", to: "Nasıl arayacağına karar veren retriever" },
  { id: "retrieval", name: "Retrieval", blurb: "Vektör, lexical ve graph retrieval birlikte çalışıp füzyonlanıyor. Her biri diğerlerinin kaçırdığını yakalıyor.", tech: "Embedding, BM25, graph gezinme", to: "Nasıl arayacağına karar veren retriever" },
  { id: "graph", name: "Bilgi grafı", blurb: "Corpus'tan çıkarılmış varlıklar ve ilişkiler; birkaç belgeye yayılan sorular tahmin edilmek yerine yürünüyor.", tech: "Varlık ve ilişki çıkarımı", to: "Cevabı birkaç belgeye yayılmış sorular" },
  { id: "llm", name: "Üretim", blurb: "Model yalnızca getirilen pasajlardan ve o ana kadarki konuşmadan cevap veriyor, eldeki her şeyden değil.", tech: "LLM API'leri, prompt tasarımı", to: "Nasıl arayacağına karar veren retriever" },
  { id: "guardrails", name: "Guardrail", blurb: "Güvensiz içerik ve kişisel veri, çıktı yolunda ve kuruluma göre belirlenen sınırlar altında yakalanıyor.", tech: "Moderasyon, PII tespiti", to: "Güvenlik kısıtları ve PII" },
  { id: "orchestration", name: "Orkestrasyon", blurb: "Konuşma durumu ve tek bir soruyu cevaplayan çağrı dizisi. Bir adımın yeniden çalışması gereken durumlar dahil.", tech: "Python, FastAPI", to: "Nasıl arayacağına karar veren retriever" },
  { id: "evaluation", name: "Değerlendirme", blurb: "Ölçüm ve geri besleme döngüleri, böylece bir prompt ya da retriever değişikliği tahmin edilmek yerine yargılanıyor.", tech: "Eval hatları, geri besleme", to: "Değerlendirme hatları" },
];

export const SYSTEM_TR: SystemStage[] = [
  { id: "user", name: "Kullanıcı", detail: "Bir soru geliyor; hangi tenant'a ait olduğu ve hangi dilde sorulduğu ile birlikte." },
  { id: "intent", name: "Yönlendirme", detail: "Ne soruluyor, aramaya gerek var mı, hangi strateji uyuyor." },
  { id: "retrieval", name: "Retrieval", detail: "Vektör, lexical ya da graph gezinme. Füzyonlanıp sıralanıyor, bağlam yetersiz gelirse yeniden sorgulanıyor." },
  { id: "llm", name: "Üretim", detail: "Model yalnızca getirilen pasajlardan cevap veriyor, başka hiçbir şeyden değil." },
  { id: "guardrail", name: "Guardrail", detail: "Çıktı, kimse görmeden güvensiz içerik ve kişisel veri açısından denetleniyor." },
  { id: "response", name: "Cevap", detail: "Cevap dönüyor ve etkileşim değerlendirme hattı için kaydediliyor." },
];

export const STACK_TR: Tier[] = [
  { tier: "Çekirdek", weight: "primary", items: ["Python", "PyTorch", "FastAPI", "Docker", "SQL"] },
  { tier: "AI / ML", weight: "primary", items: ["Agentic RAG", "Graph RAG", "Hybrid retrieval", "Query routing", "Embeddings", "Transformers", "Evaluation", "Pekiştirmeli öğrenme"] },
  { tier: "Veri", weight: "secondary", items: ["pandas", "NumPy", "PyTorch", "MongoDB"] },
  { tier: "Altyapı", weight: "secondary", items: ["GitHub Actions", "Git", "LangChain", "Hugging Face"] },
];
