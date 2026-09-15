import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const DESCRIPTION =
  "AI Engineer at Bizzbee building production LLM systems — hybrid retrieval, safety constraints and evaluation pipelines. M.Sc. candidate at Boğaziçi University researching generative world models and offline reinforcement learning.";

export const metadata: Metadata = {
  metadataBase: new URL("https://berkaykoklu.com"),
  title: "Berkay Köklü — AI Engineer & ML Engineer",
  description: DESCRIPTION,
  openGraph: {
    title: "Berkay Köklü — AI Engineer & ML Engineer",
    description: DESCRIPTION,
    url: "https://berkaykoklu.com",
    siteName: "Berkay Köklü",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkay Köklü — AI Engineer & ML Engineer",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/", languages: { en: "/", tr: "/tr" } },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="relative">{children}</body>
    </html>
  );
}
