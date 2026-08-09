// Codes promo — sans secret, utilisable côté client (affichage) ET serveur (calcul réel).
// La réduction s'applique sur le sous-total (hors livraison), comme d'usage.

export const PROMO_CODES: Record<string, number> = {
  famille15: 0.15, // −15 %
};

function normalize(code?: string | null): string {
  return (code || "").trim().toLowerCase();
}

export function getPromoRate(code?: string | null): number {
  return PROMO_CODES[normalize(code)] ?? 0;
}

export function isValidPromo(code?: string | null): boolean {
  return normalize(code) in PROMO_CODES;
}

// Libellé affiché, ex : "famille15 (−15 %)"
export function promoLabel(code?: string | null): string | null {
  const c = normalize(code);
  if (!(c in PROMO_CODES)) return null;
  return `${c} (-${Math.round(PROMO_CODES[c] * 100)} %)`;
}
