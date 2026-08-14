// =============================================================
// GESTION DU STOCK (côté serveur) — soustraction à chaque commande
// =============================================================

import { promises as fs } from "fs";
import path from "path";
import { SIZES, Size, PRODUCTS } from "./products";

export type StockMap = Record<string, Record<Size, number>>;

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const USE_KV = Boolean(KV_URL && KV_TOKEN);
const KV_KEY = "oystra:stock";
const TMP_FILE = path.join("/tmp", "oystra-stock.json");
const SEED_FILE = path.join(process.cwd(), "data", "stock.json");

function emptySeed(): StockMap {
  const m: StockMap = {};
  for (const p of PRODUCTS) {
    m[p.slug] = SIZES.reduce(
      (acc, s) => ({ ...acc, [s]: p.stock[s] }),
      {} as Record<Size, number>
    );
  }
  return m;
}

async function readSeed(): Promise<StockMap> {
  try {
    return JSON.parse(await fs.readFile(SEED_FILE, "utf8")) as StockMap;
  } catch {
    return emptySeed();
  }
}

async function kvGet(): Promise<StockMap | null> {
  try {
    const r = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { result?: string | null };
    return j.result ? (JSON.parse(j.result) as StockMap) : null;
  } catch {
    return null;
  }
}
async function kvSet(m: StockMap): Promise<void> {
  try {
    await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(m),
    });
  } catch {
    /* silencieux */
  }
}

async function fileGet(): Promise<StockMap | null> {
  try {
    return JSON.parse(await fs.readFile(TMP_FILE, "utf8")) as StockMap;
  } catch {
    return null;
  }
}
async function fileSet(m: StockMap): Promise<void> {
  try {
    await fs.writeFile(TMP_FILE, JSON.stringify(m));
  } catch {
    /* /tmp indisponible : on ignore */
  }
}

async function load(): Promise<StockMap> {
  const current = USE_KV ? await kvGet() : await fileGet();
  if (current) return current;
  const seed = await readSeed();
  if (USE_KV) await kvSet(seed);
  else await fileSet(seed);
  return seed;
}

async function save(m: StockMap): Promise<void> {
  if (USE_KV) await kvSet(m);
  else await fileSet(m);
}

export async function getStock(): Promise<StockMap> {
  return load();
}

// Écrit un stock complet (valeurs absolues). Utilisé par la page de gestion.
export async function setStock(next: StockMap): Promise<StockMap> {
  const clean: StockMap = {};
  for (const p of PRODUCTS) {
    clean[p.slug] = SIZES.reduce((acc, s) => {
      const v = Number(next?.[p.slug]?.[s]);
      acc[s] = Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
      return acc;
    }, {} as Record<Size, number>);
  }
  await save(clean);
  return clean;
}

// Ajuste une case de ±delta (ex : -1 pour une vente en physique). Ne descend pas sous 0.
export async function adjustStock(
  slug: string,
  size: Size,
  delta: number
): Promise<StockMap> {
  const stock = await load();
  if (stock[slug] && stock[slug][size] !== undefined) {
    stock[slug][size] = Math.max(0, stock[slug][size] + Math.floor(delta));
    await save(stock);
  }
  return stock;
}

export interface OrderItem {
  slug: string;
  size: Size;
  quantity: number;
}

export interface OrderResult {
  ok: boolean;
  stock: StockMap;
  error?: string;
}

// Valide la disponibilité PUIS soustrait.
export async function commitOrder(items: OrderItem[]): Promise<OrderResult> {
  const stock = await load();

  for (const it of items) {
    if (!it.quantity || it.quantity <= 0) continue;
    const available = stock[it.slug]?.[it.size];
    if (available === undefined) {
      return { ok: false, stock, error: `Produit inconnu : ${it.slug}.` };
    }
    if (available < it.quantity) {
      return {
        ok: false,
        stock,
        error: `Stock insuffisant (${it.slug} · ${it.size}) : il en reste ${available}.`,
      };
    }
  }

  for (const it of items) {
    if (!it.quantity || it.quantity <= 0) continue;
    stock[it.slug][it.size] -= it.quantity;
  }

  await save(stock);
  return { ok: true, stock };
}
