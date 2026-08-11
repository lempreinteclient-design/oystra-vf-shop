import { NextResponse } from "next/server";
import { buildInvoicePDF } from "@/lib/invoice";
import { computeOrder } from "@/lib/order";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const order = computeOrder([{ slug: "tee-blanc-bleu", size: "M", quantity: 2 }], "relay", "famille15");
  if (!order) return NextResponse.json({ error: "order" }, { status: 500 });
  const pdf = await buildInvoicePDF({
    invoiceNumber: "TEST-PROMO", date: new Date(), order,
    customer: { name: "Famille Test", email: "f@ex.com", phone: "06", method: "relay", zip: "17650", city: "Oléron" },
  });
  return new NextResponse(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "X-Subtotal": String(order.subtotal), "X-Discount": String(order.discount), "X-Total": String(order.total) } });
}
