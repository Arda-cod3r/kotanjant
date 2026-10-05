import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

export default function ProductGrid({
  products,
  emptyMessage = "Aradığınız kriterlere uygun ürün bulunamadı.",
}: {
  products: ProductDTO[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center text-sm text-ink-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
