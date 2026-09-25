/** Every user-facing string, in both languages.
 *
 *  Turkish keeps the technical vocabulary in English — retrieval, guardrail,
 *  embedding, RAG — because that is how Turkish engineers write and say them.
 *  Translating them produces text that reads as though nobody in the field
 *  wrote it, which costs more credibility than the translation buys.
 *
 *  What is translated is everything a recruiter reads: the problem, the
 *  outcome, the reasoning. */

export type Locale = "en" | "tr";

export const UI = {
  en: {
    switchTo: "Türkçe",
    switchHref: "/tr",
    nav: { work: "Work", open: "Open source", experience: "Experience", research: "Research", cv: "CV" },
    hero: {
      roleA: "AI Engineer",
      roleB: "ML Engineer",
      lede: "I build production LLM systems at Bizzbee and research how agents learn from generated worlds at Boğaziçi.",
      viewWork: "View work",
    },
    pipeline: { label: "How a question gets answered" },
    sections: {
      platform: { title: "What I build", lead: "One production AI platform, part by part. Pick one to see what it does and which case study it belongs to." },
      work: { title: "Production work", lead: "Systems running for real users at Bizzbee. Diagrams first; the method is one click away." },
      open: { title: "Open source", lead: "Built outside work, deployed, and measured. Each publishes what it found, including where the result went against me." },
      research: { title: "Where I'm going next", lead: "M.Sc. thesis direction, and the chain of work leading into it. Early research, so there are no results here yet." },
      experience: { title: "Experience" },
      stack: { title: "Stack" },
    },
    caseStudy: { show: "View technical details", hide: "Hide technical details", open: "Open it", code: "Code", live: "Live", production: "Production" },
    platformIdle: (n: number) => `${n} parts of one platform. Pick one.`,
    noMetrics:
      "No performance figures appear on these three. The work is under NDA-shaped constraints and nothing was measured into a number I can publish and stand behind. The measured results are in the open-source work below, where anyone can reproduce them.",
    researchNote: {
      body: "A world model that generates plausible trajectories lets a policy be trained and tested without acting in the real environment. That matters most exactly where acting to learn is expensive or unsafe. The part I care about is constraint: a generated trajectory is only useful if it could actually have happened.",
      repo: "ts-worldmodel-lab benchmarking harness",
    },
    experience: { earlier: (n: number) => `Earlier roles (${n})`, hideEarlier: "Hide earlier roles" },
    contact: { title: "Building an AI team?", lead: "Open to AI engineering, ML engineering and data science roles." },
    footer: { place: "İstanbul, Turkey", note: "Every figure here is checkable in the linked CV or repository." },
  },
  tr: {
    switchTo: "English",
    switchHref: "/",
    nav: { work: "Çalışmalar", open: "Açık kaynak", experience: "Deneyim", research: "Araştırma", cv: "CV" },
    hero: {
      roleA: "AI Engineer",
      roleB: "ML Engineer",
      lede: "Üretimde çalışan AI sistemleri kuruyorum. Ajanların üretilmiş dünyalardan nasıl öğrendiğini araştırıyorum.",
      viewWork: "Çalışmalara bak",
    },
    pipeline: { label: "Bir soru nasıl yanıtlanıyor" },
    sections: {
      platform: { title: "Ne inşa ediyorum", lead: "Tek bir üretim platformunun parçaları. Birine tıkla, ne yaptığını ve hangi çalışmaya karşılık geldiğini gör." },
      work: { title: "Üretim işleri", lead: "Bizzbee'de gerçek kullanıcılara hizmet veren sistemler. Önce diyagram, yöntem bir tık ötede." },
      open: { title: "Açık kaynak", lead: "İş dışında yaptım, yayına aldım, ölçtüm. Her biri bulduğunu yayınlıyor, sonucun aleyhime çıktığı yerler dahil." },
      research: { title: "Bundan sonrası", lead: "Yüksek lisans tez yönüm ve oraya götüren zincir. Henüz erken aşama, burada sonuç yok." },
      experience: { title: "Deneyim" },
      stack: { title: "Kullandıklarım" },
    },
    caseStudy: { show: "Teknik detayları gör", hide: "Teknik detayları gizle", open: "Aç", code: "Kod", live: "Canlı", production: "Üretim" },
    platformIdle: (n: number) => `Tek platformun ${n} parçası. Birini seç.`,
    noMetrics:
      "Bu üç çalışmada performans rakamı yok. İş gizlilik kısıtları altında ve arkasında durabileceğim, yayınlanabilir bir ölçüm elimde yok. Ölçülmüş sonuçlar aşağıdaki açık kaynak işlerde duruyor. Orada herkes yeniden üretebilir.",
    researchNote: {
      body: "Makul yörüngeler üreten bir dünya modeli, bir politikayı gerçek ortamda hiç hareket etmeden eğitip test etmeyi mümkün kılar. Bu da öğrenmek için hareket etmenin pahalı ya da tehlikeli olduğu yerlerde asıl önemli olan şey. Beni ilgilendiren kısım kısıt. Üretilmiş bir yörünge, ancak gerçekten olabilecek bir şeyse işe yarar.",
      repo: "ts-worldmodel-lab kıyaslama düzeneği",
    },
    experience: { earlier: (n: number) => `Önceki roller (${n})`, hideEarlier: "Önceki rolleri gizle" },
    contact: { title: "AI ekibi mi kuruyorsunuz?", lead: "AI engineering, ML engineering ve data science rollerine açığım." },
    footer: { place: "İstanbul, Türkiye", note: "Buradaki her rakam CV'de ya da depoda doğrulanabilir." },
  },
} as const;
