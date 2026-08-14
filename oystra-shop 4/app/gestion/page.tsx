"use client";

import { useState } from "react";
import { PRODUCTS, SIZES, Size } from "@/lib/products";

type StockMap = Record<string, Record<Size, number>>;

export default function GestionPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [stock, setStock] = useState<StockMap | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function api(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data?.error ?? "Erreur.");
        setBusy(false);
        return null;
      }
      setBusy(false);
      return data.stock as StockMap;
    } catch {
      setMsg("Connexion impossible.");
      setBusy(false);
      return null;
    }
  }

  async function unlock() {
    const s = await api("read");
    if (s) {
      setStock(s);
      setUnlocked(true);
    }
  }

  function edit(slug: string, size: Size, value: string) {
    const v = Math.max(0, parseInt(value || "0", 10) || 0);
    setStock((prev) => (prev ? { ...prev, [slug]: { ...prev[slug], [size]: v } } : prev));
  }

  async function saveAll() {
    if (!stock) return;
    const s = await api("set", { stock });
    if (s) {
      setStock(s);
      setMsg("Stock enregistré ✓");
    }
  }

  async function adjust(slug: string, size: Size, delta: number) {
    const s = await api("adjust", { slug, size, delta });
    if (s) {
      setStock(s);
      setMsg(delta < 0 ? "Vente enregistrée (−1) ✓" : "Ajout (+1) ✓");
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm px-5 py-32">
        <h1 className="font-display text-3xl text-[var(--color-bone)] mb-2">Gestion</h1>
        <p className="font-mono text-xs text-[var(--color-bone-dim)] mb-8">
          Espace privé — gestion des stocks.
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          placeholder="Code d'accès"
          className="w-full border border-[var(--color-bone)]/20 px-4 py-3 text-sm bg-[var(--color-void-2)] text-[var(--color-bone)] placeholder:text-[var(--color-bone-dim)]/50 focus:border-[var(--color-blood)] outline-none mb-4"
        />
        <button
          onClick={unlock}
          disabled={busy || !code}
          className="w-full bg-[var(--color-blood)] text-[var(--color-bone)] py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors disabled:opacity-60"
        >
          {busy ? "..." : "Entrer"}
        </button>
        {msg && <p className="mt-4 font-mono text-[11px] text-[var(--color-blood)]">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[var(--color-bone)]">Gestion des stocks</h1>
        <button
          onClick={saveAll}
          disabled={busy}
          className="bg-[var(--color-blood)] text-[var(--color-bone)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors disabled:opacity-60"
        >
          Enregistrer tout
        </button>
      </div>

      {msg && (
        <p className="mb-6 font-mono text-[11px] text-[var(--color-blood)] border border-[var(--color-blood)]/30 bg-[var(--color-blood)]/[0.06] px-4 py-2">
          {msg}
        </p>
      )}

      <div className="space-y-8">
        {PRODUCTS.map((p) => (
          <div key={p.slug} className="border border-[var(--color-bone)]/12 p-5">
            <h2 className="font-display text-xl text-[var(--color-bone)] mb-1">{p.colorName}</h2>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-5">
              {p.slug}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {SIZES.map((s) => (
                <div key={s} className="border border-[var(--color-bone)]/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[var(--color-bone-dim)]">Taille</span>
                    <span className="font-mono text-sm text-[var(--color-bone)]">{s}</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={stock?.[p.slug]?.[s] ?? 0}
                    onChange={(e) => edit(p.slug, s, e.target.value)}
                    className="w-full border border-[var(--color-bone)]/20 px-2 py-2 text-center text-lg bg-[var(--color-void-2)] text-[var(--color-bone)] focus:border-[var(--color-blood)] outline-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjust(p.slug, s, -1)}
                      disabled={busy}
                      className="flex-1 border border-[var(--color-bone)]/25 py-1.5 font-mono text-sm text-[var(--color-bone)] hover:border-[var(--color-blood)] hover:text-[var(--color-blood)] transition-colors disabled:opacity-40"
                      title="Vente physique −1"
                    >
                      −1
                    </button>
                    <button
                      onClick={() => adjust(p.slug, s, 1)}
                      disabled={busy}
                      className="flex-1 border border-[var(--color-bone)]/25 py-1.5 font-mono text-sm text-[var(--color-bone)] hover:border-[var(--color-blood)] hover:text-[var(--color-blood)] transition-colors disabled:opacity-40"
                      title="Réassort +1"
                    >
                      +1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 font-mono text-[10px] text-[var(--color-bone-dim)]/70 leading-relaxed">
        « −1 » enregistre une vente physique immédiatement. Les champs + « Enregistrer tout »
        écrasent le stock avec les valeurs saisies. Le stock en ligne se met à jour tout seul
        à chaque vente sur le site.
      </p>
    </div>
  );
}
