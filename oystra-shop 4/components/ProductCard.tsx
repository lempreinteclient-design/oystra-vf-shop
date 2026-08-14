"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import ColorSwatch from "@/components/ColorSwatch";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [i, setI] = useState(0);
  const images = product.images;
  const count = images.length;
  const clamp = (n: number) => (n + count) % count;

  function step(dir: number, e: React.MouseEvent) {
    // ne pas déclencher la navigation du lien
    e.preventDefault();
    e.stopPropagation();
    setI((c) => clamp(c + dir));
  }

  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-void-2)]">
        <span className="absolute top-3 left-3 z-20 font-mono text-[10px] text-[var(--color-bone)] mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* piste défilante */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {images.map((img) => (
            <div key={img} className="relative h-full w-full shrink-0">
              <Image
                src={img}
                alt={`${product.name} — ${product.colorName}`}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* pastille coloris (bicolore) */}
        <span className="absolute top-3 right-3 z-20">
          <ColorSwatch
            shirt={product.shirt}
            accent={product.accent}
            size={18}
            title={product.colorName}
          />
        </span>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => step(-1, e)}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-void)]/55 text-[var(--color-bone)] backdrop-blur-sm border border-[var(--color-bone)]/15 transition-all hover:bg-[var(--color-blood)] hover:border-[var(--color-blood)] sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => step(1, e)}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-void)]/55 text-[var(--color-bone)] backdrop-blur-sm border border-[var(--color-bone)]/15 transition-all hover:bg-[var(--color-blood)] hover:border-[var(--color-blood)] sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* pastilles */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.map((img, n) => (
                <button
                  key={img}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setI(n);
                  }}
                  aria-label={`Image ${n + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    n === i
                      ? "w-4 bg-[var(--color-blood)]"
                      : "w-1.5 bg-[var(--color-bone)]/50 hover:bg-[var(--color-bone)]"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-blood)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg leading-none text-[var(--color-bone)]">
            {product.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-bone-dim)] mt-1.5">
            {product.colorName}
          </p>
        </div>
        <span className="font-mono text-sm text-[var(--color-blood)] shrink-0">
          {product.price} €
        </span>
      </div>
    </Link>
  );
}
