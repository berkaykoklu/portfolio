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
      "Retrieval'ı sabit bir hat değil, bir karar dizisi olarak kurdum: aramaya gerek var mı, hangi strateji uyar, ve gelen bağlam cevap vermeye yetiyor mu.",
    detail:
      "Sabit bir retrieve-then-generate zinciri her soru için aynı şekilde çalışır: konuşmadan zaten cevaplanabilecek sorularda arama maliyeti öder, ve yanlış stratejiyle karşılaştığında pes eder. Önce yönlendirme bunu bir karara çeviriyor — bir sipariş numarası lexical aramaya, başka deyişle sorulmuş bir soru vektörlere, varlıklar arasına yayılan bir soru graph'a, önceki cevaba dair bir takip sorusu ise hiçbirine gidiyor. İkinci karar daha önemli: füzyon ve sıralamadan sonra ajan, elindeki bağlamın cevabı gerçekten destekleyip desteklemediğine bakıyor ve yetersizse öğrendiğiyle yeniden sorguluyor. Kalitenin çoğu o döngüden geliyor — ve maliyetin kaçabileceği yer de orası olduğu için döngü sınırlı.",
    tech: ["Python", "Agentic RAG", "Query routing", "Self-reflection", "LangChain", "Vector search", "BM25"],
  },
  {
    id: "graph",
    category: "GRAPH RAG",
    title: "Cevabı birkaç belgeye yayılmış sorular",
    summary:
      "Corpus'tan varlık ve ilişkileri çıkarıp graph'a aldım, böylece birkaç olgunun birleştirilmesini gerektiren sorular benzerlikle değil gezinerek cevaplanıyor.",
    detail:
      "Chunk retrieval, pasajları soruya benzerliğe göre sıralar; cevap tek bir pasajın içindeyken çalışır. İnsanların gerçekten üst kademeye taşıdığı sorularda çöker — müşterinin siparişi, siparişin sevk edildiği depo, ve o depoyu etkileyen bir aksaklık: üç belgede üç olgu, hiçbir chunk zinciri barındırmıyor ve hiçbiri soruya yeterince benzemiyor ki üste çıksın. Varlıkları ve ilişkilerini çıkarmak bunu yürünebilir bir yola çeviriyor. Bedeli gerçek: çıkarım kalitesi aşağıdaki her şeyi belirliyor, ve yanlış bir kenar eksik olandan daha kötü — çünkü var olmayan bir bağlantı üzerinden kendinden emin bir cevap üretir.",
    tech: ["Python", "Graph RAG", "Entity extraction", "Relation extraction", "Multi-hop retrieval"],
  },
  {
    id: "safety",
    category: "GÜVENLİK / GUARDRAIL",
    title: "Model çıktısında güvenlik kısıtları ve PII anonimleştirme",
    summary:
      "Moderasyonu ve kişisel veri anonimleştirmeyi çıktı yolunun kendisine koydum; kısıtlar kuruluma göre yapılandırılabiliyor.",
    detail:
      "Müşteri kayıtlarına erişebilen bir model onları tekrarlar. Moderasyon tek bir sabit kural da olamaz — tenant'lar neyin söylenip saklanabileceği konusunda birbirinden farklı. Denetimleri çıktı yolunun yanına değil üstüne koymak, her cevabın oradan geçmesi demek; kısıtları kod yerine yapılandırma yapmak da kuralın hattı değiştirmeden değişmesini sağlıyor.",
    tech: ["Python", "Moderasyon", "PII tespiti", "FastAPI"],
  },
  {
    id: "ingestion",
    category: "VERİ / ALIM",
    title: "Belge alımı ve chunk'lama",
    summary:
      "Yapılı ve yapısız kaynaklar için alım ve chunk'lama hatları kurdum; sınırları, geri gelen bağlamın tutarlı kalacağı şekilde seçtim.",
    detail:
      "Retrieval kalitesi, retrieval çalışmadan önce belirlenir. Bir argümanın ortasından bölünen chunk, arama ne kadar iyi olursa olsun gürültü olarak geri döner; kaynaklar da birbirinden farklı şekillerde bozulan formatlarda geliyor. Tek bir hat ikisini de işliyor, ve chunk sınırları geri gelen parçanın tek başına okunabilir olacağı şekilde seçiliyor.",
    tech: ["Python", "Belge ayrıştırma", "Chunking", "MongoDB"],
  },
  {
    id: "evaluation",
    category: "DEĞERLENDİRME",
    title: "Değerlendirme hatları ve geri besleme döngüleri",
    summary:
      "Üretimdeki model davranışını sayısallaştıran değerlendirme hatları kurdum; her yineleme izlenime göre değil sayıya göre yargılanıyor.",
    detail:
      "Ölçüm olmadan bir prompt'u ya da retriever'ı değiştirmek tahmindir: üretimdeki davranış kayar ve kimse hangi yöne kaydığını söyleyemez. Döngü, üretimdeki etkileşimler bir değişikliğin yargılandığı kümeye geri beslendiğinde kapanıyor — yoksa değerlendirme yavaşça kullanıcıların gerçekten sorduğu şeye benzemeyi bırakıyor.",
    tech: ["Python", "LLM evaluation", "Geri besleme döngüleri"],
  },
];

