"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#open-source", label: "Open source" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
];

export default function Nav({ cv }: { cv: string }) {
  // The bar only earns a border once the page has moved under it.
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200 ${
        moved ? "border-b border-line bg-base/80" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#top" className="text-[0.92rem] font-semibold tracking-[-0.01em]">
          Berkay Köklü
        </a>
        <div className="flex items-center gap-6">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-[0.86rem] text-mid transition-colors hover:text-hi sm:block"
            >
              {link.label}
            </a>
          ))}
          <a
            href={cv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3 py-1.5 text-[0.82rem] font-medium transition-colors hover:border-line-ctl/80 hover:bg-raised"
          >
            <FileText size={13} aria-hidden="true" />
            CV
          </a>
        </div>
      </div>
    </nav>
  );
}
