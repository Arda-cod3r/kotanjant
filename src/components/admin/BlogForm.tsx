"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";
import ImageUrlInput from "./ImageUrlInput";
import {
  createBlogPost,
  updateBlogPost,
  type ContentActionState,
} from "@/server/actions/content";
import type { BlogPostDTO } from "@/lib/types";

const inputClass =
  "mt-1.5 h-11 w-full border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default function BlogForm({ post }: { post?: BlogPostDTO }) {
  const isEdit = Boolean(post);
  const action = isEdit && post ? updateBlogPost.bind(null, post.id) : createBlogPost;
  const [state, formAction, pending] = useActionState<ContentActionState, FormData>(action, {});

  const publishedAtValue = post ? post.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="size-4" /> {state.error}
        </p>
      )}

      <section className="border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Yazı İçeriği</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Başlık *</label>
            <input name="title" required defaultValue={post?.title ?? ""} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Slug (boşsa otomatik)</label>
            <input name="slug" defaultValue={post?.slug ?? ""} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Yazar</label>
            <input
              name="authorName"
              defaultValue={post?.authorName ?? "Kotanjant Editör"}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Özet *</label>
            <textarea
              name="excerpt"
              required
              rows={2}
              defaultValue={post?.excerpt ?? ""}
              className="mt-1.5 w-full border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink-700">İçerik *</label>
            <textarea
              name="content"
              required
              rows={10}
              defaultValue={post?.content ?? ""}
              className="mt-1.5 w-full border border-ink-200 p-3 text-sm leading-relaxed focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="border border-ink-100 bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Görsel &amp; Yayın</h2>
        <div className="mt-4 space-y-4">
          <ImageUrlInput
            name="coverImage"
            label="Kapak Görseli"
            defaultValue={post?.coverImage ?? ""}
            hint="Yazı kartında ve detay sayfasında görünen görsel."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-ink-700">Etiketler (virgülle)</label>
              <input
                name="tags"
                defaultValue={post?.tags.join(", ") ?? ""}
                placeholder="bakım, kış, rehber"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Yayın Tarihi</label>
              <input
                name="publishedAt"
                type="date"
                defaultValue={publishedAtValue}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={post ? post.isPublished : true}
                  className="size-4 border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                Yayında
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isEdit ? "Değişiklikleri Kaydet" : "Yazıyı Oluştur"}
        </button>
        <Link
          href="/admin/blog"
          className="inline-flex h-11 items-center border border-ink-200 px-6 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
