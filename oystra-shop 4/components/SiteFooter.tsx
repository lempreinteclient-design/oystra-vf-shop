import Link from "next/link";
import { INSTAGRAM_HANDLE } from "@/lib/products";
import { LEGAL } from "@/lib/legal";
import OystraWordmark from "@/components/OystraWordmark";

export default function SiteFooter() {
  return (
    <footer id="livraison" className="bg-[var(--color-void)] border-t border-[var(--color-bone)]/10 mt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 sm:grid-cols-3">
        <div>
          <OystraWordmark className="h-7 w-auto text-[var(--color-bone)] mb-4" />
          <p className="font-mono text-xs text-[var(--color-bone-dim)] leading-relaxed max-w-[26ch]">
            Surfing brand. Île d&apos;Oléron, Charente-Maritime.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-blood)] mb-4">
            Livraison
          </p>
          <ul className="font-mono text-xs text-[var(--color-bone-dim)] space-y-2.5 leading-relaxed">
            <li className="flex justify-between gap-4">
              <span>Point Relais · Mondial Relay</span>
              <span className="text-[var(--color-bone)]">4,90 €</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Domicile · Mondial Relay</span>
              <span className="text-[var(--color-bone)]">6,90 €</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Main propre · St-Denis-d&apos;Oléron</span>
              <span className="text-[var(--color-bone)]">Gratuit</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-blood)] mb-4">
            Contact
          </p>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-xs text-[var(--color-bone)] hover:text-[var(--color-blood)] transition-colors"
          >
            {INSTAGRAM_HANDLE} →
          </a>
          <a
            href={`mailto:${LEGAL.email}`}
            className="block font-mono text-xs text-[var(--color-bone-dim)] hover:text-[var(--color-blood)] transition-colors mt-2.5"
          >
            {LEGAL.email}
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--color-bone)]/10 py-5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-bone-dim)]/50">
          © {new Date().getFullYear()} oystrå
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-bone-dim)]">
          <Link href="/mentions-legales" className="hover:text-[var(--color-bone)] transition-colors">
            Mentions légales
          </Link>
          <Link href="/cgv" className="hover:text-[var(--color-bone)] transition-colors">
            CGV
          </Link>
          <Link href="/confidentialite" className="hover:text-[var(--color-bone)] transition-colors">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
