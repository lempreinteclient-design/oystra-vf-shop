import { NextResponse } from "next/server";
import { getStock } from "@/lib/stock-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/stock           -> stock complet
// GET /api/stock?slug=...   -> stock d'un seul coloris
export async function GET(req: Request) {
  const stock = await getStock();
  const slug = new URL(req.url).searchParams.get("slug");
  if (slug) {
    return NextResponse.json({ slug, stock: stock[slug] ?? null });
  }
  return NextResponse.json({ stock });
}
