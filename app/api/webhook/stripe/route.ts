import { NextResponse } from "next/server";
import Stripe from "stripe";
import { commitOrder } from "@/lib/stock-store";
import {
  sanitizeItems,
  isValidMethod,
  computeOrder,
  OrderCustomer,
} from "@/lib/order";
import { nextInvoiceNumber, buildInvoicePDF } from "@/lib/invoice";
import { sendOrderEmails, pushToSheet } from "@/lib/email";
import { kvSetOnce } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }
  const stripe = new Stripe(secret);

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig || "", whSecret);
  } catch (e) {
    console.error("Signature webhook invalide", e);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Anti-doublon : Stripe peut renvoyer l'événement plusieurs fois.
  const firstTime = await kvSetOnce(`processed:${session.id}`);
  if (!firstTime) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, unpaid: true });
  }

  const m = session.metadata || {};
  const items = sanitizeItems(JSON.parse(m.items || "[]"));
  const method = m.method;
  if (!isValidMethod(method) || items.length === 0) {
    console.error("Metadata commande invalides", m);
    return NextResponse.json({ received: true, badMeta: true });
  }

  const order = computeOrder(items, method, m.promoCode);
  if (!order) return NextResponse.json({ received: true, badOrder: true });

  const customer: OrderCustomer = {
    name: m.name || "",
    email: m.email || session.customer_details?.email || "",
    phone: m.phone || "",
    method,
    address: m.address || "",
    zip: m.zip || "",
    city: m.city || "",
    relayPoint: m.relayPoint || "",
    instagram: m.instagram || "",
  };

  // 1) Décrément du stock (paiement confirmé)
  try {
    await commitOrder(items.map((it) => ({ slug: it.slug, size: it.size, quantity: it.quantity })));
  } catch (e) {
    console.error("Décrément stock échoué", e);
  }

  // 2) Facture + emails + Google Sheet
  try {
    const invoiceNumber = await nextInvoiceNumber();
    const pdf = await buildInvoicePDF({
      invoiceNumber,
      date: new Date(),
      order,
      customer,
    });
    await sendOrderEmails({ order, customer, invoiceNumber, pdf });
    await pushToSheet({ order, customer, invoiceNumber });
  } catch (e) {
    console.error("Facture / email échoués", e);
  }

  return NextResponse.json({ received: true });
}
