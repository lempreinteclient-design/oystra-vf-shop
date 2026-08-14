"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { INSTAGRAM_HANDLE } from "@/lib/products";

export default function MerciPage() {
  const { clear } = useCart();

  // Le paiement a réussi : on vide le panier au retour de Stripe.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--color-blood)]/15 flex items-center justify-center mx-auto mb-7">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-blood)" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="font-display text-4xl text-[var(--color-bone)] mb-5">
        Merci pour ta commande
      </h1>
      <p className="font-mono text-sm text-[var(--color-bone-dim)] leading-relaxed mb-3">
        Ton paiement est confirmé. Tu vas recevoir un email avec ta{" "}
        <span className="text-[var(--color-bone)]">facture</span> et le
        récapitulatif de ta commande.
      </p>
      <p className="font-mono text-sm text-[var(--color-bone-dim)] leading-relaxed mb-9">
        Ton colis part sous 2-3 jours ouvrés — le numéro de suivi arrivera par
        email dès l&apos;expédition. Une question ? Écris-nous sur Instagram{" "}
        <span className="text-[var(--color-bone)]">{INSTAGRAM_HANDLE}</span>.
      </p>
      <Link
        href="/"
        className="inline-block border border-[var(--color-bone)]/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)] hover:border-[var(--color-blood)] hover:text-[var(--color-blood)] transition-colors"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
