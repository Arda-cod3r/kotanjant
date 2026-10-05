import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "./ProductGrid";
import type { ProductDTO } from "@/lib/types";

/** Ana sayfada alt alta listelenen ürün bölümü (Öne Çıkan / Fırsat / Yeni). */
export default function ProductSection({
  id,
  title,
  subtitle,
  products,
  href = "/urunler",
  tone = "default",
}: {
  id?: string;
  title: string;
  subtitle?: string;
  products: ProductDTO[];
  href?: string;
  tone?: "default" | "muted" | "deal";
}) {
  if (products.length === 0) return null;

  const wrapper =
    tone === "muted"
      ? "border-y border-ink-100 bg-ink-50/40"
      : tone === "deal"
        ? "border-y border-brand-100 bg-brand-50/40"
        : "border-b border-ink-100";

  return (
    <section id={id} className={wrapper}>
      <div className="container-page py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">{title}</h2>
              <span className="h-6 w-1 bg-brand-600" aria-hidden="true" />
            </div>
            {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"
          >
            Tümünü Gör <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8">
          <ProductGrid products={products.slice(0, 8)} />
        </div>
      </div>
    </section>
  );
}
