"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, lineKey } from "@/lib/cart-context";
import { SHIPPING, ShippingMethod } from "@/lib/products";
import { getPromoRate, promoLabel } from "@/lib/promo";
import { TEASER_MODE, isDropped } from "@/lib/drop";

const METHODS: ShippingMethod[] = ["relay", "home", "pickup"];

export default function CommandePage() {
  const { lines, subtotal, itemCount } = useCart();
  const [method, setMethod] = useState<ShippingMethod>("relay");
  const [pending, setPending] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    relayPoint: "",
    instagram: "",
  });

  const shippingCost = SHIPPING[method].price;
  const promoRate = getPromoRate(promoCode);
  const discount = promoRate > 0 ? Math.round(subtotal * promoRate * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount) + shippingCost;
  const locked = TEASER_MODE && !isDropped();

  function applyPromo() {
    const rate = getPromoRate(promoInput);
    if (rate > 0) {
      setPromoCode(promoInput.trim().toLowerCase());
      setPromoMsg(`Code ${promoLabel(promoInput)} appliqué !`);
    } else {
      setPromoCode(null);
      setPromoMsg("Code promo invalide.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            slug: l.productSlug,
            size: l.size,
            quantity: l.quantity,
          })),
          customer: { ...form, method },
          promoCode: promoCode ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setOrderError(
          data?.error ??
            "Une taille vient de partir ou le paiement est indisponible. Réessaie."
        );
        setPending(false);
        return;
      }
      window.location.href = data.url; // page de paiement sécurisée Stripe
    } catch {
      setOrderError("Connexion impossible. Réessaie dans un instant.");
      setPending(false);
    }
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-[var(--color-bone)] mb-4">Panier vide</h1>
        <p className="font-mono text-sm text-[var(--color-bone-dim)] mb-9">
          Ajoute un t-shirt avant de passer commande.
        </p>
        <Link
          href="/#produits"
          className="inline-block bg-[var(--color-blood)] text-[var(--color-bone)] px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors"
        >
          Voir les t-shirts
        </Link>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="mx-auto max-w-lg px-5 sm:px-8 py-28 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-blood)] mb-4">
          Drop 01 — 15 août
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bone)] mb-5">
          Pas encore
        </h1>
        <p className="text-[var(--color-bone-dim)] text-sm leading-relaxed mb-9">
          La boutique ouvre le 15 août. Garde ton panier de côté&nbsp;: tu
          pourras valider ta commande dès l&apos;ouverture.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--color-blood)] text-[var(--color-bone)] px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bone)] mb-12">
        Commande
      </h1>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-14">
        <form onSubmit={handleSubmit} className="space-y-11">
          {/* MODE DE RÉCEPTION */}
          <fieldset>
            <legend className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-4">
              Mode de réception
            </legend>
            <div className="space-y-3">
              {METHODS.map((m) => (
                <label
                  key={m}
                  className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                    method === m
                      ? "border-[var(--color-blood)] bg-[var(--color-blood)]/[0.06]"
                      : "border-[var(--color-bone)]/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    className="mt-1 accent-[var(--color-blood)]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[var(--color-bone)]">{SHIPPING[m].label}</span>
                      <span className="font-mono text-sm text-[var(--color-bone)] shrink-0">
                        {SHIPPING[m].price === 0 ? "Gratuit" : `${SHIPPING[m].price.toFixed(2)} €`}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-[var(--color-bone-dim)] mt-1.5">
                      {SHIPPING[m].description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* COORDONNÉES */}
          <fieldset className="space-y-4">
            <legend className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-1">
              Coordonnées
            </legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nom complet" required autoComplete="name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="Email" type="email" required autoComplete="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            </div>
            <Field label="Téléphone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />

            {method === "relay" && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Code postal" required autoComplete="postal-code" value={form.zip} onChange={(v) => setForm((f) => ({ ...f, zip: v }))} />
                  <Field label="Ville" required autoComplete="address-level2" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                </div>
                <Field label="Point relais souhaité" placeholder="Optionnel — sinon on choisit le plus proche" value={form.relayPoint} onChange={(v) => setForm((f) => ({ ...f, relayPoint: v }))} />
              </>
            )}

            {method === "home" && (
              <>
                <Field label="Adresse" required autoComplete="address-line1" value={form.address} onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Code postal" required autoComplete="postal-code" value={form.zip} onChange={(v) => setForm((f) => ({ ...f, zip: v }))} />
                  <Field label="Ville" required autoComplete="address-level2" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                </div>
              </>
            )}

            {method === "pickup" && (
              <Field label="Pseudo Instagram" placeholder="@tonpseudo — pour fixer le rendez-vous" value={form.instagram} onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} />
            )}
          </fieldset>

          <div className="border border-[var(--color-bone)]/10 bg-[var(--color-void-2)] p-4 font-mono text-[11px] text-[var(--color-bone-dim)] leading-relaxed">
            Paiement sécurisé par carte (Stripe) à l&apos;étape suivante. Tes
            informations ne servent qu&apos;au traitement de ta commande.
          </div>

          {orderError && (
            <div className="border border-[var(--color-blood)]/40 bg-[var(--color-blood)]/[0.08] p-4 font-mono text-[11px] text-[var(--color-blood)] leading-relaxed">
              {orderError}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--color-blood)] text-[var(--color-bone)] py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Redirection vers le paiement…" : `Commander — obligation de paiement · ${total.toFixed(2)} €`}
          </button>
        </form>

        {/* RÉCAP */}
        <div className="lg:pl-4">
          <div className="border border-[var(--color-bone)]/10 p-6 sticky top-24">
            <h2 className="font-display text-xl text-[var(--color-bone)] mb-6">Récap</h2>
            <div className="space-y-4 mb-6">
              {lines.map((l) => (
                <div key={lineKey(l)} className="flex gap-3">
                  <div className="relative w-14 h-16 shrink-0 overflow-hidden bg-[var(--color-void-2)]">
                    <Image src={l.image} alt={l.productName} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-bone)] leading-tight">{l.productName}</p>
                    <p className="font-mono text-[10px] text-[var(--color-bone-dim)] mt-1">
                      {l.variantName} · {l.size} · x{l.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[var(--color-bone)]">
                    {(l.price * l.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-bone)]/10 pt-4 space-y-2 font-mono text-xs">
              {/* Code promo */}
              <div className="pb-3">
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Code promo"
                    className="flex-1 border border-[var(--color-bone)]/20 px-3 py-2 text-xs bg-[var(--color-void-2)] text-[var(--color-bone)] placeholder:text-[var(--color-bone-dim)]/50 focus:border-[var(--color-blood)] outline-none uppercase tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-4 py-2 border border-[var(--color-bone)]/25 text-[var(--color-bone)] text-xs uppercase tracking-wide hover:border-[var(--color-blood)] hover:text-[var(--color-blood)] transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {promoMsg && (
                  <p
                    className={`mt-2 text-[11px] ${
                      promoCode ? "text-[var(--color-blood)]" : "text-[var(--color-bone-dim)]"
                    }`}
                  >
                    {promoMsg}
                  </p>
                )}
              </div>

              <div className="flex justify-between text-[var(--color-bone-dim)]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--color-blood)]">
                  <span>Remise {promoLabel(promoCode)}</span>
                  <span>-{discount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--color-bone-dim)]">
                <span>Livraison</span>
                <span>{shippingCost === 0 ? "Gratuit" : `${shippingCost.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-bone)] pt-3 border-t border-[var(--color-bone)]/10 mt-3">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-bone-dim)] mb-2 block">
        {label} {required && <span className="text-[var(--color-blood)]">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[var(--color-bone)]/20 px-3.5 py-2.5 text-sm bg-[var(--color-void-2)] text-[var(--color-bone)] placeholder:text-[var(--color-bone-dim)]/50 focus:border-[var(--color-blood)] outline-none transition-colors"
      />
    </label>
  );
}
