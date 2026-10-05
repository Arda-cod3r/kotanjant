import type { Metadata } from "next";
import ProductGrid from "@/components/storefront/ProductGrid";
import { searchProducts } from "@/server/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Arama Sonuçları",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const products = query ? await searchProducts(query, 60) : [];

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">
        {query ? `"${query}" için sonuçlar` : "Arama"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        {query ? `${products.length} ürün bulundu` : "Aramak istediğiniz ürünü yazın."}
      </p>

      <div className="mt-8">
        <ProductGrid
          products={products}
          emptyMessage={
            query
              ? `"${query}" için sonuç bulunamadı. Farklı bir arama deneyin.`
              : "Arama yapmak için yukarıdaki arama çubuğunu kullanın."
          }
        />
      </div>
    </div>
  );
}
