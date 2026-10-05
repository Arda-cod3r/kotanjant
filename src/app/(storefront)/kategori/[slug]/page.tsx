import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductGrid from "@/components/storefront/ProductGrid";
import { getCategories, getProductsByCategory } from "@/server/catalog";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  return { title: category?.name ?? "Kategori" };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProductsByCategory(slug, 60),
    getCategories(),
  ]);
  const category = categories.find((c) => c.slug === slug);

  if (!category && products.length === 0) notFound();

  return (
    <div className="container-page py-10">
      <nav aria-label="Sayfa yolu" className="flex items-center gap-1 text-xs text-ink-500">
        <Link href="/" className="hover:text-brand-700">Ana Sayfa</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/urunler" className="hover:text-brand-700">Ürünler</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink-700">{category?.name ?? slug}</span>
      </nav>

      <h1 className="mt-4 text-2xl font-black text-ink-900 sm:text-3xl">
        {category?.name ?? "Kategori"}
      </h1>
      {category?.description && (
        <p className="mt-1 text-sm text-ink-500">{category.description}</p>
      )}
      <p className="mt-1 text-sm text-ink-500">{products.length} ürün listeleniyor</p>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
