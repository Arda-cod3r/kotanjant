import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
});

// POST /api/newsletter  → footer bülten aboneliği
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Geçersiz e-posta." },
      { status: 422 },
    );
  }

  // Not: Üretimde bu e-posta bir bülten listesine (örn. DB tablosu veya ESP)
  // yazılmalıdır. Şu an demo amaçlı başarı döndürülür.
  return NextResponse.json({ ok: true, email: parsed.data.email });
}
