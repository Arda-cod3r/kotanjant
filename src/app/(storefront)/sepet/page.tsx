"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, selectCartSubtotal } from "@/lib/store/cart";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 79.9;

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="size-16 text-ink-300" />
        <h1 className="mt-4 text-2xl font-black text-ink-900">Sepetiniz boş</h1>
        <p className="mt-2 text-sm text-ink-500">
          Beğendiğiniz jant kapaklarını sepete ekleyerek alışverişe başlayın.
        </p>
        <Link
          href="/urunler"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">Sepetim</h1>
      <p className="mt-1 text-sm text-ink-500">{lines.length} farklı ürün sepette</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Kalemler */}
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.productId}
              className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/urun/${line.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-ink-50"
              >
                {line.image && (
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                )}
              </Link>

              <div className="flex-1">
                <Link
                  href={`/urun/${line.slug}`}
                  className="text-sm font-semibold text-ink-900 hover:text-brand-700"
                >
                  {line.name}
                </Link>
                <p className="mt-0.5 text-xs text-ink-400">Ürün Kodu: {line.sku}</p>
                <p className="mt-1 text-sm font-bold text-brand-700">{formatPrice(line.price)}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 items-center rounded-xl border border-ink-200">
                  <button
                    type="button"
                    aria-label="Adedi azalt"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    className="flex size-10 items-center justify-center text-ink-600 hover:text-brand-700"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Adedi artır"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    disabled={line.quantity >= line.stock}
                    className="flex size-10 items-center justify-center text-ink-600 hover:text-brand-700 disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Ürünü kaldır"
                  onClick={() => remove(line.productId)}
                  className="flex size-10 items-center justify-center rounded-xl text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-ink-500 underline hover:text-red-600"
          >
            Sepeti boşalt
          </button>
        </div>

        {/* Özet */}
        <aside className="h-fit rounded-2xl border border-ink-100 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-ink-900">Sipariş Özeti</h2>

          {remaining > 0 && (
            <div className="mt-4 rounded-xl bg-ink-50 p-3">
              <p className="text-xs text-ink-600">
                Ücretsiz kargo için{" "}
                <span className="font-bold text-brand-700">{formatPrice(remaining)}</span> daha
                ekleyin.
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <dl className="mt-5 space-y-3 text-sm">
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

          <Link
            href="/odeme"
            className="mt-6 flex h-12 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Alışverişi Tamamla
          </Link>
          <Link
            href="/urunler"
            className="mt-3 flex h-11 items-center justify-center rounded-xl border border-ink-200 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
          >
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
    </div>
  );
}