export const OPEN_TR: Case[] = [
  {
    id: "churn",
    category: "ML / KARAR SİSTEMLERİ",
    title: "churn-decisions — olasılık henüz bir karar değil",
    headline: { value: "947 / 431", caption: "aynı eşikte teklif gönderilen müşteri — AUC farkı 0.004 olan iki modelden" },
    summary:
      "Bir churn modeli eğittim, olasılıklarının söylediği şeyi gerçekten ifade edip etmediğini kontrol ettim, sonra karar eşiğini 0.5 varsaymak yerine teklifin maliyetinden türettim.",
    detail:
      "Sınıf ağırlıklandırma, dengesiz etiketlerde standart reflekstir. AUC'yi 0.004 oynattı ve tahmin edilen churn oranını %20.4'ten %34.1'e şişirdi — sıralama metrikleri bunu göremez, çünkü sıralama olasılıkların her monotonik bozulmasından sağ çıkar; sadece AUC raporlayan bir proje bu hatayı asla bulamaz. Bir karar kuralına verildiğinde o model iki katından fazla harcıyor. Eşiğin kendisi ise aritmetik: müdahale p·e·V > C olduğunda kârlı, yani başabaş olasılık C/(e·V) ve sınıflandırıcı bu formülde hiç geçmiyor. Türetilmiş hali 0.333, örneklemde en iyisi 0.300, ve 0.5 geleneği değerin %12'sini geride bırakıyor.",
    tech: ["Python", "scikit-learn", "Kalibrasyon", "Karar teorisi", "pandas", "NumPy"],
    live: "https://churn-decisions.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/churn-decisions",
  },
  {
    id: "experiment",
    category: "DENEY / İSTATİSTİK",
    title: "experiment-audit — bir A/B testi neyi görebilirdi, neyi göremezdi",
    headline: { value: "0.59 / 0.93", caption: "ölçülen etki, bu örneklemin tespit edebileceği en küçük etkiye karşı" },
    summary:
      "90.189 oyuncunun katıldığı gerçek bir mobil oyun deneyini denetledim: anlamlılık testi, bulabileceği etki büyüklükleri, ve panele sürekli bakmanın cevaba ne yapacağı.",
    detail:
      "Birinci gün tutunması 'anlamlı değil' çıktı, ki bu rutin olarak 'fark yok' diye okunur. 0.59 puan oynadı, ve bu örneklemin güvenilir şekilde tespit edebileceği en küçük etki 0.93 — deney söyleyemezdi, ki bu farklı bir iddia ve verinin desteklediği olan. Yedinci gün tutunması anlamlı, ama tespit tabanını 0.09 puanla geçiyor; tekrarlanmayı hak edecek kadar ince. Ayrıca peeking simülasyonundaki her deney bir A/A testi ve tek bakış nominal %5 hata oranını yeniden üretiyor — o kalibrasyon test paketinde bir test, çünkü tutmasaydı simülasyondan çıkan diğer her rakam çöp olurdu.",
    tech: ["Python", "NumPy", "pandas", "Hipotez testi", "Güç analizi", "Monte Carlo"],
    live: "https://experiment-audit.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/experiment-audit",
  },
  {
    id: "creative",
    category: "ÜRETKEN AI / DEĞERLENDİRME",
    title: "creative-eval — otomatik kalite filtreleri insanla aynı fikirde mi?",
    headline: { value: "5 satır", caption: "aritmetik, 600 MB'lık görü modelini yendi — sonra kontrol ikisini birden yendi" },
    summary:
      "Altmış reklam görseli ürettim, dört yöntemle otomatik puanladım, altmışını da körlemesine kendim puanladım, ve ikisinin örtüşüp örtüşmediğini ölçtüm.",
    detail:
      "Eşikler herhangi bir insan puanı var olmadan önce kalibre edildi, yani bir sonuca doğru ayarlanamazlardı. En iyi gerçek filtre 0.59 sıra korelasyonuna ulaştı, CLIP 0.21'de kaldı. Sonra kontrol — aynı aritmetiğin, arkasında hiçbir gerekçe olmayan bir bölgede çalıştırılmış hali — 0.69 aldı; yani en iyi filtre reklam uygunluğunu değil görsel sakinliği ölçüyormuş ve alan gerekçesi sayılar geldikten sonra yazılmış. Bu, dipnot değil manşet olarak yayınlandı.",
    tech: ["PyTorch", "Diffusers", "CLIP", "NumPy", "Next.js"],
    live: "https://creative-eval.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/creative-eval",
  },
  {
    id: "equity",
    category: "AJANLAR / RETRIEVAL",
    title: "equity-research-agent — var olmayanı kaynak gösteremeyen notlar",
    headline: { value: "0", caption: "20 raporda yanlış bölüm; yerini aldığı regex sürümünde 20'de 14'tü" },
    summary:
      "Bir hisse kodunu, her iddiasının arkasındaki dosya pasajını taşıyan ve her rakamı şirketin kendi beyan ettiği veriden okuyan bir araştırma notuna çeviren LangGraph ajanı.",
    detail:
      "Model hiçbir zaman bir sayı yazmıyor: bir metrik adı veriyor, kod o adı şirketin XBRL verisinde bulup gerçek etiketi, dönemi ve değeri iliştiriyor. Deterministik bir denetleyici — model yargılayan model değil — hem üretim anında hem CI kapısı olarak çalışıyor; kaynağı çözülemeyen bir iddia iki kez yeniden yazılıyor, sonra yayınlanmak yerine düşürülüyor. Bölüm sınırlarını model seçiyor, kesmeyi kod yapıyor — parser'ı 20'de 14'ten, yirmisinde de sıfır yanlışa taşıyan şey bu.",
    tech: ["LangGraph", "Python", "pgvector", "FastAPI", "Opik"],
    live: "https://equity.berkaykoklu.com",
    code: "https://github.com/berkaykoklu/equity-research-agent",
  },
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
  { name: "Diffusion", what: "Adım adım gürültü gidererek örnekleme.", why: "Kontrolün uygulanabileceği yer o adımlar — asıl açık kapı orası." },
  { name: "Zaman serisi", what: "Sıranın ve dinamiğin sinyali taşıdığı diziler.", why: "Bir yörünge bir dizidir; yapının üretim sırasında ayakta kalması gerekir." },
  { name: "Dünya modelleri", what: "İçinde plan yapılabilen öğrenilmiş bir simülatör.", why: "Simülatör yeterince iyiyse, planlama artık gerçek ortama ihtiyaç duymaz." },
  { name: "Offline RL", what: "Keşfetmek için hareket etmeden, kayıtlı veriden öğrenilen politikalar.", why: "Tam olarak öğrenmek için hareket etmenin pahalı ya da tehlikeli olduğu durum." },
  { name: "Ardışık kararlar", what: "Belirsizlik altında, zaman içinde seçim yapmak.", why: "Hepsinin varlık sebebi." },
];

