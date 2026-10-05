"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { updatePreferencesAction, type AccountActionState } from "@/server/actions/account";
import type { UserProfileDTO } from "@/lib/types";

export default function PreferencesForm({ profile }: { profile: UserProfileDTO }) {
  const [state, formAction, pending] = useActionState<AccountActionState, FormData>(
    updatePreferencesAction,
    {},
  );

  const options = [
    {
      name: "emailOptIn",
      label: "E-posta ile bilgilendirme",
      desc: "Kampanyalar, indirimler ve sipariş bilgilendirmeleri e-posta ile gönderilsin.",
      checked: profile.emailOptIn,
    },
    {
      name: "smsOptIn",
      label: "SMS ile bilgilendirme",
      desc: "Kampanya ve sipariş durumu bildirimleri SMS olarak gelsin.",
      checked: profile.smsOptIn,
    },
    {
      name: "whatsappOptIn",
      label: "WhatsApp ile bilgilendirme",
      desc: "Fırsat ve hatırlatmalar WhatsApp üzerinden iletilsin.",
      checked: profile.whatsappOptIn,
    },
  ];

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

      <div className="divide-y divide-ink-100 border border-ink-100">
        {options.map((option) => (
          <label
            key={option.name}
            className="flex cursor-pointer items-start gap-3 p-4 transition hover:bg-ink-50"
          >
            <input
              type="checkbox"
              name={option.name}
              defaultChecked={option.checked}
              className="mt-0.5 size-4 border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block text-sm font-semibold text-ink-900">{option.label}</span>
              <span className="mt-0.5 block text-xs text-ink-500">{option.desc}</span>
            </span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Tercihleri Kaydet
      </button>
    </form>
  );
}
