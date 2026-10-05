import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getAdminProducts } from "@/server/catalog";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Ürün Yönetimi</h1>
          <p className="mt-1 text-sm text-ink-500">
            {products.length} ürün · liste, ekleme, düzenleme ve stok kontrolü
          </p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Yeni Ürün
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
        {products.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-500">
            Henüz ürün yok. Sağ üstteki &quot;Yeni Ürün&quot; ile ekleyin veya{" "}
            <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">npm run db:seed</code>{" "}
            komutunu çalıştırın.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ürün</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Fiyat</th>
                  <th className="px-4 py-3 font-semibold">Stok</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 text-right font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {products.map((product) => {
                  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
                  return (
                    <tr key={product.id} className="hover:bg-ink-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                            {image && (
                              <Image src={image.url} alt={product.name} fill sizes="48px" className="object-cover" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/urunler/${product.id}/duzenle`}
                              className="line-clamp-2-custom font-semibold text-ink-900 hover:text-brand-700"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-ink-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-600">{product.category?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-ink-900">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="ml-2 text-xs text-ink-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                            product.stock === 0
                              ? "bg-red-50 text-red-700"
                              : product.stock <= product.lowStockAlert
                                ? "bg-accent-500/15 text-accent-600"
                                : "bg-green-50 text-green-700"
                          }`}
                        >
                          {product.stock} adet
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.isActive ? (
                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                              Yayında
                            </span>
                          ) : (
                            <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                              Pasif
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                              Öne Çıkan
                            </span>
                          )}
                          {product.isDeal && (
                            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                              Fırsat
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/urunler/${product.id}/duzenle`}
                            aria-label="Ürünü düzenle"
                            className="flex size-9 items-center justify-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          <DeleteProductButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