export const PLATFORM_TR: PlatformPart[] = [
  { id: "data", name: "Veri", blurb: "Belgeler yapılı ve yapısız geliyor; ayrıştırma ve chunk'lama, retrieval kalitesini retrieval çalışmadan önce belirliyor.", tech: "Ayrıştırma, chunking, MongoDB", to: "Belge alımı" },
  { id: "routing", name: "Yönlendirme", blurb: "Aramaya gerek var mı, ve hangi strateji soruya uyar. Son cevaba dair bir takip sorusu hiçbirine ihtiyaç duymaz.", tech: "Agentic RAG, query routing", to: "Nasıl arayacağına karar veren retriever" },
  { id: "retrieval", name: "Retrieval", blurb: "Vektör, lexical ve graph retrieval — füzyonlanıp sıralanıyor, her biri diğerlerinin kaçırdığını yakalıyor.", tech: "Embedding, BM25, graph gezinme", to: "Nasıl arayacağına karar veren retriever" },
  { id: "graph", name: "Bilgi grafı", blurb: "Corpus'tan çıkarılmış varlıklar ve ilişkiler; birkaç belgeye yayılan sorular tahmin edilmek yerine yürünüyor.", tech: "Varlık ve ilişki çıkarımı", to: "Cevabı birkaç belgeye yayılmış sorular" },
  { id: "llm", name: "Üretim", blurb: "Model, getirilen pasajlardan ve o ana kadarki konuşmadan cevap veriyor — eldeki her şeyden değil.", tech: "LLM API'leri, prompt tasarımı", to: "Nasıl arayacağına karar veren retriever" },
  { id: "guardrails", name: "Guardrail", blurb: "Güvensiz içerik ve kişisel veri, çıktı yolunda ve kuruluma göre belirlenen sınırlar altında yakalanıyor.", tech: "Moderasyon, PII tespiti", to: "Güvenlik kısıtları ve PII" },
  { id: "orchestration", name: "Orkestrasyon", blurb: "Konuşma durumu ve tek bir soruyu cevaplayan çağrı dizisi — bir adımın yeniden çalışması gerektiği durumlar dahil.", tech: "Python, FastAPI", to: "Nasıl arayacağına karar veren retriever" },
  { id: "evaluation", name: "Değerlendirme", blurb: "Ölçüm ve geri besleme döngüleri, böylece bir prompt ya da retriever değişikliği tahmin edilmek yerine yargılanıyor.", tech: "Eval hatları, geri besleme", to: "Değerlendirme hatları" },
];

