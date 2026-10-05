import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, ShoppingBag } from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { getSessionUser } from "@/lib/auth";
import { getOrdersForUser } from "@/server/orders";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const orders = await getOrdersForUser(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Siparişlerim</h1>
        <p className="mt-1 text-sm text-ink-500">{orders.length} sipariş bulundu</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center">
          <ShoppingBag className="mx-auto size-12 text-ink-300" />
          <p className="mt-3 text-sm text-ink-500">Henüz siparişiniz bulunmuyor.</p>
          <Link
            href="/urunler"
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/hesabim/siparisler/${order.id}`}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
            >
              <div className="min-w-[160px] flex-1">
                <p className="text-sm font-bold text-ink-900">{order.orderNumber}</p>
                <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-sm text-ink-600">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} ürün
              </div>
              <OrderStatusBadge status={order.status} />
              <span className="font-bold text-ink-900">{formatPrice(order.total)}</span>
              <ChevronRight className="size-4 text-ink-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
