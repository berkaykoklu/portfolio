"use client";

import { useEffect, useState } from "react";
import { FileText, Languages } from "lucide-react";

export default function Nav({
  cv, labels, switchTo, switchHref,
}: {
  cv: string;
  labels: { work: string; open: string; experience: string; research: string; cv: string };
  /** Omitted while Turkish is unpublished: an unset pair renders no button at
   *  all rather than a link to a route that does not exist. */
  switchTo?: string;
  switchHref?: string;
}) {
  // The bar only earns a border once the page has moved under it.
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#work", label: labels.work },
    { href: "#open-source", label: labels.open },
    { href: "#experience", label: labels.experience },
    { href: "#research", label: labels.research },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200 ${
        moved ? "border-b border-line bg-base/80" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-[84rem] items-center justify-between gap-4 px-6">
        <a href="#top" className="text-[0.92rem] font-semibold tracking-[-0.01em]">
          Berkay Köklü
        </a>
        <div className="flex items-center gap-5">
          {links.map((link) => (
            <a key={link.href} href={link.href}
               className="hidden text-[0.86rem] text-mid transition-colors hover:text-hi md:block">
              {link.label}
            </a>
          ))}

          {/* A plain link, not a toggle: each language is its own address, so a
              reader can share the page they actually read. */}
          {switchTo && switchHref && (
            <a
              href={switchHref}
              hrefLang={switchHref === "/tr" ? "tr" : "en"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3 py-1.5 text-[0.82rem] font-medium transition-colors hover:border-brand-deep hover:bg-raised"
            >
              <Languages size={13} aria-hidden="true" />
              {switchTo}
            </a>
          )}

          <a href={cv}
             className="inline-flex items-center gap-1.5 rounded-lg border border-line-ctl bg-lifted px-3 py-1.5 text-[0.82rem] font-medium transition-colors hover:bg-raised">
            <FileText size={13} aria-hidden="true" />
            {labels.cv}
          </a>
        </div>
      </div>
    </nav>
  );
}
