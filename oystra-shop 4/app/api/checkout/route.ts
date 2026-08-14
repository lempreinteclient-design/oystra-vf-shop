import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStock } from "@/lib/stock-store";
import {
  sanitizeItems,
  isValidMethod,
  computeOrder,
  OrderCustomer,
} from "@/lib/order";
import { getPromoRate } from "@/lib/promo";
import { TEASER_MODE, isDropped } from "@/lib/drop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://oystra.fr";

export async function POST(req: Request) {
  // Ventes bloquées avant le drop.
  if (TEASER_MODE && !isDropped()) {
    return NextResponse.json({ error: "La boutique ouvre le 15 août." }, { status: 403 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paiement non configuré." }, { status: 500 });
  }
  const stripe = new Stripe(secret);

  let body: { items?: unknown; customer?: Partial<OrderCustomer>; promoCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const items = sanitizeItems(body.items);
  const c = body.customer || {};
  const promoCode = typeof body.promoCode === "string" ? body.promoCode : "";
  if (items.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }
  if (!isValidMethod(c.method)) {
    return NextResponse.json({ error: "Mode de livraison invalide." }, { status: 400 });
  }
  if (!c.name || !c.email || !c.phone) {
    return NextResponse.json({ error: "Coordonnées incomplètes." }, { status: 400 });
  }

  // Vérifie la disponibilité (le vrai décrément se fait au webhook, après paiement).
  const stock = await getStock();
  for (const it of items) {
    const avail = stock[it.slug]?.[it.size] ?? 0;
    if (avail < it.quantity) {
      return NextResponse.json(
        { error: `Stock insuffisant pour une taille ${it.size}.` },
        { status: 409 }
      );
    }
  }

  const order = computeOrder(items, c.method, promoCode);
  if (!order) {
    return NextResponse.json({ error: "Article inconnu." }, { status: 400 });
  }

  const customer: OrderCustomer = {
    name: String(c.name).slice(0, 120),
    email: String(c.email).slice(0, 160),
    phone: String(c.phone).slice(0, 40),
    method: c.method,
    address: c.address ? String(c.address).slice(0, 200) : "",
    zip: c.zip ? String(c.zip).slice(0, 20) : "",
    city: c.city ? String(c.city).slice(0, 80) : "",
    relayPoint: c.relayPoint ? String(c.relayPoint).slice(0, 160) : "",
    instagram: c.instagram ? String(c.instagram).slice(0, 80) : "",
  };

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = order.lines.map((l) => ({
    quantity: l.quantity,
    price_data: {
      currency: "eur",
      unit_amount: Math.round(l.unitPrice * 100),
      product_data: { name: `T-shirt oystrå — ${l.colorName} (${l.size})` },
    },
  }));

  const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: order.shippingLabel,
        fixed_amount: { amount: Math.round(order.shippingCost * 100), currency: "eur" },
      },
    },
  ];

  try {
    // Remise : coupon Stripe réutilisable (s'affiche sur la page de paiement).
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (order.discount > 0 && order.promoCode) {
      const percent = Math.round(getPromoRate(order.promoCode) * 100);
      const couponId = `oystra-${order.promoCode}-${percent}`;
      try {
        await stripe.coupons.retrieve(couponId);
      } catch {
        try {
          await stripe.coupons.create({
            id: couponId,
            percent_off: percent,
            duration: "once",
            name: order.promoCode,
          });
        } catch {
          /* course entre deux requêtes : le coupon existe déjà, on continue */
        }
      }
      discounts = [{ coupon: couponId }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items,
      shipping_options,
      discounts,
      customer_email: customer.email,
      success_url: `${SITE}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/commande`,
      metadata: {
        items: JSON.stringify(items).slice(0, 500),
        promoCode: order.promoCode || "",
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        method: customer.method,
        address: customer.address || "",
        zip: customer.zip || "",
        city: customer.city || "",
        relayPoint: customer.relayPoint || "",
        instagram: customer.instagram || "",
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error", e);
    return NextResponse.json({ error: "Impossible de démarrer le paiement." }, { status: 500 });
  }
}
