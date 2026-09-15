/** Lucide dropped brand marks in v1, so these two are drawn here. They inherit
 *  currentColor and size like every other icon on the page, which keeps call
 *  sites identical whichever library an icon happens to come from. */

type Props = { size?: number; className?: string };

export function GitHubMark({ size = 15, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedInMark({ size = 15, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.58 4.07a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM2.3 5.2h2.56v8.24H2.3V5.2Zm4.18 0h2.45v1.13h.04c.34-.62 1.18-1.28 2.42-1.28 2.59 0 3.07 1.6 3.07 3.68v4.71h-2.56V9.24c0-.9-.02-2.05-1.32-2.05-1.32 0-1.52.96-1.52 1.98v4.27H6.48V5.2Z" />
    </svg>
  );
}
