import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats } from "@/server/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { compactNumber, formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  tone?: "default" | "brand";
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <span
          className={
            tone === "brand"
              ? "flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
              : "flex size-9 items-center justify-center rounded-xl bg-ink-100 text-ink-600"
          }
        >
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-ink-100 text-ink-700",
  PREPARING: "bg-accent-500/15 text-accent-600",
  SHIPPED: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
  REFUNDED: "bg-purple-50 text-purple-700",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxSale = Math.max(1, ...stats.salesByDay.map((d) => d.total));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">
          Son 30 günün ciro ve sipariş özeti ile anlık stok durumu.
        </p>
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Anlık Ciro (30 gün)"
          value={formatPrice(stats.totalRevenue)}
          hint={`${stats.orderCount} sipariş`}
          icon={Banknote}
          tone="brand"
        />
        <StatCard
          label="Ortalama Sipariş"
          value={formatPrice(stats.averageOrderValue)}
          hint="Sipariş başına ortalama tutar"
          icon={TrendingUp}
        />
        <StatCard
          label="Hazırlanıyor"
          value={String(stats.statusCounts.PREPARING)}
          hint="İşlem bekleyen sipariş"
          icon={Package}
        />
        <StatCard
          label="Kargoda"
          value={String(stats.statusCounts.SHIPPED)}
          hint="Yolda olan sipariş"
          icon={ShoppingBag}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Son 7 gün satış grafiği */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 xl:col-span-2">
          <h2 className="text-lg font-bold text-ink-900">Son 7 Gün Satış</h2>
          {stats.salesByDay.length === 0 ? (
            <p className="mt-6 text-sm text-ink-500">Görüntülenecek satış verisi yok.</p>
          ) : (
            <div className="mt-6 flex h-56 items-end gap-3">
              {stats.salesByDay.map((day) => (
                <div key={day.date} className="flex h-full flex-1 flex-col items-center">
                  <span className="text-[11px] font-semibold text-ink-600">
                    {compactNumber(Math.round(day.total))}
                  </span>
                  {/* Bar, flex-1 kaplayan kesin yükseklikli alanda yüzde ile ölçeklenir */}
                  <div className="flex w-full flex-1 items-end pt-2">
                    <div
                      className="w-full bg-brand-500/80 transition-all hover:bg-brand-600"
                      style={{ height: `${Math.max(2, (day.total / maxSale) * 100)}%` }}
                      title={formatPrice(day.total)}
                    />
                  </div>
                  <span className="mt-2 text-[11px] text-ink-400">
                    {new Date(day.date).toLocaleDateString("tr-TR", { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sipariş durum dağılımı */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Sipariş Durumları</h2>
          <ul className="mt-4 space-y-2.5">
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[status]}`}>
                  {ORDER_STATUS_LABELS[status]}
                </span>
                <span className="font-bold text-ink-900">{stats.statusCounts[status]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Son siparişler */}
        <section className="rounded-2xl border border-ink-100 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-lg font-bold text-ink-900">Son Siparişler</h2>
            <Link
              href="/admin/siparisler"
              className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Tümü <ArrowRight className="size-4" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-ink-500">Henüz sipariş yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Sipariş No</th>
                    <th className="px-6 py-3 font-semibold">Müşteri</th>
                    <th className="px-6 py-3 font-semibold">Durum</th>
                    <th className="px-6 py-3 text-right font-semibold">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-ink-50/60">
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/siparisler/${order.id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-6 py-3 text-ink-700">{order.customerName}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[order.status]}`}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-ink-900">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Düşük stok uyarısı */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
            <AlertTriangle className="size-5 text-accent-500" /> Kritik Stok
          </h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="mt-4 text-sm text-ink-500">Kritik seviyede ürün yok.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link
                    href={`/admin/urunler/${p.id}/duzenle`}
                    className="line-clamp-2-custom font-medium text-ink-700 hover:text-brand-700"
                  >
                    {p.name}
                  </Link>
                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${
                      p.stock === 0 ? "bg-red-50 text-red-700" : "bg-accent-500/15 text-accent-600"
                    }`}
                  >
                    {p.stock} adet
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
