// Envoi des emails via Resend :
//  - à TOI (shop) : récap complet de la commande + facture PDF en pièce jointe
//  - au CLIENT : sa facture PDF
// Nécessite les variables d'env : RESEND_API_KEY, EMAIL_FROM, SHOP_EMAIL.

import { Resend } from "resend";
import { ComputedOrder, OrderCustomer, euros } from "./order";
import { LEGAL } from "./legal";

const FROM = process.env.EMAIL_FROM || "oystra <onboarding@resend.dev>";
const SHOP = process.env.SHOP_EMAIL || LEGAL.email;

function methodLabel(m: OrderCustomer["method"]) {
  return m === "relay" ? "Point Relais" : m === "home" ? "Domicile" : "Retrait Oléron";
}

function shopHtml(o: ComputedOrder, c: OrderCustomer, invoiceNumber: string) {
  const rows = o.lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 8px">${l.colorName} — ${l.size}</td><td style="padding:4px 8px;text-align:center">x${l.quantity}</td><td style="padding:4px 8px;text-align:right">${euros(
          l.lineTotal
        )}</td></tr>`
    )
    .join("");
  const deliv =
    c.method === "home"
      ? `${c.address}<br>${c.zip ?? ""} ${c.city ?? ""}`
      : c.method === "relay"
      ? `Point relais${c.relayPoint ? " souhaité : " + c.relayPoint : ""}<br>${c.zip ?? ""} ${c.city ?? ""}`
      : `Retrait main propre${c.instagram ? " — Insta : " + c.instagram : ""}`;
  return `
  <div style="font-family:system-ui,Arial;color:#111;max-width:560px">
    <h2 style="margin:0 0 4px">Nouvelle commande — facture ${invoiceNumber}</h2>
    <p style="color:#666;margin:0 0 16px">Paiement confirmé.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #eee">${rows}
      <tr><td style="padding:4px 8px;color:#666">${o.shippingLabel}</td><td></td><td style="padding:4px 8px;text-align:right">${
    o.shippingCost === 0 ? "Gratuit" : euros(o.shippingCost)
  }</td></tr>
      ${
        o.discount > 0
          ? `<tr><td style="padding:4px 8px;color:#c4203a">Remise ${o.promoLabel ?? ""}</td><td></td><td style="padding:4px 8px;text-align:right;color:#c4203a">-${euros(
              o.discount
            )}</td></tr>`
          : ""
      }
      <tr><td style="padding:6px 8px;font-weight:700;border-top:1px solid #ddd">TOTAL</td><td style="border-top:1px solid #ddd"></td><td style="padding:6px 8px;text-align:right;font-weight:700;border-top:1px solid #ddd">${euros(
    o.total
  )}</td></tr>
    </table>
    <h3 style="margin:18px 0 6px">Client</h3>
    <p style="font-size:14px;line-height:1.6;margin:0">
      <b>${c.name}</b><br>${c.email}<br>${c.phone}<br>
      <b>Livraison :</b> ${methodLabel(c.method)}<br>${deliv}
    </p>
    <p style="color:#888;font-size:12px;margin-top:18px">Facture ${invoiceNumber} en pièce jointe. Pense à générer l'étiquette Boxtal et à envoyer le n° de suivi.</p>
  </div>`;
}

function clientHtml(o: ComputedOrder, c: OrderCustomer, invoiceNumber: string) {
  return `
  <div style="font-family:system-ui,Arial;color:#111;max-width:560px">
    <h2 style="margin:0 0 8px">Merci pour ta commande ${c.name ? c.name.split(" ")[0] : ""} !</h2>
    <p style="font-size:14px;line-height:1.6">
      On a bien reçu ton paiement de <b>${euros(o.total)}</b>. Ta facture (n° ${invoiceNumber}) est en pièce jointe.
    </p>
    <p style="font-size:14px;line-height:1.6">
      ${
        c.method === "pickup"
          ? `Pour le retrait à Saint-Denis-d'Oléron, écris-nous sur Instagram ${LEGAL.instagram} pour fixer le rendez-vous.`
          : `Ton colis part sous 2-3 jours ouvrés. Tu recevras le numéro de suivi dès l'expédition.`
      }
    </p>
    <p style="color:#888;font-size:12px;margin-top:18px">${LEGAL.brand} — surfing brand · île d'Oléron<br>${LEGAL.email}</p>
  </div>`;
}

export async function sendOrderEmails(params: {
  order: ComputedOrder;
  customer: OrderCustomer;
  invoiceNumber: string;
  pdf: Uint8Array;
}) {
  const { order, customer, invoiceNumber, pdf } = params;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY manquante — emails non envoyés");
    return;
  }
  const resend = new Resend(apiKey);
  const b64 = Buffer.from(pdf).toString("base64");
  const filename = `facture-${invoiceNumber}.pdf`;

  // 1) Email au shop (toi) avec récap + facture
  await resend.emails.send({
    from: FROM,
    to: SHOP,
    replyTo: customer.email || undefined,
    subject: `Commande ${invoiceNumber} — ${customer.name} — ${euros(order.total)}`,
    html: shopHtml(order, customer, invoiceNumber),
    attachments: [{ filename, content: b64 }],
  });

  // 2) Email au client avec sa facture (si email fourni)
  if (customer.email) {
    await resend.emails.send({
      from: FROM,
      to: customer.email,
      subject: `Ta commande oystrå — facture ${invoiceNumber}`,
      html: clientHtml(order, customer, invoiceNumber),
      attachments: [{ filename, content: b64 }],
    });
  }
}

// Envoi optionnel vers un Google Sheet (via une URL Apps Script), si configurée.
export async function pushToSheet(params: {
  order: ComputedOrder;
  customer: OrderCustomer;
  invoiceNumber: string;
}) {
  const url = process.env.ORDERS_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString(),
        invoice: params.invoiceNumber,
        ...params.customer,
        items: params.order.lines
          .map((l) => `${l.colorName} ${l.size} x${l.quantity}`)
          .join(" | "),
        total: params.order.total,
      }),
    });
  } catch (e) {
    console.error("Google Sheet non joignable", e);
  }
}
