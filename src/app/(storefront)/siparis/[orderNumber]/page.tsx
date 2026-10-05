import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck } from "lucide-react";
import ClearCartOnMount from "@/components/storefront/ClearCartOnMount";
import { getOrderByNumber } from "@/server/orders";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sipariş Onayı",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="container-page max-w-3xl py-12">
      <ClearCartOnMount />

      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="mt-4 text-2xl font-black text-ink-900 sm:text-3xl">Siparişiniz Alındı!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Sipariş numaranız <span className="font-bold text-ink-900">{order.orderNumber}</span>.
          Bilgilendirme e-postası <span className="font-medium">{order.customerEmail}</span> adresine
          gönderilecek.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4">
          <Package className="size-5 text-brand-600" />
          <div>
            <p className="text-xs text-ink-400">Durum</p>
            <p className="text-sm font-semibold text-ink-900">{ORDER_STATUS_LABELS[order.status]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4">
          <Truck className="size-5 text-brand-600" />
          <div>
            <p className="text-xs text-ink-400">Tahmini Teslimat</p>
            <p className="text-sm font-semibold text-ink-900">2-4 iş günü</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4">
          <CheckCircle2 className="size-5 text-brand-600" />
          <div>
            <p className="text-xs text-ink-400">Sipariş Tarihi</p>
            <p className="text-sm font-semibold text-ink-900">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <h2 className="border-b border-ink-100 px-6 py-4 text-base font-bold text-ink-900">
          Sipariş İçeriği
        </h2>
        <ul className="divide-y divide-ink-50">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2-custom text-sm font-semibold text-ink-900">{item.name}</p>
                <p className="text-xs text-ink-400">Adet: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-ink-900">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-ink-100 px-6 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Ara toplam</dt>
            <dd className="font-medium text-ink-900">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Kargo</dt>
            <dd className="font-medium text-ink-900">
              {order.shipping === 0 ? "Ücretsiz" : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
            <dt className="font-bold text-ink-900">Toplam</dt>
            <dd className="font-black text-brand-700">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/urunler"
          className="inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Alışverişe Devam Et
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
