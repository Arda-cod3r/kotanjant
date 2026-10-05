"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";
import ImageUploader, { type EditorImage } from "./ImageUploader";
import SpecEditor, { type EditorSpec } from "./SpecEditor";
import {
  createProduct,
  updateProduct,
  type ProductActionState,
} from "@/server/actions/products";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

const inputClass =
  "h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function ProductForm({
  categories,
  product,
}: {
  categories: CategoryDTO[];
  product?: ProductDTO;
}) {
  const isEdit = Boolean(product);
  const action = isEdit && product ? updateProduct.bind(null, product.id) : createProduct;
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    action,
    {},
  );

  const initialImages: EditorImage[] = product
    ? product.images.map((img) => ({ url: img.url, alt: img.alt ?? "", isPrimary: img.isPrimary }))
    : [];
  const initialSpecs: EditorSpec[] = product
    ? product.specs.map((spec) => ({ label: spec.label, value: spec.value }))
    : [];

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="size-4" /> {state.error}
        </p>
      )}

      {/* Temel bilgiler */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Temel Bilgiler</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Ürün Adı *</label>
            <input name="name" required defaultValue={product?.name ?? ""} className={`mt-1.5 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Slug (boş bırakılırsa otomatik)</label>
            <input name="slug" defaultValue={product?.slug ?? ""} className={`mt-1.5 ${inputClass}`} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">SKU (Stok Kodu) *</label>
            <input name="sku" required defaultValue={product?.sku ?? ""} className={`mt-1.5 ${inputClass}`} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Kısa Açıklama</label>
            <input name="shortDesc" defaultValue={product?.shortDesc ?? ""} className={`mt-1.5 ${inputClass}`} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Detaylı Açıklama *</label>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={product?.description ?? ""}
              className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Fiyat & stok */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Fiyat &amp; Stok</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-ink-700">Satış Fiyatı (₺) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price ?? ""}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Eski Fiyat (₺)</label>
            <input
              name="comparePrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.comparePrice ?? ""}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Stok Adedi *</label>
            <input
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={product?.stock ?? 0}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Kritik Stok Seviyesi</label>
            <input
              name="lowStockAlert"
              type="number"
              min="1"
              defaultValue={product?.lowStockAlert ?? 5}
              className={`mt-1.5 ${inputClass}`}
            />
            <p className="mt-1 text-xs text-ink-400">
              Stok bu sayının altına düşünce ürün kartında &quot;Son X adet&quot; uyarısı gösterilir ve
              paneldeki &quot;Kritik Stok&quot; listesine eklenir.
            </p>
          </div>
        </div>
      </section>

      {/* Kategorizasyon & etiketler */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Kategorizasyon &amp; Etiketler</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-ink-700">Kategori</label>
            <select name="categoryId" defaultValue={product?.categoryId ?? ""} className={`mt-1.5 ${inputClass}`}>
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Marka</label>
            <input
              name="brandName"
              defaultValue={product?.brandName ?? "Kotanjant"}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Etiketler (virgülle ayır)</label>
            <input
              name="tags"
              defaultValue={product?.tags.join(", ") ?? ""}
              placeholder="krom, 15 inç, 4 lü set"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5">
          {[
            { name: "isFeatured", label: "Öne Çıkan", checked: product?.isFeatured ?? false },
            { name: "isDeal", label: "Fırsat Ürünü", checked: product?.isDeal ?? false },
            { name: "isNew", label: "Yeni Ürün", checked: product?.isNew ?? true },
            { name: "isActive", label: "Yayında", checked: product?.isActive ?? true },
          ].map((flag) => (
            <label key={flag.name} className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                name={flag.name}
                defaultChecked={flag.checked}
                className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              {flag.label}
            </label>
          ))}
        </div>
      </section>

      {/* Görseller */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Ürün Görselleri</h2>
        <p className="mt-1 text-sm text-ink-500">
          Çoklu yükleme yapabilir, sıralayabilir ve ana görseli belirleyebilirsiniz.
        </p>
        <div className="mt-4">
          <ImageUploader initial={initialImages} />
        </div>
      </section>

      {/* Teknik özellikler */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Teknik Özellikler</h2>
        <div className="mt-4">
          <SpecEditor initial={initialSpecs} />
        </div>
      </section>

      {/* Aksiyonlar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
        </button>
        <Link
          href="/admin/urunler"
          className="inline-flex h-11 items-center rounded-xl border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
