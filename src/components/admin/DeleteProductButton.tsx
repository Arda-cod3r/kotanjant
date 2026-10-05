"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/server/actions/products";

/** Silme onayı isteyen buton (sunucu action'ını güvenli şekilde tetikler). */
export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(event) => {
        if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Ürünü sil"
        className="flex size-9 items-center justify-center rounded-lg text-ink-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
