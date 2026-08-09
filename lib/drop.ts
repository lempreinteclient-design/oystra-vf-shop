// =============================================================
// CONFIG DU DROP — page d'attente (sablier + compte à rebours)
// =============================================================
// C'est ICI que tu règles tout. Rien d'autre à toucher.
// =============================================================

// 1) TEASER_MODE
//    true  -> la page d'accueil "/" affiche le sablier (site d'attente).
//    false -> la page d'accueil "/" affiche la boutique.
//
//    ⚠️ Tu n'es pas obligé de repasser à false le 15 août :
//    dès que la date ci-dessous est atteinte, la boutique s'ouvre
//    automatiquement (la page se rafraîchit toute seule).
export const TEASER_MODE = true;

// 2) DATE DU DROP — 15 août 2026 à 00h00, heure de Paris (+02:00 en été).
export const DROP_ISO = "2026-08-15T00:00:00+02:00";

// 3) DÉBUT DE CAMPAGNE — sert à remplir le sablier.
//    Au début, le sable est en haut ; le 15 août, il est entièrement en bas.
export const CAMPAIGN_START_ISO = "2026-07-16T00:00:00+02:00";

export const DROP_MS = new Date(DROP_ISO).getTime();
export const CAMPAIGN_START_MS = new Date(CAMPAIGN_START_ISO).getTime();

export function isDropped(now: number = Date.now()): boolean {
  return now >= DROP_MS;
}

// Fraction de sable encore en haut : 1 au départ, 0 le jour du drop.
export function sandTopFraction(now: number = Date.now()): number {
  const total = DROP_MS - CAMPAIGN_START_MS;
  if (total <= 0) return 0;
  const left = DROP_MS - now;
  return Math.min(1, Math.max(0, left / total));
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function timeLeft(now: number = Date.now()): TimeLeft {
  const total = Math.max(0, DROP_MS - now);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
    total,
  };
}
