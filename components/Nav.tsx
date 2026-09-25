import { FileText, Languages } from "lucide-react";

/** A floating glass island rather than a bar glued to the top edge. */
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
  const links = [
    { href: "#work", label: labels.work },
    { href: "#open-source", label: labels.open },
    { href: "#research", label: labels.research },
    { href: "#experience", label: labels.experience },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="rise pointer-events-auto flex items-center gap-1 rounded-full bg-white/70 p-1.5 pl-5 shadow-[0_0_0_1px_rgb(18_21_29/0.07),0_12px_32px_-16px_rgb(47_75_255/0.35)] backdrop-blur-xl">
        <a href="#top" className="mr-3 font-display text-[0.98rem] font-bold tracking-[-0.02em]">
          Berkay Köklü
        </a>
        {links.map((link) => (
          <a key={link.href} href={link.href}
             className="press hidden rounded-full px-3.5 py-2 text-[0.86rem] text-mid hover:bg-black/[0.04] hover:text-hi md:block">
            {link.label}
          </a>
        ))}

        {/* A plain link, not a toggle: each language is its own address, so a
            reader can share the page they actually read. */}
        {switchTo && switchHref && (
          <a
            href={switchHref}
            hrefLang={switchHref === "/tr" ? "tr" : "en"}
            className="press inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.86rem] font-medium hover:bg-black/[0.04]"
          >
            <Languages size={14} strokeWidth={1.75} aria-hidden="true" />
            {switchTo}
          </a>
        )}

        <a href={cv}
           className="press ml-1 inline-flex items-center gap-1.5 rounded-full bg-hi px-4 py-2 text-[0.86rem] font-medium text-white hover:bg-brand">
          <FileText size={14} strokeWidth={1.75} aria-hidden="true" />
          {labels.cv}
        </a>
      </nav>
    </div>
  );
}
