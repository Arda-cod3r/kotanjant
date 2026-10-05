import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/ContentDeleteButtons";
import { getAdminCategories } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Kategoriler</h1>
          <p className="mt-1 text-sm text-ink-500">
            {categories.length} kategori · ekle, düzenle, sil
          </p>
        </div>
        <Link
          href="/admin/kategoriler/yeni"
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Yeni Kategori
        </Link>
      </div>

      <div className="overflow-hidden border border-ink-100 bg-white">
        {categories.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-500">
            Henüz kategori yok. &quot;Yeni Kategori&quot; ile ekleyin.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Ürün Sayısı</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 text-right font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden bg-ink-50">
                          {category.imageUrl && (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/kategoriler/${category.id}/duzenle`}
                            className="font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {category.name}
                          </Link>
                          <p className="text-xs text-ink-400">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{category.productCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold ${
                          category.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        {category.isActive ? "Yayında" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/kategoriler/${category.id}/duzenle`}
                          aria-label="Kategoriyi düzenle"
                          className="flex size-9 items-center justify-center text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteCategoryButton id={category.id} name={category.name} />
                      </div>
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
