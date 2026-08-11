"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product, PRODUCTS, SIZES, Size } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Gallery from "@/components/Gallery";
import ColorSwatch from "@/components/ColorSwatch";
import SizeGuide from "@/components/SizeGuide";

export default function ProductPageClient({ product }: { product: Product }) {
  const [size, setSize] = useState<Size | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const { addLine, openCart } = useCart();

  // stock en direct (back-end). Démarre sur les valeurs statiques, puis se
  // met à jour avec les quantités réelles (déjà décrémentées par les commandes).
  const [stock, setStock] = useState<Record<Size, number>>(product.stock);
  useEffect(() => {
    let alive = true;
    fetch(`/api/stock?slug=${product.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.stock) setStock(d.stock);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [product.slug]);

  const stockForSize = size ? stock[size] : null;
  const canAdd = size !== null && (stockForSize ?? 0) > 0;
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  function handleAddToCart() {
    if (!size || !canAdd) return;
    addLine({
      productSlug: product.slug,
      productName: product.name,
      variantId: product.slug,
      variantName: product.colorName,
      size,
      price: product.price,
      image: product.images[0],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    openCart();
  }

  function remainingLabel(n: number) {
    if (n <= 0) return { text: "Épuisé dans cette taille", urgent: true };
    if (n === 1) return { text: "Dernier exemplaire — fonce.", urgent: true };
    if (n <= 3) return { text: `Plus que ${n} exemplaires`, urgent: true };
    return { text: `Il reste ${n} exemplaires`, urgent: false };
  }

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14">
      <Link
        href="/#produits"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-[var(--color-bone-dim)] hover:text-[var(--color-blood)] transition-colors mb-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Retour
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
        <Gallery images={product.images} alt={`${product.name} — ${product.colorName}`} />

        <div className="lg:pt-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-blood)] mb-3">
            {product.tagline}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bone)] mb-4">
            {product.name}
          </h1>
          <p className="font-mono text-2xl text-[var(--color-bone)] mb-7">{product.price} €</p>
          <p className="text-[var(--color-bone-dim)] text-sm leading-relaxed mb-9 max-w-md">
            {product.description}
          </p>

          {/* COLORIS (pastilles bicolores) */}
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-3">
              Coloris — <span className="text-[var(--color-bone)]">{product.colorName}</span>
            </p>
            <div className="flex gap-4 items-center">
              <ColorSwatch
                shirt={product.shirt}
                accent={product.accent}
                size={42}
                selected
                title={product.colorName}
              />
              {others.map((p) => (
                <Link key={p.slug} href={`/produits/${p.slug}`} aria-label={`Voir ${p.colorName}`}>
                  <ColorSwatch
                    shirt={p.shirt}
                    accent={p.accent}
                    size={42}
                    title={p.colorName}
                    className="hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* TAILLES */}
          <div className="mb-9">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)]">
                Taille
              </p>
              <SizeGuide />
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const left = stock[s] ?? 0;
                const isOut = left <= 0;
                const isSelected = size === s;
                return (
                  <button
                    key={s}
                    disabled={isOut}
                    onClick={() => setSize(s)}
                    className={`relative w-12 h-12 font-mono text-sm border transition-colors ${
                      isOut
                        ? "border-[var(--color-bone)]/10 text-[var(--color-bone-dim)]/30 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-[var(--color-blood)] bg-[var(--color-blood)] text-[var(--color-bone)]"
                        : "border-[var(--color-bone)]/25 text-[var(--color-bone)] hover:border-[var(--color-bone)]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* stock restant au clic */}
            {size && stockForSize !== null && (
              <p
                className={`font-mono text-[11px] mt-3 flex items-center gap-2 ${
                  remainingLabel(stockForSize).urgent
                    ? "text-[var(--color-blood)]"
                    : "text-[var(--color-bone-dim)]"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                {remainingLabel(stockForSize).text}
                {stockForSize > 0 && (
                  <span className="text-[var(--color-bone-dim)]">· taille {size}</span>
                )}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`w-full py-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
              !canAdd
                ? "bg-[var(--color-bone)]/10 text-[var(--color-bone-dim)] cursor-not-allowed"
                : justAdded
                ? "bg-green-700 text-[var(--color-bone)]"
                : "bg-[var(--color-blood)] text-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)]"
            }`}
          >
            {justAdded
              ? "Ajouté ✓"
              : !size
              ? "Choisis une taille"
              : !canAdd
              ? "Indisponible"
              : "Ajouter au panier"}
          </button>

          {/* DÉTAILS FABRICATION */}
          <div className="mt-9 pt-9 border-t border-[var(--color-bone)]/10 grid grid-cols-2 gap-y-4 gap-x-6 font-mono text-[11px] text-[var(--color-bone-dim)]">
            <Detail label="Torse" value="Logo brodé" />
            <Detail label="Dos" value="Sérigraphie" />
            <Detail label="Bas de dos" value="3 phares, sérigraphie" />
            <Detail label="Coupe" value="Oversize · 100 % coton" />
          </div>

          <div className="mt-8 space-y-3 font-mono text-xs text-[var(--color-bone-dim)]">
            <p className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-[var(--color-blood)]" />
              Point Relais dès 4,90 €
            </p>
            <p className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-[var(--color-blood)]" />
              Retrait gratuit à Saint-Denis-d&apos;Oléron
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-[var(--color-bone-dim)]/60">{label}</p>
      <p className="text-[var(--color-bone)] mt-1">{value}</p>
    </div>
  );
}
