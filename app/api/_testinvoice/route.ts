import { NextResponse } from "next/server";
import { buildInvoicePDF } from "@/lib/invoice";
import { computeOrder } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const order = computeOrder(
    [
      { slug: "tee-blanc-bleu", size: "M", quantity: 1 },
      { slug: "tee-rose-rouge", size: "L", quantity: 2 },
    ],
    "relay"
  );
  if (!order) return NextResponse.json({ error: "order" }, { status: 500 });
  const pdf = await buildInvoicePDF({
    invoiceNumber: "TEST-001",
    date: new Date(),
    order,
    customer: {
      name: "Marie Test", email: "marie@example.com", phone: "0612345678",
      method: "relay", zip: "17650", city: "Saint-Denis-d'Oléron", relayPoint: "Tabac du Port",
    },
  });
  return new NextResponse(Buffer.from(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
}
