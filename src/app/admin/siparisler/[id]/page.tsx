import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { getOrderById } from "@/server/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-ink-100 text-ink-700",
  PREPARING: "bg-accent-500/15 text-accent-600",
  SHIPPED: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-purple-50 text-purple-700",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Siparişlere dön
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-ink-900">{order.orderNumber}</h1>
          <span className={`rounded-lg px-3 py-1 text-sm font-semibold ${STATUS_TONE[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          {formatDate(order.createdAt)} tarihinde oluşturuldu
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Sipariş kalemleri */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
            <h2 className="border-b border-ink-100 px-6 py-4 text-lg font-bold text-ink-900">
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
                    <p className="text-xs text-ink-400">{item.sku}</p>
                  </div>
                  <span className="text-sm text-ink-500">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </span>
                  <span className="w-24 text-right text-sm font-bold text-ink-900">
                    {formatPrice(item.lineTotal)}
                  </span>
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
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-500">İndirim</dt>
                  <dd className="font-medium text-green-700">-{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
                <dt className="font-bold text-ink-900">Toplam</dt>
                <dd className="font-black text-brand-700">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          {/* Süreç zaman tüneli */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-lg font-bold text-ink-900">Süreç Takibi</h2>
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

        {/* Sağ kolon: müşteri bilgisi + durum güncelleme */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-lg font-bold text-ink-900">Müşteri Bilgileri</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="font-semibold text-ink-900">{order.customerName}</li>
              <li className="flex items-center gap-2 text-ink-600">
                <Mail className="size-4 text-ink-400" /> {order.customerEmail}
              </li>
              {order.customerPhone && (
                <li className="flex items-center gap-2 text-ink-600">
                  <Phone className="size-4 text-ink-400" /> {order.customerPhone}
                </li>
              )}
              <li className="flex items-start gap-2 text-ink-600">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" />
                <span>{order.shippingAddress}</span>
              </li>
            </ul>
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
            {order.note && (
              <p className="mt-4 rounded-xl bg-ink-50 p-3 text-sm text-ink-600">
                <span className="font-semibold">Müşteri Notu: </span>
                {order.note}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-lg font-bold text-ink-900">Durumu Güncelle</h2>
            <p className="mt-1 text-sm text-ink-500">
              Hazırlanıyor → Kargoda → Teslim Edildi akışını yönetin.
            </p>
            <div className="mt-4">
              <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
