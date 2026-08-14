import Image from "next/image";
import { PRODUCTS, INSTAGRAM_HANDLE } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SurfBanner from "@/components/SurfBanner";

export default function ShopHome() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* PRODUITS */}
      <section id="produits" className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
        <Reveal>
          <div className="mb-12 sm:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-blood)] mb-3">
              Collection — 01
            </p>
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-bone)] leading-none">
              Les pièces
            </h2>
            <p className="hidden sm:block mt-5 font-mono text-xs text-[var(--color-bone-dim)] max-w-[260px] leading-relaxed">
              Trois coloris. Stock limité, designé sur l&apos;île et produit
              en atelier partenaire.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-16">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
          <Reveal delay={PRODUCTS.length * 80}>
            <div className="relative aspect-[4/5] border border-dashed border-[var(--color-bone)]/15 flex flex-col items-center justify-center text-center px-6">
              <span className="font-mono text-[10px] text-[var(--color-bone-dim)]">
                {String(PRODUCTS.length + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-2xl text-[var(--color-bone-dim)] mt-3">
                PROCHAIN
                <br />
                DROP
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-bone-dim)]/60 mt-3">
                Suis {INSTAGRAM_HANDLE} sur Instagram
              </p>
            </div>
          </Reveal>
        </div>

        {/* compteur discret */}
        <Reveal>
          <div className="mt-16 sm:mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-[var(--color-bone)]/10 pt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-bone-dim)]">
            <span>
              <span className="text-[var(--color-bone)]">100</span> pulls · 1re collection
            </span>
            <span className="hidden sm:inline text-[var(--color-bone)]/20">—</span>
            <span>
              <span className="text-[var(--color-bone)]">60</span> t-shirts · drop 01
            </span>
            <span className="hidden sm:inline text-[var(--color-bone)]/20">—</span>
            <span>déjà écoulés</span>
          </div>
        </Reveal>
      </section>

      {/* CLIP DE SURF — pleine largeur */}
      <SurfBanner caption="oystrå — été sur l'île" />

      {/* AMBIANCE — photos du shooting */}
      <section className="grid grid-cols-1 sm:grid-cols-2">
        {["/images/ambiance-1.jpg", "/images/ambiance-2.jpg"].map((src, i) => (
          <div key={src} className="relative aspect-[3/2] overflow-hidden bg-[var(--color-void-2)]">
            <Image
              src={src}
              alt="oystrå — shooting"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>

      {/* HISTOIRE */}
      <section id="histoire" className="relative border-t border-[var(--color-bone)]/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-blood)] mb-3">
              Origine — 02
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-4xl sm:text-7xl text-[var(--color-bone)] leading-[0.9] max-w-3xl mb-12">
              NÉE ENTRE
              <br />
              DEUX MARÉES
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 mt-16">
            <Reveal delay={0}>
              <div className="font-mono text-[var(--color-blood)] text-xs mb-3">[ 01 ]</div>
              <p className="text-[var(--color-bone)] text-sm leading-relaxed">
                oystrå est partie d&apos;un constat simple : les meilleurs
                souvenirs de surf arrivent après la session, quand le ciel
                vire à l&apos;orange.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="font-mono text-[var(--color-blood)] text-xs mb-3">[ 02 ]</div>
              <p className="text-[var(--color-bone)] text-sm leading-relaxed">
                Chaque pièce est designée à la main, puis produite en atelier
                partenaire : logo brodé sur le torse, illustration et phares en
                sérigraphie dans le dos.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="font-mono text-[var(--color-blood)] text-xs mb-3">[ 03 ]</div>
              <p className="text-[var(--color-bone)] text-sm leading-relaxed">
                Petites séries, pas de réassort automatique. Quand
                c&apos;est parti, c&apos;est parti — jusqu&apos;au prochain
                drop.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
