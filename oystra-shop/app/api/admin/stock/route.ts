import { NextResponse } from "next/server";
import { getStock, setStock, adjustStock } from "@/lib/stock-store";
import { SIZES, Size } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vérifie le code d'accès (variable d'env ADMIN_CODE, à définir dans Vercel).
function checkCode(code: unknown): boolean {
  const expected = process.env.ADMIN_CODE;
  if (!expected) return false; // pas de code configuré = accès refusé (sécurité)
  return typeof code === "string" && code === expected;
}

export async function POST(req: Request) {
  let body: {
    code?: string;
    action?: "read" | "set" | "adjust";
    stock?: Record<string, Record<string, number>>;
    slug?: string;
    size?: string;
    delta?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!process.env.ADMIN_CODE) {
    return NextResponse.json(
      { error: "Gestion non configurée (ajoute ADMIN_CODE dans Vercel)." },
      { status: 503 }
    );
  }
  if (!checkCode(body.code)) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  try {
    if (body.action === "read") {
      return NextResponse.json({ ok: true, stock: await getStock() });
    }
    if (body.action === "set" && body.stock) {
      return NextResponse.json({ ok: true, stock: await setStock(body.stock as never) });
    }
    if (
      body.action === "adjust" &&
      typeof body.slug === "string" &&
      SIZES.includes(body.size as Size) &&
      typeof body.delta === "number"
    ) {
      return NextResponse.json({
        ok: true,
        stock: await adjustStock(body.slug, body.size as Size, body.delta),
      });
    }
    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  } catch (e) {
    console.error("admin stock error", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
