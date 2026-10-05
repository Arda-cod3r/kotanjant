import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { getSessionUser } from "@/lib/auth";
import { getOrdersForUser } from "@/server/orders";
import { getUserProfile } from "@/server/account";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const [orders, profile] = await Promise.all([
    getOrdersForUser(session),
    getUserProfile(session.id),
  ]);

  const valid = orders.filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED");
  const totalSpent = valid.reduce((sum, order) => sum + order.total, 0);
  const inProgress = orders.filter(
    (o) => o.status === "PREPARING" || o.status === "SHIPPED" || o.status === "PENDING",
  ).length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  const stats = [
    { label: "Toplam Sipariş", value: String(orders.length), icon: ShoppingBag },
    { label: "Devam Eden", value: String(inProgress), icon: Clock },
    { label: "Teslim Edilen", value: String(delivered), icon: CheckCircle2 },
    { label: "Toplam Harcama", value: formatPrice(totalSpent), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">
          Merhaba, {session.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Hesabınızın özeti, siparişleriniz ve hızlı erişim bağlantıları.
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-ink-100 bg-white p-5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="size-5" />
            </span>
            <p className="mt-3 text-lg font-black text-ink-900">{value}</p>
            <p className="text-xs text-ink-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Son siparişler */}
        <section className="rounded-2xl border border-ink-100 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-lg font-bold text-ink-900">Son Siparişlerim</h2>
            <Link
              href="/hesabim/siparisler"
              className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Tümü <ArrowRight className="size-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ShoppingBag className="mx-auto size-10 text-ink-300" />
              <p className="mt-3 text-sm text-ink-500">Henüz siparişiniz bulunmuyor.</p>
              <Link
                href="/urunler"
                className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink-50">
              {orders.slice(0, 3).map((order) => (
                <li key={order.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/hesabim/siparisler/${order.id}`}
                      className="text-sm font-bold text-ink-900 hover:text-brand-700"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  <span className="font-bold text-ink-900">{formatPrice(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Profil kartı */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
            <User className="size-5 text-brand-600" /> Hesap Bilgileri
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-ink-400">Ad Soyad</dt>
              <dd className="font-medium text-ink-900">{profile?.name ?? session.name}</dd>
            </div>
            <div>
              <dt className="text-ink-400">E-posta</dt>
              <dd className="font-medium text-ink-900">{session.email}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Telefon</dt>
              <dd className="font-medium text-ink-900">{profile?.phone ?? "Belirtilmedi"}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Üyelik Tarihi</dt>
              <dd className="font-medium text-ink-900">
                {profile ? formatDate(profile.createdAt) : "—"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
