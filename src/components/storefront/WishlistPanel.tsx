"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store/wishlist";

/** Favori listesi panosu — hem `/favoriler` hem `/hesabim/favoriler` sayfalarında kullanılır. */
export default function WishlistPanel() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-ink-200 px-6 py-16 text-center">
        <Heart className="mx-auto size-12 text-ink-300" />
        <p className="mt-3 text-sm font-semibold text-ink-900">Favori listeniz boş</p>
        <p className="mt-1 text-sm text-ink-500">
          Ürün kartlarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
        </p>
        <Link
          href="/urunler"
          className="mt-5 inline-flex h-11 items-center bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-4 border border-ink-100 bg-white p-4"
        >
          <Link
            href={`/urun/${item.slug}`}
            className="relative size-20 shrink-0 overflow-hidden bg-ink-50"
          >
            {item.image && (
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/urun/${item.slug}`}
              className="line-clamp-2-custom text-sm font-semibold text-ink-900 hover:text-brand-700"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm font-bold text-brand-700">{formatPrice(item.price)}</p>
          </div>
          <button
            type="button"
            aria-label="Favorilerden çıkar"
            onClick={() => remove(item.productId)}
            className="flex size-9 items-center justify-center text-ink-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
