import Link from "next/link";

// Gabarit commun aux pages légales (style cohérent avec le site).
export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-[var(--color-bone-dim)] hover:text-[var(--color-blood)] transition-colors mb-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Retour
      </Link>
      <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bone)] mb-3">{title}</h1>
      {updated && (
        <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-12">
          Dernière mise à jour — {updated}
        </p>
      )}
      <div className="legal-prose space-y-8 text-sm leading-relaxed text-[var(--color-bone-dim)]">
        {children}
      </div>
    </div>
  );
}
