"use client";

import { useState } from "react";
import Image from "next/image";

// Guide des tailles : bouton + fenêtre. Deux onglets Homme / Femme avec la
// photo du modèle, sa taille et le t-shirt porté. Coupe unique, oversize.

const MODELS = {
  femme: {
    label: "Femme",
    photo: "/images/guide-femme.jpg",
    height: "1m65",
    wears: "S",
  },
  homme: {
    label: "Homme",
    photo: "/images/guide-homme.jpg",
    height: "1m75",
    wears: "M",
  },
} as const;

type Who = keyof typeof MODELS;

// Mensurations à plat (cm) — coupe oversize unisexe.
const TABLE: { size: string; chest: number; length: number }[] = [
  { size: "XS", chest: 52, length: 68 },
  { size: "S", chest: 54, length: 70 },
  { size: "M", chest: 56, length: 72 },
  { size: "L", chest: 58, length: 74 },
  { size: "XL", chest: 60, length: 76 },
];

export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  const [who, setWho] = useState<Who>("femme");
  const m = MODELS[who];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)] underline underline-offset-4 hover:text-[var(--color-bone)] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8l4-4 14 14-4 4zM7 4l3 3M11 8l2 2M15 12l2 2" />
        </svg>
        Guide des tailles
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-void)]/80 backdrop-blur-sm p-0 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[var(--color-void-2)] border border-[var(--color-bone)]/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="sticky top-0 flex items-center justify-between bg-[var(--color-void-2)] border-b border-[var(--color-bone)]/10 px-5 py-4">
              <h3 className="font-display text-xl text-[var(--color-bone)]">
                Guide des tailles
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="text-[var(--color-bone-dim)] hover:text-[var(--color-bone)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              {/* coupe */}
              <div className="mb-5 border border-[var(--color-blood)]/30 bg-[var(--color-blood)]/[0.07] p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-blood)] mb-1.5">
                  Le conseil des créateurs
                </p>
                <p className="text-sm text-[var(--color-bone)] leading-relaxed">
                  Coupe <span className="text-[var(--color-bone)] font-semibold">oversize</span>,
                  identique pour tout le monde. Prends la{" "}
                  <span className="font-semibold">taille en dessous</span> de ta
                  taille habituelle si tu ne veux pas trop d&apos;ampleur.
                </p>
              </div>

              {/* onglets */}
              <div className="flex gap-2 mb-4">
                {(Object.keys(MODELS) as Who[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setWho(k)}
                    className={`flex-1 py-2.5 font-mono text-xs uppercase tracking-[0.15em] border transition-colors ${
                      who === k
                        ? "border-[var(--color-bone)] bg-[var(--color-bone)] text-[var(--color-void)]"
                        : "border-[var(--color-bone)]/25 text-[var(--color-bone-dim)] hover:text-[var(--color-bone)]"
                    }`}
                  >
                    {MODELS[k].label}
                  </button>
                ))}
              </div>

              {/* modèle */}
              <div className="flex gap-4 items-stretch mb-6">
                <div className="relative w-32 shrink-0 aspect-[3/4] overflow-hidden bg-[var(--color-void)]">
                  <Image
                    src={m.photo}
                    alt={`Modèle ${m.label}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center gap-3 font-mono text-xs">
                  <div>
                    <p className="text-[var(--color-bone-dim)] uppercase tracking-wide text-[10px]">
                      Mensuration
                    </p>
                    <p className="text-[var(--color-bone)] text-base">{m.height}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-bone-dim)] uppercase tracking-wide text-[10px]">
                      Porte la taille
                    </p>
                    <p className="text-[var(--color-blood)] text-base">{m.wears}</p>
                  </div>
                  <p className="text-[var(--color-bone-dim)] leading-relaxed max-w-[180px]">
                    Même coupe oversize pour les deux modèles.
                  </p>
                </div>
              </div>

              {/* tableau */}
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="text-[var(--color-bone-dim)] uppercase tracking-wide text-[10px]">
                    <th className="text-left py-2 border-b border-[var(--color-bone)]/15">Taille</th>
                    <th className="text-right py-2 border-b border-[var(--color-bone)]/15">Largeur (à plat)</th>
                    <th className="text-right py-2 border-b border-[var(--color-bone)]/15">Longueur</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={row.size} className="text-[var(--color-bone)]">
                      <td className="py-2.5 border-b border-[var(--color-bone)]/8">{row.size}</td>
                      <td className="py-2.5 border-b border-[var(--color-bone)]/8 text-right">
                        {row.chest} cm
                      </td>
                      <td className="py-2.5 border-b border-[var(--color-bone)]/8 text-right">
                        {row.length} cm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 font-mono text-[10px] text-[var(--color-bone-dim)]/70 leading-relaxed">
                Mesures à plat, tolérance ±2 cm. La largeur se mesure d&apos;une
                couture d&apos;aisselle à l&apos;autre.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
