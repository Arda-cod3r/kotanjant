"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, CreditCard, Loader2, Lock, ShoppingBag } from "lucide-react";
import { createOrderAction, type CheckoutState } from "@/server/actions/checkout";
import PhoneInput from "@/components/forms/PhoneInput";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 79.9;

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function CheckoutForm() {
  const lines = useCartStore((s) => s.lines);
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    createOrderAction,
    {},
  );

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const cartJson = JSON.stringify(
    lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
  );

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-20 text-center">
        <ShoppingBag className="size-14 text-ink-300" />
        <p className="mt-4 font-semibold text-ink-900">Sepetinizde ürün bulunmuyor</p>
        <Link
          href="/urunler"
          className="mt-4 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      {/* Gizli sepet verisi */}
      <input type="hidden" name="cart" value={cartJson} />

      <div className="space-y-6">
        {state.error && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="size-4" /> {state.error}
          </p>
        )}

        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Teslimat Bilgileri</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink-700">Ad Soyad *</label>
              <input name="customerName" required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Telefon *</label>
              <PhoneInput name="customerPhone" required />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink-700">E-posta *</label>
              <input name="customerEmail" type="email" required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Şehir *</label>
              <input name="city" required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink-700">Açık Adres *</label>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="Mahalle, sokak, no, daire"
                className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink-700">Sipariş Notu</label>
              <input name="note" className={inputClass} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Ödeme Yöntemi</h2>
          <div className="mt-4 space-y-3">
            {[
              { value: "CREDIT_CARD", label: "Kredi Kartı (3D Secure)", icon: CreditCard },
              { value: "TRANSFER", label: "Havale / EFT", icon: Lock },
              { value: "COD", label: "Kapıda Ödeme", icon: ShoppingBag },
            ].map((method, index) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-200 p-4 transition hover:border-brand-300"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  defaultChecked={index === 0}
                  className="size-4 text-brand-600 focus:ring-brand-500"
                />
                <method.icon className="size-5 text-ink-500" />
                <span className="text-sm font-medium text-ink-800">{method.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Sipariş özeti */}
      <aside className="h-fit rounded-2xl border border-ink-100 bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-bold text-ink-900">Sipariş Özeti</h2>

        <ul className="mt-4 space-y-2 border-b border-ink-100 pb-4 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="line-clamp-2-custom text-ink-600">
                {line.name} × {line.quantity}
              </span>
              <span className="shrink-0 font-medium text-ink-900">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Ara toplam</dt>
            <dd className="font-medium text-ink-900">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Kargo</dt>
            <dd className="font-medium text-ink-900">
              {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-3 text-base">
            <dt className="font-bold text-ink-900">Toplam</dt>
            <dd className="font-black text-brand-700">{formatPrice(total)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          {pending ? "Sipariş oluşturuluyor..." : "Siparişi Onayla"}
        </button>

        <p className="mt-3 text-center text-xs text-ink-400">
          256-bit SSL ile şifrelenmiş güvenli ödeme
        </p>
      </aside>
    </form>
  );
}
