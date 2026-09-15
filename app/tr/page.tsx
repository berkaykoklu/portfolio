import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";

export const metadata: Metadata = {
  title: "Berkay Köklü — AI Engineer & ML Engineer",
  description:
    "Bizzbee'de üretimde LLM sistemleri kuruyorum — hybrid retrieval, guardrail'ler ve değerlendirme hatları. Boğaziçi Üniversitesi'nde yüksek lisans öğrencisiyim; üretken dünya modelleri ve offline pekiştirmeli öğrenme üzerine çalışıyorum.",
  alternates: { canonical: "/tr", languages: { en: "/", tr: "/tr" } },
};

export default function Turkish() {
  return <Portfolio locale="tr" />;
}
