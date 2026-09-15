import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Berkay Köklü",
  description:
    "AI Engineer, ML Engineer and Data Scientist. Production AI systems in Python, PyTorch and LangGraph — each one live, and each one measured.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..700&family=Newsreader:opsz,wght@6..72,400;6..72,600&display=swap"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
