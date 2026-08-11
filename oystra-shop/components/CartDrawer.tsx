"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, lineKey } from "@/lib/cart-context";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, updateQuantity, removeLine, itemCount, subtotal } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-[var(--color-void)] border-l border-[var(--color-bone)]/10 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Panier"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 h-18 py-5 border-b border-[var(--color-bone)]/10">
          <h2 className="font-display text-xl text-[var(--color-bone)]">
            Panier {itemCount > 0 && `[${itemCount}]`}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="w-9 h-9 flex items-center justify-center hover:text-[var(--color-blood)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-mono text-xs text-[var(--color-bone-dim)] uppercase tracking-wide">
              Panier vide
            </p>
            <Link
              href="/#produits"
              onClick={closeCart}
              className="font-mono text-xs text-[var(--color-blood)] underline underline-offset-4"
            >
              Voir les t-shirts
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {lines.map((line) => {
                const key = lineKey(line);
                return (
                  <div key={key} className="flex gap-4">
                    <div className="relative w-20 h-24 shrink-0 overflow-hidden bg-[var(--color-void-2)]">
                      <Image
                        src={line.image}
                        alt={line.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight text-[var(--color-bone)]">
                        {line.productName}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-bone-dim)] mt-1">
                        {line.variantName} · {line.size}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[var(--color-bone)]/15">
                          <button
                            onClick={() => updateQuantity(key, line.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-sm hover:text-[var(--color-blood)]"
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-mono text-xs">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(key, line.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-sm hover:text-[var(--color-blood)]"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-sm text-[var(--color-bone)]">
                          {(line.price * line.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeLine(key)}
                      aria-label="Retirer cet article"
                      className="text-[var(--color-bone-dim)]/50 hover:text-[var(--color-blood)] transition-colors self-start"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--color-bone)]/10 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-[var(--color-bone-dim)] uppercase tracking-wide">
                <span>Sous-total</span>
                <span className="text-[var(--color-bone)] text-sm">{subtotal.toFixed(2)} €</span>
              </div>
              <p className="font-mono text-[10px] text-[var(--color-bone-dim)]/70">
                Livraison calculée à l&apos;étape suivante.
              </p>
              <Link
                href="/commande"
                onClick={closeCart}
                className="block w-full text-center bg-[var(--color-blood)] text-[var(--color-bone)] py-4 font-mono text-xs uppercase tracking-[0.15em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors"
              >
                Passer la commande
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
