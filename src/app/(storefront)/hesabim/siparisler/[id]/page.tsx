import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin, Package, RefreshCcw, Truck } from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { getSessionUser } from "@/lib/auth";
import { getCustomerOrder } from "@/server/orders";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const { id } = await params;
  // Sahiplik kontrolü: başka kullanıcının siparişi görüntülenemez.
  const order = await getCustomerOrder(id, session);
  if (!order) notFound();

  const steps = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED"] as const;
  const currentIndex = steps.indexOf(order.status as (typeof steps)[number]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/hesabim/siparisler"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Siparişlerime dön
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-ink-900">{order.orderNumber}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-ink-500">
          {formatDate(order.createdAt)} tarihinde oluşturuldu
        </p>
      </div>

      {/* Süreç adımları */}
      {currentIndex >= 0 && (
        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-base font-bold text-ink-900">Sipariş Durumu</h2>
          <ol className="mt-4 flex items-center">
            {steps.map((step, index) => {
              const done = index <= currentIndex;
              return (
                <li key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${
                        done ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`mt-2 whitespace-nowrap text-[11px] font-medium ${
                        done ? "text-ink-900" : "text-ink-400"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[step]}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <span
                      className={`mx-1 mb-5 h-0.5 flex-1 ${
                        index < currentIndex ? "bg-brand-600" : "bg-ink-100"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Ürünler */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
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
                    <p className="text-xs text-ink-400">
                      {item.sku} · {item.quantity} adet
                    </p>
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

          {/* Süreç geçmişi */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-base font-bold text-ink-900">Süreç Geçmişi</h2>
            <ol className="mt-4 space-y-4">
              {order.events.map((event) => (
                <li key={event.id} className="flex gap-3">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {event.status ? ORDER_STATUS_LABELS[event.status] : "Sipariş Oluşturuldu"}
                    </p>
                    <p className="text-xs text-ink-400">{formatDate(event.createdAt)}</p>
                    {event.note && <p className="mt-1 text-sm text-ink-600">{event.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Teslimat + yardım */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-ink-900">
              <MapPin className="size-5 text-brand-600" /> Teslimat Adresi
            </h2>
            <p className="mt-3 text-sm font-semibold text-ink-900">{order.customerName}</p>
            <p className="mt-1 text-sm text-ink-600">{order.shippingAddress}</p>
            {order.customerPhone && (
              <p className="mt-1 text-sm text-ink-600">{order.customerPhone}</p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 text-sm">
              <span className="text-ink-500">Ödeme</span>
              <span className="font-semibold text-ink-900">
                {order.paymentMethod === "CREDIT_CARD"
                  ? "Kredi Kartı"
                  : order.paymentMethod === "TRANSFER"
                    ? "Havale/EFT"
                    : "Kapıda Ödeme"}{" "}
                · {order.paymentStatus === "PAID" ? "Ödendi" : "Bekliyor"}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-base font-bold text-ink-900">Yardım</h2>
            <ul className="mt-3 space-y-3 text-sm text-ink-600">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-brand-600" /> Kargo takibi için bizimle iletişime geçin
              </li>
              <li className="flex items-center gap-2">
                <RefreshCcw className="size-4 text-brand-600" /> 14 gün içinde iade / değişim
              </li>
              <li className="flex items-center gap-2">
                <Package className="size-4 text-brand-600" /> 0850 000 00 00
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
