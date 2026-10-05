import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"];

// POST /api/upload  → ürün görselleri (çoklu) yükler, public/uploads altına yazar.
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

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

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

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, fileName), bytes);
    uploaded.push({ url: `/uploads/${fileName}`, name: file.name });
  }

  return NextResponse.json({ files: uploaded });
}
