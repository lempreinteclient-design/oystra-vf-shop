"use client";

import { useMemo, useState } from "react";
import { LEGAL } from "@/lib/legal";

// GÉNÉRATEUR DE FACTURES (usage interne) — page non indexée, non liée.
// Tu remplis le client + les articles, tu cliques "Imprimer / PDF".
// Toutes les mentions légales obligatoires sont pré-remplies depuis lib/legal.ts.
// Numérotation chronologique : à toi de garder la suite (2026-001, 002, ...).

type Item = { label: string; qty: number; price: number };

const SHIP_LABELS: Record<string, string> = {
  relay: "Livraison Point Relais (Mondial Relay)",
  home: "Livraison à domicile (Mondial Relay)",
  pickup: "Retrait en main propre (Saint-Denis-d'Oléron)",
};

export default function FacturePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [num, setNum] = useState("2026-001");
  const [date, setDate] = useState(today);
  const [client, setClient] = useState({ name: "", address: "", email: "" });
  const [items, setItems] = useState<Item[]>([
    { label: "T-shirt oystrå — Blanc Océan (M)", qty: 1, price: 30 },
  ]);
  const [shipKey, setShipKey] = useState("relay");
  const [shipCost, setShipCost] = useState(4.9);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.qty * it.price, 0),
    [items]
  );
  const total = subtotal + Number(shipCost || 0);

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((arr) => arr.map((it, k) => (k === i ? { ...it, ...patch } : it)));

  return (
    <div className="facture-page min-h-screen bg-neutral-200 py-8 px-4">
      {/* BARRE D'OUTILS (écran seulement) */}
      <div className="no-print mx-auto max-w-[820px] mb-6 rounded bg-white p-5 shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-neutral-800">
            Générateur de factures
          </h1>
          <button
            onClick={() => window.print()}
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            Imprimer / PDF
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="block">
            <span className="text-neutral-500 text-xs">N° de facture</span>
            <input className="tb" value={num} onChange={(e) => setNum(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-neutral-500 text-xs">Date</span>
            <input type="date" className="tb" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block col-span-2">
            <span className="text-neutral-500 text-xs">Client — nom</span>
            <input className="tb" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
          </label>
          <label className="block col-span-2">
            <span className="text-neutral-500 text-xs">Client — adresse</span>
            <input className="tb" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
          </label>
          <label className="block col-span-2">
            <span className="text-neutral-500 text-xs">Client — email</span>
            <input className="tb" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
          </label>
        </div>

        <div className="mt-4">
          <span className="text-neutral-500 text-xs">Articles</span>
          {items.map((it, i) => (
            <div key={i} className="mt-2 flex gap-2">
              <input
                className="tb flex-1"
                value={it.label}
                onChange={(e) => setItem(i, { label: e.target.value })}
                placeholder="Désignation"
              />
              <input
                type="number"
                className="tb w-16"
                value={it.qty}
                min={1}
                onChange={(e) => setItem(i, { qty: Number(e.target.value) })}
              />
              <input
                type="number"
                className="tb w-24"
                value={it.price}
                step="0.01"
                onChange={(e) => setItem(i, { price: Number(e.target.value) })}
              />
              <button
                onClick={() => setItems((a) => a.filter((_, k) => k !== i))}
                className="px-2 text-neutral-400 hover:text-red-600"
                aria-label="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setItems((a) => [...a, { label: "", qty: 1, price: 30 }])}
            className="mt-2 text-sm text-neutral-600 underline"
          >
            + Ajouter un article
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <label className="block">
            <span className="text-neutral-500 text-xs">Livraison</span>
            <select
              className="tb"
              value={shipKey}
              onChange={(e) => {
                setShipKey(e.target.value);
                setShipCost(e.target.value === "relay" ? 4.9 : e.target.value === "home" ? 6.9 : 0);
              }}
            >
              <option value="relay">Point Relais — 4,90 €</option>
              <option value="home">Domicile — 6,90 €</option>
              <option value="pickup">Retrait Oléron — 0 €</option>
            </select>
          </label>
          <label className="block">
            <span className="text-neutral-500 text-xs">Frais de livraison (€)</span>
            <input type="number" step="0.01" className="tb" value={shipCost} onChange={(e) => setShipCost(Number(e.target.value))} />
          </label>
        </div>
      </div>

      {/* LA FACTURE (écran + impression) */}
      <div className="sheet mx-auto max-w-[820px] bg-white p-10 shadow text-neutral-900">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight">{LEGAL.brand}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{LEGAL.tradeName}</p>
          </div>
          <div className="text-right text-xs leading-relaxed">
            <p className="font-semibold text-neutral-800">{LEGAL.ownerName}</p>
            <p className="text-neutral-600">{LEGAL.status}</p>
            <p className="text-neutral-600">{LEGAL.address}</p>
            <p className="text-neutral-600">SIRET {LEGAL.siret}</p>
            <p className="text-neutral-600">{LEGAL.email}</p>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl font-bold">FACTURE</h2>
            <p className="text-sm text-neutral-600 mt-1">N° {num}</p>
            <p className="text-sm text-neutral-600">
              Date : {new Date(date).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Facturé à</p>
            <p className="font-medium">{client.name || "—"}</p>
            {client.address && <p className="text-neutral-600">{client.address}</p>}
            {client.email && <p className="text-neutral-600">{client.email}</p>}
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-left text-neutral-500 text-xs uppercase tracking-wide">
              <th className="py-2">Désignation</th>
              <th className="py-2 text-center w-16">Qté</th>
              <th className="py-2 text-right w-28">Prix unit.</th>
              <th className="py-2 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-neutral-100">
                <td className="py-2.5">{it.label || "—"}</td>
                <td className="py-2.5 text-center">{it.qty}</td>
                <td className="py-2.5 text-right">{it.price.toFixed(2)} €</td>
                <td className="py-2.5 text-right">{(it.qty * it.price).toFixed(2)} €</td>
              </tr>
            ))}
            <tr className="border-b border-neutral-100">
              <td className="py-2.5 text-neutral-600" colSpan={3}>
                {SHIP_LABELS[shipKey]}
              </td>
              <td className="py-2.5 text-right">
                {Number(shipCost) === 0 ? "Gratuit" : `${Number(shipCost).toFixed(2)} €`}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Livraison</span>
              <span>{Number(shipCost) === 0 ? "Gratuit" : `${Number(shipCost).toFixed(2)} €`}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-300 py-2 mt-1 text-base font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-4 text-xs text-neutral-500 leading-relaxed">
          <p className="font-medium text-neutral-700">{LEGAL.vatMention}</p>
          <p className="mt-1">Paiement par carte bancaire (Stripe).</p>
          <p className="mt-3">
            {LEGAL.brand} — {LEGAL.ownerName}, {LEGAL.status} · SIRET {LEGAL.siret} · {LEGAL.address}
          </p>
        </div>
      </div>

      <style jsx global>{`
        .tb {
          width: 100%;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          padding: 6px 8px;
          margin-top: 2px;
          color: #171717;
        }
        @media print {
          .facture-page { background: #fff !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .sheet { box-shadow: none !important; max-width: none !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
