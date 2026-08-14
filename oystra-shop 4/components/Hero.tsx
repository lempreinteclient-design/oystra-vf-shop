"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import OystraWordmark from "@/components/OystraWordmark";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[100svh] min-h-[600px] overflow-hidden grain bg-[var(--color-void)]"
    >
      {/* background photo, duotone, slow parallax */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(1.1) translate(${offset.x * -14}px, ${offset.y * -10}px)`,
        }}
      >
        <Image
          src="/images/rose-blanc-duo-rue.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[50%_25%] duotone-blood"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.25) 35%, rgba(10,10,10,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: "var(--color-blood-dim)", opacity: 0.75 }}
        />
      </div>

      {/* scanlines for texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
        }}
      />

      <div className="relative h-full flex flex-col justify-end mx-auto max-w-7xl px-5 sm:px-8 pb-14 sm:pb-20">
        <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-blood)] mb-5">
          Charente-Maritime · Île d&apos;Oléron
        </p>

        <div
          className="text-[var(--color-bone)]"
          style={{
            transform: `translate(${offset.x * 8}px, ${offset.y * 6}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <OystraWordmark
            className="w-auto"
            style={{ height: "clamp(2.6rem, 11vw, 7rem)" } as React.CSSProperties}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-8">
          <p className="max-w-sm text-[var(--color-bone-dim)] text-sm sm:text-base leading-relaxed font-mono">
            Surfing brand née sur l&apos;île. Pièces designées à la main,
            logo brodé et sérigraphie, en série limitée.
          </p>

          <Link
            href="#produits"
            className="group inline-flex items-center gap-3 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-bone)] border border-[var(--color-bone)]/30 px-6 py-4 hover:border-[var(--color-blood)] hover:bg-[var(--color-blood)] transition-colors"
          >
            Voir la collection
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-void)] to-transparent pointer-events-none" />
    </section>
  );
}
