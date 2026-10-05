import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/server/catalog";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/urunler"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Ürünlere dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Yeni Ürün</h1>
        <p className="mt-1 text-sm text-ink-500">
          Ürün bilgilerini, görsellerini ve teknik özelliklerini girin.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
