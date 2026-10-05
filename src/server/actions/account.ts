"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, getSessionUser } from "@/lib/auth";
import { formatPhoneTR, isValidTcKimlik, isValidTurkishPhone } from "@/lib/utils";
import type { Gender } from "@/lib/types";

export interface AccountActionState {
  error?: string;
  success?: string;
}

const genderSchema = z.enum(["UNSPECIFIED", "MALE", "FEMALE", "OTHER"]);

/**
 * Üye bilgilerini günceller: ad soyad, telefon, TC (opsiyonel), doğum tarihi, cinsiyet.
 * E-posta ve şifre bu akışta DEĞİŞTİRİLEMEZ (güvenlik gereği).
 */
export async function updateProfileAction(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const session = await getSessionUser();
  if (!session) return { error: "Oturum bulunamadı. Lütfen tekrar giriş yapın." };

  const name = String(formData.get("name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const tcRaw = String(formData.get("tcKimlik") ?? "").trim();
  const birthRaw = String(formData.get("birthDate") ?? "").trim();
  const genderParsed = genderSchema.safeParse(formData.get("gender") ?? "UNSPECIFIED");

  if (name.length < 3) return { error: "Ad soyad en az 3 karakter olmalı." };
  if (!genderParsed.success) return { error: "Cinsiyet seçimi geçersiz." };

  // Telefon zorunlu (teslimat için) ve TR formatında olmalı.
  if (!phoneRaw) return { error: "Telefon numarası gerekli." };
  if (!isValidTurkishPhone(phoneRaw)) {
    return { error: "Telefon numarası geçersiz. Örnek: 0555 000 00 00" };
  }

  // TC opsiyonel; girildiyse 11 haneli ve algoritmik olarak geçerli olmalı.
  let tcKimlik: string | null = null;
  if (tcRaw) {
    if (!isValidTcKimlik(tcRaw)) return { error: "TC Kimlik Numarası geçersiz." };
    tcKimlik = tcRaw.replace(/\D/g, "");
  }

  // Doğum tarihi opsiyonel.
  let birthDate: Date | null = null;
  if (birthRaw) {
    const parsed = new Date(birthRaw);
    if (Number.isNaN(parsed.getTime())) return { error: "Doğum tarihi geçersiz." };
    const year = parsed.getFullYear();
    if (year < 1900 || parsed.getTime() > Date.now()) {
      return { error: "Doğum tarihi geçersiz." };
    }
    birthDate = parsed;
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        name,
        phone: formatPhoneTR(phoneRaw),
        tcKimlik,
        birthDate,
        gender: genderParsed.data as Gender,
      },
    });

    // Oturum cookie'sindeki ismi tazele (header'da güncel görünsün).
    await createSession({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (err) {
    if ((err as Error).message.includes("Unique constraint")) {
      return { error: "Bu TC Kimlik Numarası başka bir hesapta kayıtlı." };
    }
    return { error: "Bilgiler kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesabim/bilgilerim");
  revalidatePath("/hesabim");
  return { success: "Bilgileriniz güncellendi." };
}

/** İletişim tercihlerini (e-posta / SMS / WhatsApp izinleri) günceller. */
export async function updatePreferencesAction(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const session = await getSessionUser();
  if (!session) return { error: "Oturum bulunamadı." };

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: {
        emailOptIn: formData.get("emailOptIn") === "on",
        smsOptIn: formData.get("smsOptIn") === "on",
        whatsappOptIn: formData.get("whatsappOptIn") === "on",
      },
    });
  } catch {
    return { error: "Tercihler kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesabim/iletisim-tercihleri");
  return { success: "İletişim tercihleriniz güncellendi." };
}

const addressSchema = z.object({
  title: z.string().min(2, "Adres başlığı girin (ör. Ev, İş)."),
  fullName: z.string().min(3, "Ad soyad girin."),
  phone: z.string().refine(isValidTurkishPhone, "Geçerli bir telefon girin (05XX XXX XX XX)."),
  city: z.string().min(2, "Şehir girin."),
  district: z.string().min(2, "İlçe girin."),
  line1: z.string().min(10, "Açık adres girin."),
  postalCode: z.string().trim().optional(),
  isDefault: z.boolean(),
});

/** Adres ekler veya (id verilmişse) günceller. */
export async function saveAddressAction(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const session = await getSessionUser();
  if (!session) return { error: "Oturum bulunamadı." };

  const parsed = addressSchema.safeParse({
    title: String(formData.get("title") ?? "").trim(),
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    district: String(formData.get("district") ?? "").trim(),
    line1: String(formData.get("line1") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim() || undefined,
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Adres bilgileri geçersiz." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const data = {
    title: parsed.data.title,
    fullName: parsed.data.fullName,
    phone: formatPhoneTR(parsed.data.phone),
    city: parsed.data.city,
    district: parsed.data.district,
    line1: parsed.data.line1,
    postalCode: parsed.data.postalCode ?? null,
    isDefault: parsed.data.isDefault,
  };

  try {
    await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({ where: { userId: session.id }, data: { isDefault: false } });
      }
      if (id) {
        // Güncelleme: yalnızca kullanıcının kendi adresi.
        const existing = await tx.address.findFirst({ where: { id, userId: session.id } });
        if (!existing) throw new Error("NOT_FOUND");
        await tx.address.update({ where: { id }, data });
      } else {
        await tx.address.create({ data: { ...data, userId: session.id } });
      }
    });
  } catch (err) {
    if ((err as Error).message === "NOT_FOUND") return { error: "Adres bulunamadı." };
    return { error: "Adres kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesabim/adreslerim");
  return { success: id ? "Adres güncellendi." : "Adres eklendi." };
}

/** Adresi siler (yalnızca kullanıcının kendi adresi). */
export async function deleteAddressAction(formData: FormData): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.address.deleteMany({ where: { id, userId: session.id } });
  } catch {
    return;
  }
  revalidatePath("/hesabim/adreslerim");
}

/** Adresi varsayılan yapar. */
export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const session = await getSessionUser();
  if (!session) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    const owns = await prisma.address.findFirst({ where: { id, userId: session.id } });
    if (!owns) return;
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId: session.id }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ]);
  } catch {
    return;
  }
  revalidatePath("/hesabim/adreslerim");
}
