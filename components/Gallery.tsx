"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

// Galerie produit type "grand site" : grande image + flèches gauche/droite,
// glissement tactile (swipe), navigation clavier, pastilles et vignettes.

export default function Gallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const clamp = useCallback((i: number) => (i + count) % count, [count]);
  const go = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  // navigation clavier quand la galerie a le focus
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        ref={frameRef}
        tabIndex={0}
        className="group relative aspect-[4/5] overflow-hidden bg-[var(--color-void-2)] outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carrousel"
        aria-label={alt}
      >
        {/* piste qui défile horizontalement */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img} className="relative h-full w-full shrink-0">
              <Image
                src={img}
                alt={`${alt} — vue ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            {/* flèche gauche */}
            <button
              type="button"
              onClick={prev}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-void)]/55 text-[var(--color-bone)] backdrop-blur-sm border border-[var(--color-bone)]/15 transition-all hover:bg-[var(--color-blood)] hover:border-[var(--color-blood)] sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* flèche droite */}
            <button
              type="button"
              onClick={next}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-void)]/55 text-[var(--color-bone)] backdrop-blur-sm border border-[var(--color-bone)]/15 transition-all hover:bg-[var(--color-blood)] hover:border-[var(--color-blood)] sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* compteur */}
            <div className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-wide text-[var(--color-bone)] bg-[var(--color-void)]/55 backdrop-blur-sm px-2 py-1">
              {index + 1} / {count}
            </div>

            {/* pastilles */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-[var(--color-blood)]"
                      : "w-1.5 bg-[var(--color-bone)]/50 hover:bg-[var(--color-bone)]"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* vignettes */}
      {count > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => go(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-colors ${
                i === index
                  ? "border-[var(--color-blood)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Voir l'image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
