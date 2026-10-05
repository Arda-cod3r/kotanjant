"use client";

import { Trash2 } from "lucide-react";
import { deleteBlogPost, deleteCategory, deleteHeroSlide } from "@/server/actions/content";

/** Blog yazısı silme (onaylı). */
export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteBlogPost}
      onSubmit={(event) => {
        if (!window.confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Yazıyı sil"
        className="flex size-9 items-center justify-center text-ink-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}

/** Kategori silme (onaylı). */
export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteCategory}
      onSubmit={(event) => {
        if (!window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Kategoriyi sil"
        className="flex size-9 items-center justify-center text-ink-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}

/** Vitrin (hero) slaytı silme (onaylı). */
export function DeleteHeroSlideButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteHeroSlide}
      onSubmit={(event) => {
        if (!window.confirm(`"${title}" slaytını silmek istediğinize emin misiniz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Slaytı sil"
        className="flex size-9 items-center justify-center text-ink-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
