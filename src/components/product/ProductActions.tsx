"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { ProductDTO } from "@/lib/types";

export default function ProductActions({ product }: { product: ProductDTO }) {
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistItems = useWishlistStore((s) => s.items);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  const mounted = useMounted();

  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const inWishlist = mounted && wishlistItems.some((i) => i.productId === product.id);
  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    if (outOfStock) return;
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: image?.url ?? null,
        sku: product.sku,
        stock: product.stock,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWishlist() {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: image?.url ?? null,
    });
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* kullanıcı paylaşımı iptal etti */
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Adet seçici */}
        <div className="flex h-12 items-center rounded-xl border border-ink-200">
          <button
            type="button"
            aria-label="Adedi azalt"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
            className="flex size-12 items-center justify-center text-ink-600 transition hover:text-brand-700 disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-ink-900">{quantity}</span>
          <button
            type="button"
            aria-label="Adedi artır"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={outOfStock || quantity >= product.stock}
            className="flex size-12 items-center justify-center text-ink-600 transition hover:text-brand-700 disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition",
            outOfStock
              ? "cursor-not-allowed bg-ink-100 text-ink-400"
              : added
                ? "bg-green-600 text-white"
                : "bg-brand-600 text-white hover:bg-brand-700",
          )}
        >
          {outOfStock ? (
            "Stokta Yok"
          ) : added ? (
            <>
              <Check className="size-5" /> Sepete Eklendi
            </>
          ) : (
            <>
              <ShoppingCart className="size-5" /> Sepete Ekle
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={inWishlist}
          className={cn(
            "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition",
            inWishlist
              ? "border-brand-200 bg-brand-50 text-brand-700"
              : "border-ink-200 text-ink-700 hover:border-brand-200 hover:text-brand-700",
          )}
        >
          <Heart className={cn("size-4.5", inWishlist && "fill-current")} />
          {inWishlist ? "Favorilerde" : "Favorilere Ekle"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-11 items-center gap-2 rounded-xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
        >
          <Share2 className="size-4.5" />
          {shared ? "Bağlantı kopyalandı" : "Paylaş"}
        </button>
      </div>

      {added && (
        <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          <Check className="size-4" /> Ürün sepete eklendi.
          <Link href="/sepet" className="font-bold text-green-900 underline">
            Sepete git
          </Link>
        </p>
      )}
    </div>
  );
}
