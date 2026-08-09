"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import OystraWordmark from "@/components/OystraWordmark";

export default function SiteHeader() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-void)]/90 backdrop-blur-md border-b border-[var(--color-bone)]/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-18 py-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label="oystrå — accueil"
          className="flex items-center gap-2.5 group text-[var(--color-bone)] hover:text-[var(--color-blood)] transition-colors"
        >
          <OystraWordmark className="h-5 sm:h-6 w-auto" />
        </Link>

        <nav className="hidden sm:flex items-center gap-9 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-bone-dim)]">
          <Link href="/#produits" className="hover:text-[var(--color-blood)] transition-colors">
            Boutique
          </Link>
          <Link href="/#histoire" className="hover:text-[var(--color-blood)] transition-colors">
            Histoire
          </Link>
          <Link href="/#livraison" className="hover:text-[var(--color-blood)] transition-colors">
            Livraison
          </Link>
        </nav>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] border border-[var(--color-bone)]/20 px-4 py-2.5 hover:border-[var(--color-blood)] hover:text-[var(--color-blood)] transition-colors"
          aria-label={`Voir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Panier</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-blood)] text-[10px] font-bold text-[var(--color-bone)] font-mono">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
