import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/storefront/HeroSlider";
import ProductSection from "@/components/storefront/ProductSection";
import BlogSection from "@/components/storefront/BlogSection";
import TrustBar from "@/components/storefront/TrustBar";
import { getBlogPosts, getCategories, getHeroSlides, getProductsByBadge } from "@/server/catalog";

// Vitrin içeriği yönetim panelinden güncellenebildiği için her istekte tazelenir.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, deals, newProducts, posts, categories, slides] = await Promise.all([
    getProductsByBadge("featured", 8),
    getProductsByBadge("deal", 8),
    getProductsByBadge("new", 8),
    getBlogPosts(3),
    getCategories(),
    getHeroSlides(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Kategori şeridi */}
      <section className="border-b border-ink-100 bg-ink-50/40">
        <div className="container-page grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group flex flex-col items-center gap-3 border border-ink-100 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <span className="relative size-16 overflow-hidden rounded-full bg-ink-50 ring-1 ring-ink-100">
                {category.imageUrl && (
                  <Image src={category.imageUrl} alt={category.name} fill sizes="64px" className="object-cover" />
                )}
              </span>
              <span className="text-xs font-semibold leading-tight text-ink-800 group-hover:text-brand-700">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Vitrin: üç ayrı bölüm olarak alt alta */}
      <ProductSection
        id="one-cikan-urunler"
        title="Öne Çıkan Ürünler"
        subtitle="En çok tercih edilen, editör seçimi jant kapakları ve aksesuarlar."
        href="/urunler"
        products={featured}
      />
      <ProductSection
        id="firsat-urunleri"
        title="Fırsat Ürünleri"
        subtitle="Sınırlı süreli indirimli ürünler — stoklar bitmeden yakalayın."
        href="/urunler?firsat=1"
        tone="deal"
        products={deals}
      />
      <ProductSection
        id="yeni-urunler"
        title="Yeni Ürünler"
        subtitle="Vitrine yeni eklenen jant kapakları ve oto aksesuarları."
        href="/urunler?sirala=yeni"
        tone="muted"
        products={newProducts}
      />

      <BlogSection posts={posts} />

      <TrustBar />
    </>
  );
}

