"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";
import ImageUrlInput from "./ImageUrlInput";
import {
  createCategory,
  updateCategory,
  type ContentActionState,
} from "@/server/actions/content";
import type { CategoryDTO } from "@/lib/types";

const inputClass =
  "mt-1.5 h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function CategoryForm({ category }: { category?: CategoryDTO }) {
  const isEdit = Boolean(category);
  const action =
    isEdit && category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, pending] = useActionState<ContentActionState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="size-4" /> {state.error}
        </p>
      )}

      <section className="border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Kategori Bilgileri</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink-700">Kategori Adı *</label>
            <input
              name="name"
              required
              defaultValue={category?.name ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Slug (boşsa otomatik)</label>
            <input name="slug" defaultValue={category?.slug ?? ""} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Açıklama</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category?.description ?? ""}
              className="mt-1.5 w-full border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUrlInput
              name="imageUrl"
              label="Kategori Görseli"
              defaultValue={category?.imageUrl ?? ""}
              hint="Ana sayfadaki kategori şeridinde ve menüde kullanılır."
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-6">
          <div className="w-40">
            <label className="text-sm font-medium text-ink-700">Sıralama</label>
            <input
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={0}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-ink-400">Küçük sayı önce gösterilir.</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category ? category.isActive : true}
              className="size-4 border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Yayında
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? "Değişiklikleri Kaydet" : "Kategoriyi Oluştur"}
        </button>
        <Link
          href="/admin/kategoriler"
          className="inline-flex h-11 items-center border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
