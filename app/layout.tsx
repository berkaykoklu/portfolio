import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono" });
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-bricolage", axes: ["opsz"] });

const DESCRIPTION =
  "AI Engineer at Bizzbee building production LLM systems: hybrid retrieval, safety constraints and evaluation pipelines. M.Sc. candidate at Boğaziçi University researching generative world models and offline reinforcement learning.";

export const metadata: Metadata = {
  metadataBase: new URL("https://berkaykoklu.com"),
  title: "Berkay Köklü | AI Engineer & ML Engineer",
  description: DESCRIPTION,
  openGraph: {
    title: "Berkay Köklü | AI Engineer & ML Engineer",
    description: DESCRIPTION,
    url: "https://berkaykoklu.com",
    siteName: "Berkay Köklü",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berkay Köklü | AI Engineer & ML Engineer",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="relative">{children}</body>
    </html>
  );
}
