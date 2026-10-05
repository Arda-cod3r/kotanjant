import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard, Info } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getOrdersForUser } from "@/server/orders";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const METHOD_LABELS: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  TRANSFER: "Havale / EFT",
  COD: "Kapıda Ödeme",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "Ödendi",
  PENDING: "Bekliyor",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};

export default async function AccountPaymentsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const orders = await getOrdersForUser(session);
  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const totalPaid = paid.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Ödemelerim</h1>
        <p className="mt-1 text-sm text-ink-500">
          Siparişlerinize ait ödeme kayıtları ve ödeme yöntemleri.
        </p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-ink-100 bg-white p-5">
          <span className="flex size-9 items-center justify-center bg-brand-50 text-brand-600">
            <CreditCard className="size-5" />
          </span>
          <p className="mt-3 text-lg font-black text-ink-900">{formatPrice(totalPaid)}</p>
          <p className="text-xs text-ink-500">Toplam ödenen tutar</p>
        </div>
        <div className="border border-ink-100 bg-white p-5">
          <p className="mt-8 text-lg font-black text-ink-900">{paid.length}</p>
          <p className="text-xs text-ink-500">Tamamlanmış ödeme</p>
        </div>
        <div className="border border-ink-100 bg-white p-5">
          <p className="mt-8 text-lg font-black text-ink-900">
            {orders.length - paid.length}
          </p>
          <p className="text-xs text-ink-500">Bekleyen ödeme</p>
        </div>
      </div>

      <p className="flex items-start gap-2 border border-ink-100 bg-ink-50 p-4 text-xs leading-relaxed text-ink-500">
        <Info className="mt-0.5 size-4 shrink-0 text-ink-400" />
        Güvenliğiniz için kart bilgileriniz sistemimizde saklanmaz. Her ödeme, ödeme sağlayıcısı
        üzerinden 3D Secure ile gerçekleştirilir.
      </p>

      {/* Ödeme dökümü */}
      <div className="overflow-hidden border border-ink-100 bg-white">
        <h2 className="border-b border-ink-100 px-6 py-4 text-base font-bold text-ink-900">
          Ödeme Dökümü
        </h2>
        {orders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-500">Henüz ödeme kaydı yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Sipariş</th>
                  <th className="px-6 py-3 font-semibold">Tarih</th>
                  <th className="px-6 py-3 font-semibold">Yöntem</th>
                  <th className="px-6 py-3 font-semibold">Ödeme Durumu</th>
                  <th className="px-6 py-3 text-right font-semibold">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/60">
                    <td className="px-6 py-3">
                      <Link
                        href={`/hesabim/siparisler/${order.id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-ink-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3 text-ink-600">
                      {METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-50 text-green-700"
                            : order.paymentStatus === "REFUNDED"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-accent-500/15 text-accent-600"
                        }`}
                      >
                        {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
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
      </div>
    </div>
  );
}
