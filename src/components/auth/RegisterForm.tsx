"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, LogIn, UserPlus } from "lucide-react";
import { registerAction, type AuthState } from "@/server/actions/auth";
import PhoneInput from "@/components/forms/PhoneInput";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(registerAction, {});

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="size-4" /> {state.error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-700">
            Ad Soyad *
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-700">
            E-posta *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-ink-700">
            Telefon
          </label>
          <PhoneInput id="phone" name="phone" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink-700">
              Şifre *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="text-sm font-medium text-ink-700">
              Şifre (Tekrar) *
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="border border-ink-100 bg-ink-50 px-4 py-3 text-xs leading-relaxed text-ink-500">
          <p className="font-semibold text-ink-700">Şifre kuralları</p>
          En az 8 karakter, en az bir harf ve bir rakam içermeli. Ardışık (12345678),
          tekrar eden (11111111) veya yaygın şifreler kabul edilmez.
        </div>

        <p className="text-xs text-ink-400">
          Kayıt olarak <Link href="/kvkk" className="underline hover:text-ink-600">KVKK Aydınlatma Metni</Link>{" "}
          ve <Link href="/gizlilik" className="underline hover:text-ink-600">Gizlilik Politikası</Link>&apos;nı
          kabul etmiş olursunuz.
        </p>

        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          {pending ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
          <LogIn className="size-4" /> Giriş Yapın
        </Link>
      </p>
    </div>
  );
}
