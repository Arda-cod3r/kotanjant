import { NextResponse } from "next/server";
import { searchProducts } from "@/server/catalog";

// GET /api/products/search?q=...  → Header'daki canlı arama önerileri
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const products = await searchProducts(query, 8);
  return NextResponse.json({ products });
}