export const SYSTEM_TR: SystemStage[] = [
  { id: "user", name: "Kullanıcı", detail: "Bir soru geliyor; hangi tenant'a ait olduğu ve hangi dilde sorulduğu ile birlikte." },
  { id: "intent", name: "Yönlendirme", detail: "Ne soruluyor, aramaya gerek var mı, ve hangi strateji uyuyor." },
  { id: "retrieval", name: "Retrieval", detail: "Vektör, lexical ya da graph gezinme — füzyonlanıyor, sıralanıyor, bağlam yetersiz gelirse yeniden sorgulanıyor." },
  { id: "llm", name: "Üretim", detail: "Model yalnızca getirilen pasajlardan cevap veriyor, başka hiçbir şeyden değil." },
  { id: "guardrail", name: "Guardrail", detail: "Çıktı, kimse görmeden güvensiz içerik ve kişisel veri açısından denetleniyor." },
  { id: "response", name: "Cevap", detail: "Cevap dönüyor, ve alışveriş değerlendirme hattı için kaydediliyor." },
];

export const STACK_TR: Tier[] = [
  { tier: "Çekirdek", weight: "primary", items: ["Python", "PyTorch", "FastAPI", "Docker", "SQL"] },
  { tier: "AI / ML", weight: "primary", items: ["Agentic RAG", "Graph RAG", "Hybrid retrieval", "Query routing", "Embeddings", "Transformers", "Diffusion", "Evaluation", "Offline RL"] },
  { tier: "Veri", weight: "secondary", items: ["pandas", "NumPy", "scikit-learn", "A/B testing", "Güç analizi", "Kalibrasyon", "MongoDB"] },
  { tier: "Altyapı", weight: "secondary", items: ["GitHub Actions", "Git", "LangChain", "Hugging Face"] },
];
