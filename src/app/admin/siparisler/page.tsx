import Link from "next/link";
import { getOrders } from "@/server/orders";
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

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "PENDING", label: "Ödeme Bekliyor" },
  { value: "PREPARING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.durum === "string" ? (sp.durum as OrderStatus) : undefined;
  const orders = await getOrders(status);

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Siparişler</h1>
        <p className="mt-1 text-sm text-ink-500">
          {orders.length} sipariş · listelenen ciro {formatPrice(totalRevenue)}
        </p>
      </div>

      {/* Durum filtresi */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          return (
            <Link
              key={filter.value || "all"}
              href={filter.value ? `/admin/siparisler?durum=${filter.value}` : "/admin/siparisler"}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                active ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-ink-100"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
        {orders.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-500">
            Bu filtreye uygun sipariş bulunmuyor.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sipariş</th>
                  <th className="px-4 py-3 font-semibold">Müşteri</th>
                  <th className="px-4 py-3 font-semibold">Ürün</th>
                  <th className="px-4 py-3 font-semibold">Ödeme</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 text-right font-semibold">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-800">{order.customerName}</p>
                      <p className="text-xs text-ink-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} adet
                    </td>
                    <td className="px-4 py-3 text-ink-600">
                      {order.paymentMethod === "CREDIT_CARD"
                        ? "Kredi Kartı"
                        : order.paymentMethod === "TRANSFER"
                          ? "Havale"
                          : "Kapıda Ödeme"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-ink-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
