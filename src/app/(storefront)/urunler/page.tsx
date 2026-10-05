import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/storefront/ProductGrid";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/server/catalog";
import type { ProductDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Jant kapakları, oto aksesuarları ve bakım ürünlerinin tamamı.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function sortProducts(products: ProductDTO[], sort: string): ProductDTO[] {
  const list = [...products];
  switch (sort) {
    case "artan":
      return list.sort((a, b) => a.price - b.price);
    case "azalan":
      return list.sort((a, b) => b.price - a.price);
    case "puan":
      return list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    default:
      return list;
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categorySlug = typeof sp.kategori === "string" ? sp.kategori : undefined;
  const query = typeof sp.q === "string" ? sp.q : "";
  const dealsOnly = sp.firsat === "1";
  const sort = typeof sp.sirala === "string" ? sp.sirala : "yeni";

  const categories = await getCategories();
  let products: ProductDTO[];
  if (query) {
    products = await searchProducts(query, 60);
  } else if (categorySlug) {
    products = await getProductsByCategory(categorySlug, 60);
  } else {
    products = await getProducts(60);
  }
  if (dealsOnly) products = products.filter((p) => p.isDeal);
  products = sortProducts(products, sort);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">
        {activeCategory ? activeCategory.name : dealsOnly ? "Fırsat Ürünleri" : "Tüm Ürünler"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">{products.length} ürün listeleniyor</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filtre kenar çubuğu */}
        <aside className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">Kategoriler</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <Link
                  href="/urunler"
                  className={`block rounded-lg px-3 py-2 transition hover:bg-ink-50 ${
                    !categorySlug && !dealsOnly ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-600"
                  }`}
                >
                  Tüm Ürünler
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/urunler?kategori=${category.slug}`}
                    className={`block rounded-lg px-3 py-2 transition hover:bg-ink-50 ${
                      categorySlug === category.slug
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-600"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/urunler?firsat=1"
                  className={`block rounded-lg px-3 py-2 transition hover:bg-ink-50 ${
                    dealsOnly ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-600"
                  }`}
                >
                  Fırsat Ürünleri
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Sonuçlar */}
        <div>
          <form method="get" className="mb-6 flex items-center justify-end gap-2">
            {categorySlug && <input type="hidden" name="kategori" value={categorySlug} />}
            {dealsOnly && <input type="hidden" name="firsat" value="1" />}
            <label htmlFor="sirala" className="text-sm text-ink-500">
              Sırala:
            </label>
            <select
              id="sirala"
              name="sirala"
              defaultValue={sort}
              className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="yeni">En Yeni</option>
              <option value="artan">Fiyat: Artan</option>
              <option value="azalan">Fiyat: Azalan</option>
              <option value="puan">Puana Göre</option>
            </select>
            <button
              type="submit"
              className="h-10 rounded-xl bg-ink-900 px-4 text-sm font-semibold text-white transition hover:bg-ink-800"
            >
              Uygula
            </button>
          </form>

          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
