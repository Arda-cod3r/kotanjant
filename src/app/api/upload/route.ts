import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"];

// POST /api/upload  → ürün görselleri (çoklu) yükler, Vercel Blob üzerine yazar.
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Yüklenecek dosya bulunamadı." }, { status: 400 });
  }

  const uploaded: { url: string; name: string }[] = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `${file.name} desteklenen bir görsel türü değil.` },
        { status: 415 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `${file.name} 8MB sınırını aşıyor.` }, { status: 413 });
    }

    // Vercel Blob'a yükle.
    // Not: `addRandomSuffix` put için VARSAYILAN OLARAK false'tur. Aynı isimli dosya
    // tekrar yüklenince aynı pathname oluşur ve kütüphane "blob zaten var" hatası verir.
    // true ile her yüklemeye benzersiz bir son ek eklenir (örn: jant-kapagi-1abc2.jpg).
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    uploaded.push({ url: blob.url, name: file.name });
  }

  return NextResponse.json({ files: uploaded });
}