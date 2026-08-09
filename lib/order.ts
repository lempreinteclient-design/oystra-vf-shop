// Types de commande + calcul des montants CÔTÉ SERVEUR.
// On ne fait jamais confiance aux prix envoyés par le client : tout est
// recalculé à partir de lib/products.ts.

import { PRODUCTS, SHIPPING, SIZES, Size, ShippingMethod } from "./products";
import { getPromoRate, promoLabel } from "./promo";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  method: ShippingMethod;
  address?: string;
  zip?: string;
  city?: string;
  relayPoint?: string;
  instagram?: string;
}

export interface OrderItemInput {
  slug: string;
  size: Size;
  quantity: number;
}

export interface OrderLine {
  slug: string;
  name: string;
  colorName: string;
  size: Size;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ComputedOrder {
  lines: OrderLine[];
  subtotal: number;
  promoCode: string | null;
  promoLabel: string | null;
  discount: number;
  shippingLabel: string;
  shippingCost: number;
  total: number;
}

export function isValidMethod(m: unknown): m is ShippingMethod {
  return m === "relay" || m === "home" || m === "pickup";
}

export function sanitizeItems(raw: unknown): OrderItemInput[] {
  if (!Array.isArray(raw)) return [];
  const out: OrderItemInput[] = [];
  for (const r of raw) {
    const o = r as Partial<OrderItemInput>;
    if (
      typeof o.slug === "string" &&
      typeof o.size === "string" &&
      SIZES.includes(o.size as Size) &&
      typeof o.quantity === "number" &&
      o.quantity > 0
    ) {
      out.push({ slug: o.slug, size: o.size as Size, quantity: Math.min(20, Math.floor(o.quantity)) });
    }
  }
  return out;
}

// Recalcule tout à partir du catalogue serveur. Renvoie null si un article est inconnu.
export function computeOrder(
  items: OrderItemInput[],
  method: ShippingMethod,
  promoCode?: string | null
): ComputedOrder | null {
  const lines: OrderLine[] = [];
  for (const it of items) {
    const p = PRODUCTS.find((x) => x.slug === it.slug);
    if (!p) return null;
    lines.push({
      slug: p.slug,
      name: p.name,
      colorName: p.colorName,
      size: it.size,
      quantity: it.quantity,
      unitPrice: p.price,
      lineTotal: p.price * it.quantity,
    });
  }
  if (lines.length === 0) return null;
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const ship = SHIPPING[method];

  const rate = getPromoRate(promoCode);
  const discount = rate > 0 ? Math.round(subtotal * rate * 100) / 100 : 0;
  const code = rate > 0 ? (promoCode || "").trim().toLowerCase() : null;

  return {
    lines,
    subtotal,
    promoCode: code,
    promoLabel: code ? promoLabel(code) : null,
    discount,
    shippingLabel: ship.label,
    shippingCost: ship.price,
    total: Math.max(0, subtotal - discount) + ship.price,
  };
}

export const euros = (n: number) => `${n.toFixed(2)} €`;
