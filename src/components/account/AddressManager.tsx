"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import PhoneInput from "@/components/forms/PhoneInput";
import {
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
  type AccountActionState,
} from "@/server/actions/account";
import type { AddressDTO } from "@/lib/types";

const inputClass =
  "mt-1.5 h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function AddressManager({ addresses }: { addresses: AddressDTO[] }) {
  const [state, formAction, pending] = useActionState<AccountActionState, FormData>(
    saveAddressAction,
    {},
  );
  const [editing, setEditing] = useState<AddressDTO | null>(null);
  const [formOpen, setFormOpen] = useState(addresses.length === 0);

  function startNew() {
    setEditing(null);
    setFormOpen(true);
  }
  function startEdit(address: AddressDTO) {
    setEditing(address);
    setFormOpen(true);
  }
  function closeForm() {
    setEditing(null);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Kayıtlı adresler */}
      {addresses.length === 0 ? (
        <p className="border border-dashed border-ink-200 px-6 py-10 text-center text-sm text-ink-500">
          Henüz kayıtlı adresiniz yok. Aşağıdan yeni bir adres ekleyebilirsiniz.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="border border-ink-100 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand-600" />
                  <span className="text-sm font-bold text-ink-900">{address.title}</span>
                  {address.isDefault && (
                    <span className="border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">
                      Varsayılan
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Adresi düzenle"
                    onClick={() => startEdit(address)}
                    className="flex size-8 items-center justify-center text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <form
                    action={deleteAddressAction}
                    onSubmit={(e) => {
                      if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={address.id} />
                    <button
                      type="submit"
                      aria-label="Adresi sil"
                      className="flex size-8 items-center justify-center text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </div>

              <p className="mt-3 text-sm font-medium text-ink-800">{address.fullName}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                {address.line1}
                <br />
                {address.district} / {address.city}
                {address.postalCode ? ` · ${address.postalCode}` : ""}
              </p>
              <p className="mt-1 text-sm text-ink-600">{address.phone}</p>

              {!address.isDefault && (
                <form action={setDefaultAddressAction} className="mt-3">
                  <input type="hidden" name="id" value={address.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    <Star className="size-3.5" /> Varsayılan Yap
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      {!formOpen && (
        <button
          type="button"
          onClick={startNew}
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Yeni Adres Ekle
        </button>
      )}

      {/* Ekleme / düzenleme formu */}
      {formOpen && (
        <form
          key={editing?.id ?? "new"}
          action={formAction}
          className="space-y-5 border border-ink-100 bg-white p-6"
        >
          <h2 className="text-base font-bold text-ink-900">
            {editing ? "Adresi Düzenle" : "Yeni Adres"}
          </h2>

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

          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-700">Adres Başlığı *</label>
              <input
                name="title"
                required
                placeholder="Ev, İş, Yazlık..."
                defaultValue={editing?.title ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Ad Soyad *</label>
              <input
                name="fullName"
                required
                defaultValue={editing?.fullName ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Telefon *</label>
              <PhoneInput name="phone" required defaultValue={editing?.phone ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Posta Kodu</label>
              <input
                name="postalCode"
                inputMode="numeric"
                maxLength={5}
                defaultValue={editing?.postalCode ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Şehir *</label>
              <input name="city" required defaultValue={editing?.city ?? ""} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">İlçe *</label>
              <input
                name="district"
                required
                defaultValue={editing?.district ?? ""}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink-700">Açık Adres *</label>
              <textarea
                name="line1"
                required
                rows={3}
                placeholder="Mahalle, sokak, no, daire"
                defaultValue={editing?.line1 ?? ""}
                className="mt-1.5 w-full border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              name="isDefault"
              defaultChecked={editing?.isDefault ?? addresses.length === 0}
              className="size-4 border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Varsayılan adresim olarak kaydet
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center gap-2 bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {editing ? "Değişiklikleri Kaydet" : "Adresi Kaydet"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-11 items-center border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
            >
              İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
