// =============================================================
// Stockage clé-valeur générique
// - Prod : Vercel KV / Upstash (si KV_REST_API_URL + KV_REST_API_TOKEN)
// - Local/sans config : fichier /tmp (suffisant en dev)
// Utilisé pour : compteur de factures + anti-doublon des webhooks.
// =============================================================

import { promises as fs } from "fs";
import path from "path";

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const USE_KV = Boolean(KV_URL && KV_TOKEN);
const TMP = path.join("/tmp", "oystra-kv.json");

async function fileAll(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await fs.readFile(TMP, "utf8"));
  } catch {
    return {};
  }
}
async function fileWrite(obj: Record<string, string>) {
  try {
    await fs.writeFile(TMP, JSON.stringify(obj));
  } catch {
    /* ignore */
  }
}

export async function kvGet(key: string): Promise<string | null> {
  if (USE_KV) {
    try {
      const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      });
      if (!r.ok) return null;
      const j = (await r.json()) as { result?: string | null };
      return j.result ?? null;
    } catch {
      return null;
    }
  }
  const all = await fileAll();
  return all[key] ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (USE_KV) {
    try {
      await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
    } catch {
      /* ignore */
    }
    return;
  }
  const all = await fileAll();
  all[key] = value;
  await fileWrite(all);
}

// Incrémente un compteur de façon atomique et renvoie la nouvelle valeur.
export async function kvIncr(key: string): Promise<number> {
  if (USE_KV) {
    try {
      const r = await fetch(`${KV_URL}/incr/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      });
      const j = (await r.json()) as { result?: number };
      return j.result ?? 0;
    } catch {
      return 0;
    }
  }
  const all = await fileAll();
  const next = (parseInt(all[key] || "0", 10) || 0) + 1;
  all[key] = String(next);
  await fileWrite(all);
  return next;
}

// Pose un verrou une seule fois (renvoie true si posé, false s'il existait déjà).
export async function kvSetOnce(key: string): Promise<boolean> {
  const existing = await kvGet(key);
  if (existing) return false;
  await kvSet(key, "1");
  return true;
}
