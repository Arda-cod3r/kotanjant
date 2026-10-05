import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import StockStatus from "@/components/product/StockStatus";
import ProductCard from "@/components/storefront/ProductCard";
import TrustBar from "@/components/storefront/TrustBar";
import { getProductBySlug, getRelatedProducts } from "@/server/catalog";
import { discountPercent, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: product.shortDesc ?? product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? undefined,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const discount = discountPercent(product.price, product.comparePrice);

  return (
    <>
      <div className="container-page py-6">
        {/* Breadcrumb */}
        <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
          <Link href="/" className="hover:text-brand-700">Ana Sayfa</Link>
          <ChevronRight className="size-3.5" />
          {product.category && (
            <>
              <Link href={`/kategori/${product.category.slug}`} className="hover:text-brand-700">
                {product.category.name}
              </Link>
              <ChevronRight className="size-3.5" />
            </>
          )}
          <span className="truncate text-ink-700">{product.name}</span>
        </nav>

        {/* Ana bölüm */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/kategori/${product.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-brand-600"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-2xl font-black leading-tight text-ink-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {product.ratingCount > 0 && (
                <span className="flex items-center gap-1 text-ink-600">
                  <Star className="size-4 fill-accent-500 text-accent-500" />
                  <span className="font-bold text-ink-900">{product.ratingAvg.toFixed(1)}</span>
                  <span className="text-ink-400">({product.ratingCount} değerlendirme)</span>
                </span>
              )}
              <span className="text-ink-400">
                Ürün Kodu: <span className="font-medium text-ink-700">{product.sku}</span>
              </span>
            </div>

            {/* Fiyat + stok */}
            <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl bg-ink-50 p-4">
              <span className="text-3xl font-black text-ink-900">{formatPrice(product.price)}</span>
              {discount > 0 && product.comparePrice && (
                <>
                  <span className="text-lg text-ink-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="rounded-lg bg-brand-600 px-2.5 py-1 text-sm font-bold text-white">
                    %{discount} İndirim
                  </span>
                </>
              )}
              <span className="ml-auto">
                <StockStatus stock={product.stock} lowStockAlert={product.lowStockAlert} />
              </span>
            </div>

            {product.shortDesc && (
              <p className="mt-4 text-sm leading-relaxed text-ink-600">{product.shortDesc}</p>
            )}

            {/* Aksiyonlar: Sepete Ekle / Favorilere Ekle / Paylaş */}
            <div className="mt-6">
              <ProductActions product={product} />
            </div>

            {/* Kısa güvenceler */}
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-ink-100 pt-6 text-sm text-ink-600 sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-brand-600" /> Aynı gün kargo
              </li>
              <li className="flex items-center gap-2">
                <RefreshCcw className="size-4 text-brand-600" /> 14 gün iade
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-600" /> 24 ay garanti
              </li>
            </ul>
          </div>
        </div>

        {/* Açıklama + Teknik özellikler */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="card-surface p-6">
            <h2 className="text-lg font-bold text-ink-900">Ürün Açıklaması</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {product.description}
            </p>
          </section>

          <section className="card-surface overflow-hidden">
            <h2 className="border-b border-ink-100 px-6 py-4 text-lg font-bold text-ink-900">
              Teknik Özellikler
            </h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-ink-50">
                {product.specs.map((spec) => (
                  <tr key={spec.id} className="even:bg-ink-50/50">
                    <th scope="row" className="w-1/2 px-6 py-3 text-left font-medium text-ink-500">
                      {spec.label}
                    </th>
                    <td className="px-6 py-3 font-semibold text-ink-900">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Benzer ürünler */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-black text-ink-900 sm:text-2xl">Benzer Ürünler</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <TrustBar />
    </>
  );
}
