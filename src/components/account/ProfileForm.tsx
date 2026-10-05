"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Save } from "lucide-react";
import PhoneInput from "@/components/forms/PhoneInput";
import { updateProfileAction, type AccountActionState } from "@/server/actions/account";
import { GENDER_LABELS, type Gender, type UserProfileDTO } from "@/lib/types";

const inputClass =
  "mt-1.5 h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none disabled:bg-ink-50 disabled:text-ink-400";

export default function ProfileForm({ profile }: { profile: UserProfileDTO }) {
  const [state, formAction, pending] = useActionState<AccountActionState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="size-4" /> {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="size-4" /> {state.success}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink-700">Ad Soyad *</label>
          <input name="name" required defaultValue={profile.name} className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Telefon *</label>
          <PhoneInput name="phone" required defaultValue={profile.phone ?? ""} />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Doğum Tarihi</label>
          <input
            name="birthDate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            defaultValue={profile.birthDate ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Cinsiyet</label>
          <select name="gender" defaultValue={profile.gender} className={inputClass}>
            {(Object.keys(GENDER_LABELS) as Gender[]).map((value) => (
              <option key={value} value={value}>
                {GENDER_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-ink-700">
            TC Kimlik Numarası <span className="font-normal text-ink-400">(opsiyonel)</span>
          </label>
          <input
            name="tcKimlik"
            inputMode="numeric"
            maxLength={11}
            defaultValue={profile.tcKimlik ?? ""}
            placeholder="11 haneli (boş bırakılabilir)"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-400">
            Zorunlu değildir. Girilirse 11 hane ve doğrulama algoritmasına uygun olmalıdır.
          </p>
        </div>
      </div>

      {/* Değiştirilemeyen alanlar */}
      <div className="border border-ink-100 bg-ink-50 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink-700">
          <Info className="size-4" /> Değiştirilemeyen bilgiler
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-ink-500">E-posta</label>
            <input value={profile.email} disabled readOnly className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500">Şifre</label>
            <input value="••••••••" disabled readOnly className={inputClass} />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Güvenlik nedeniyle e-posta ve şifre bu ekrandan değiştirilemez.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Bilgileri Kaydet
      </button>
    </form>
  );
}
