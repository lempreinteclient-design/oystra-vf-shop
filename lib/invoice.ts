// Génère la facture PDF (pdf-lib, polices standard, compatible serverless)
// et gère la numérotation chronologique sans trou (compteur KV).

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { LEGAL } from "./legal";
import { ComputedOrder, OrderCustomer, euros } from "./order";
import { kvIncr } from "./kv";

// Numéro de facture : AAAA-NNN (ex : 2026-001), incrément atomique.
export async function nextInvoiceNumber(now = new Date()): Promise<string> {
  const year = now.getFullYear();
  const n = await kvIncr(`invoice:counter:${year}`);
  return `${year}-${String(n).padStart(3, "0")}`;
}

export async function buildInvoicePDF(params: {
  invoiceNumber: string;
  date: Date;
  order: ComputedOrder;
  customer: OrderCustomer;
}): Promise<Uint8Array> {
  const { invoiceNumber, date, order, customer } = params;
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const M = 50;
  const W = page.getWidth();
  const dark = rgb(0.09, 0.09, 0.09);
  const gray = rgb(0.42, 0.42, 0.42);
  const line = rgb(0.85, 0.85, 0.85);
  let y = 792;

  const text = (
    s: string,
    x: number,
    yy: number,
    size = 9,
    f = font,
    color = dark
  ) => page.drawText(s, { x, y: yy, size, font: f, color });

  const right = (
    s: string,
    xRight: number,
    yy: number,
    size = 9,
    f = font,
    color = dark
  ) => {
    const w = f.widthOfTextAtSize(s, size);
    page.drawText(s, { x: xRight - w, y: yy, size, font: f, color });
  };

  // En-tête : marque + vendeur
  text(LEGAL.brand, M, y, 22, bold);
  text(LEGAL.tradeName, M, y - 16, 8, font, gray);

  const rx = W - M;
  right(LEGAL.ownerName, rx, y, 9, bold);
  right(LEGAL.status, rx, y - 12, 8, font, gray);
  right(LEGAL.address, rx, y - 23, 8, font, gray);
  right(`SIRET ${LEGAL.siret}`, rx, y - 34, 8, font, gray);
  right(LEGAL.email, rx, y - 45, 8, font, gray);

  y -= 78;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: line });
  y -= 24;

  // Titre + n° + client
  text("FACTURE", M, y, 16, bold);
  text(`N° ${invoiceNumber}`, M, y - 18, 9, font, gray);
  text(`Date : ${date.toLocaleDateString("fr-FR")}`, M, y - 31, 9, font, gray);

  right("FACTURÉ À", rx, y, 8, bold, gray);
  right(customer.name || "—", rx, y - 14, 9, bold);
  const addr =
    customer.method === "home"
      ? [customer.address, `${customer.zip ?? ""} ${customer.city ?? ""}`.trim()]
      : customer.method === "relay"
      ? [`Point relais${customer.relayPoint ? ` : ${customer.relayPoint}` : ""}`, `${customer.zip ?? ""} ${customer.city ?? ""}`.trim()]
      : ["Retrait à Saint-Denis-d'Oléron"];
  let ay = y - 27;
  for (const l of addr.filter(Boolean)) {
    right(l as string, rx, ay, 8, font, gray);
    ay -= 11;
  }
  right(customer.email, rx, ay, 8, font, gray);

  y -= 66;

  // Tableau
  const colQty = W - M - 210;
  const colPu = W - M - 120;
  const colTot = W - M;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: line });
  y -= 14;
  text("DÉSIGNATION", M, y, 8, bold, gray);
  right("QTÉ", colQty, y, 8, bold, gray);
  right("PRIX UNIT.", colPu, y, 8, bold, gray);
  right("TOTAL", colTot, y, 8, bold, gray);
  y -= 8;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.7, color: line });
  y -= 16;

  for (const l of order.lines) {
    text(`T-shirt ${LEGAL.brand} — ${l.colorName} (${l.size})`, M, y, 9);
    right(String(l.quantity), colQty, y, 9);
    right(euros(l.unitPrice), colPu, y, 9);
    right(euros(l.lineTotal), colTot, y, 9);
    y -= 16;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: W - M, y: y + 4 }, thickness: 0.4, color: rgb(0.93, 0.93, 0.93) });
  }

  // Livraison
  text(order.shippingLabel, M, y, 9, font, gray);
  right(order.shippingCost === 0 ? "Gratuit" : euros(order.shippingCost), colTot, y, 9);
  y -= 22;

  // Totaux
  right("Sous-total", colPu, y, 9, font, gray);
  right(euros(order.subtotal), colTot, y, 9);
  y -= 14;
  if (order.discount > 0) {
    right(`Remise ${order.promoLabel ?? ""}`.trim(), colPu, y, 9, font, gray);
    right(`-${euros(order.discount)}`, colTot, y, 9);
    y -= 14;
  }
  right("Livraison", colPu, y, 9, font, gray);
  right(order.shippingCost === 0 ? "Gratuit" : euros(order.shippingCost), colTot, y, 9);
  y -= 6;
  page.drawLine({ start: { x: colPu - 40, y }, end: { x: W - M, y }, thickness: 0.7, color: line });
  y -= 16;
  right("TOTAL", colPu, y, 11, bold);
  right(euros(order.total), colTot, y, 11, bold);

  // Mentions légales bas de page
  y = 120;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.7, color: line });
  y -= 16;
  text(LEGAL.vatMention, M, y, 8, bold, gray);
  y -= 12;
  text("Paiement par carte bancaire (Stripe).", M, y, 8, font, gray);
  y -= 18;
  text(
    `${LEGAL.brand} — ${LEGAL.ownerName}, ${LEGAL.status}`,
    M,
    y,
    7,
    font,
    gray
  );
  y -= 10;
  text(`SIRET ${LEGAL.siret} · ${LEGAL.address}`, M, y, 7, font, gray);

  return doc.save();
}
