"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { formatPhoneTR, isValidTurkishPhone, validatePassword } from "@/lib/utils";

export interface AuthState {
  error?: string;
}

export type LoginState = AuthState;
export type RegisterState = AuthState;

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(1, "Şifre gerekli."),
});

const registerSchema = z.object({
  name: z.string().min(3, "Ad soyad en az 3 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta girin."),
  phone: z.string().trim().optional(),
  password: z.string(),
  passwordConfirm: z.string(),
});

/** Giriş: tüm roller içindir. Rolüne göre panele veya müşteri hesabına yönlendirir. */
export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgileri geçersiz." };
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  } catch (error) {
    console.error("[auth] Giriş sırasında veritabanı hatası:", error);
    return { error: "Veritabanına ulaşılamıyor. Lütfen daha sonra tekrar deneyin." };
  }

  // Güvenlik: kullanıcı yok / pasif / şifre yanlış durumları tek bir mesajla döner
  // (hesap varlığını sızdırmamak için).
  if (!user || !user.isActive) return { error: "E-posta veya şifre hatalı." };

  const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!passwordOk) return { error: "E-posta veya şifre hatalı." };

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect(user.role === "CUSTOMER" ? "/hesabim" : "/admin");
}

/** Müşteri kaydı: yeni CUSTOMER oluşturur ve otomatik giriş yapar. */
export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Form bilgileri geçersiz." };
  }

  // Şifre gücü: min 8, harf + rakam, basit/ardışık şifre yasak.
  const passwordError = validatePassword(parsed.data.password);
  if (passwordError) return { error: passwordError };

  if (parsed.data.password !== parsed.data.passwordConfirm) {
    return { error: "Şifreler eşleşmiyor." };
  }

  // Telefon opsiyonel; girildiyse Türk cep telefonu formatında olmalı.
  if (parsed.data.phone && !isValidTurkishPhone(parsed.data.phone)) {
    return { error: "Telefon numarası geçersiz. Örnek: 0555 000 00 00" };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return { error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin." };

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ? formatPhoneTR(parsed.data.phone) : null,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("[auth] Kayıt sırasında veritabanı hatası:", error);
    return { error: "Kayıt oluşturulamadı. Lütfen tekrar deneyin." };
  }

  redirect("/hesabim");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/giris");
}
