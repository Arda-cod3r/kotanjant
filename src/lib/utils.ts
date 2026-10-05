import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını koşullu birleştirir (shadcn deseni). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 12345.5 -> "12.345,50 ₺" */
export function formatPrice(
  value: number | string,
  currency = "TRY",
  locale = "tr-TR",
): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

/** İndirim yüzdesini hesaplar: (eski - yeni) / eski * 100 */
export function discountPercent(price: number, comparePrice?: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

/** 1500 -> "1.5K", 1200000 -> "1.2M" */
export function compactNumber(value: number, locale = "tr-TR"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Türkçe karakterleri sadeleştirerek SEO dostu slug üretir. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Sipariş numarası: KT-20261005-8F3A */
export function generateOrderNumber(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `KT-${y}${m}${d}-${rand}`;
}

export function formatDate(date: Date | string, locale = "tr-TR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

// ---------------------------------------------------------------------------
// Türk telefon numarası
// ---------------------------------------------------------------------------

/** Girdiyi yalnızca rakama indirger ve TR cep telefonu formatına göre sınırlar
 *  (10 hane; baştaki 0 ve 90 ülke kodu temizlenir). */
export function normalizePhone(input: string): string {
  let digits = (input ?? "").replace(/\D/g, "");
  if (digits.startsWith("90")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** 5xxxxxxxxx (10 hane) → "0555 000 00 00" */
export function formatPhoneTR(input: string): string {
  const d = normalizePhone(input);
  if (!d) return "";
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  // Baştaki "0" ile gruplar tek boşlukla birleşir: "0555 000 00 00" (14 karakter).
  // Not: eskiden `["0", ...parts].join(" ")` fazladan boşluk üretiyordu
  // ("0 555 000 00 00" = 15 karakter) ve input'un maxLength=14 sınırına
  // takıldığı için son hane girilemiyordu.
  return `0${parts.join(" ")}`;
}

/** Türk cep telefonu geçerli mi? (10 hane ve 5 ile başlamalı) */
export function isValidTurkishPhone(input: string): boolean {
  const d = normalizePhone(input);
  return /^5\d{9}$/.test(d);
}

// ---------------------------------------------------------------------------
// TC Kimlik No (opsiyonel alan — girildiyse geçerli olmalı)
// ---------------------------------------------------------------------------

export function isValidTcKimlik(input: string): boolean {
  const d = (input ?? "").replace(/\D/g, "");
  if (d.length !== 11 || d.startsWith("0")) return false;

  const n = d.split("").map(Number);
  const oddSum = n[0] + n[2] + n[4] + n[6] + n[8];
  const evenSum = n[1] + n[3] + n[5] + n[7];
  const tenth = (oddSum * 7 - evenSum) % 10;
  if (tenth !== n[9]) return false;

  const firstTenSum = n.slice(0, 10).reduce((sum, x) => sum + x, 0);
  return firstTenSum % 10 === n[10];
}

// ---------------------------------------------------------------------------
// Şifre gücü
// ---------------------------------------------------------------------------

const WEAK_PASSWORDS = new Set([
  "12345678", "123456789", "1234567890", "password", "passw0rd", "qwerty123",
  "aaaaaaaa", "00000000", "11111111", "12341234", "12312312", "abcd1234",
]);

/**
 * Şifre kurallarını kontrol eder ve hata mesajı döner (geçerliyse `null`).
 * Kurallar: min 8 karakter, en az bir harf ve bir rakam, aynı karakterin
 * tekrarı veya ardışık dizi olmamalı, yaygın zayıf şifrelerden olmamalı.
 */
export function validatePassword(password: string): string | null {
  const value = password ?? "";
  const isSequential = (s: string) => {
    if (s.length < 4) return false;
    const codes = s.split("").map((c) => c.charCodeAt(0));
    const allSame = codes.every((c) => c === codes[0]);
    let asc = true;
    let desc = true;
    for (let i = 1; i < codes.length; i++) {
      if (codes[i] - codes[i - 1] !== 1) asc = false;
      if (codes[i] - codes[i - 1] !== -1) desc = false;
    }
    return allSame || asc || desc;
  };

  if (value.length < 8) return "Şifre en az 8 karakter olmalı.";
  if (!/[A-Za-zĞÜŞİÖÇğüşıöç]/.test(value)) return "Şifre en az bir harf içermeli.";
  if (!/\d/.test(value)) return "Şifre en az bir rakam içermeli.";
  if (new Set(value).size < 4) return "Şifre çok basit; farklı karakterler kullanın.";
  if (isSequential(value)) return "Ardışık veya tekrar eden karakterlerden oluşan şifre kullanılamaz.";
  if (WEAK_PASSWORDS.has(value.toLowerCase())) return "Bu şifre çok yaygın; daha güçlü bir şifre seçin.";
  return null;
}

