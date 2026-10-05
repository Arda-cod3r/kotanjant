"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShoppingCart, Star } from "lucide-react";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: ProductDTO;
  priority?: boolean;
}) {
  const addToCart = useCartStore((s) => s.add);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistItems = useWishlistStore((s) => s.items);
  const [justAdded, setJustAdded] = useState(false);
  const mounted = useMounted();

  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const inWishlist = mounted && wishlistItems.some((i) => i.productId === product.id);
  const discount = discountPercent(product.price, product.comparePrice);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.lowStockAlert;

  function handleAddToCart() {
    if (outOfStock) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: image?.url ?? null,
      sku: product.sku,
      stock: product.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  function handleToggleWishlist() {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: image?.url ?? null,
    });
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:border-ink-200 hover:shadow-lg">
      {/* Etiketler */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
            %{discount} İndirim
          </span>
        )}
        {product.isNew && !discount && (
          <span className="rounded-md bg-ink-900 px-2 py-0.5 text-xs font-bold text-white">
            Yeni
          </span>
        )}
        {lowStock && (
          <span className="rounded-md bg-accent-500 px-2 py-0.5 text-xs font-bold text-ink-950">
            Son {product.stock}
          </span>
        )}
      </div>

      {/* Favori */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label={inWishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
        aria-pressed={inWishlist}
        className={cn(
          "absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-ink-100 backdrop-blur transition hover:bg-white",
          inWishlist ? "text-brand-600" : "text-ink-500",
        )}
      >
        <Heart className={cn("size-4", inWishlist && "fill-current")} />
      </button>

      {/* Görsel */}
      <Link
        href={`/urun/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ink-50"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-ink-400">
            Görsel yok
          </span>
        )}
      </Link>

      {/* Bilgiler */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <Link
            href={`/kategori/${product.category.slug}`}
            className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 hover:text-brand-600"
          >
            {product.category.name}
          </Link>
        )}
        <h3 className="mt-1 line-clamp-2-custom min-h-10 text-sm font-semibold leading-5 text-ink-900">
          <Link href={`/urun/${product.slug}`} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>

        {product.ratingCount > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-ink-500">
            <Star className="size-3.5 fill-accent-500 text-accent-500" />
            <span className="font-medium text-ink-700">{product.ratingAvg.toFixed(1)}</span>
            <span>({product.ratingCount})</span>
          </div>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink-900">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-ink-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition",
              outOfStock
                ? "cursor-not-allowed bg-ink-100 text-ink-400"
                : justAdded
                  ? "bg-green-600 text-white"
                  : "bg-brand-600 text-white hover:bg-brand-700",
            )}
          >
            {outOfStock ? (
              "Stokta Yok"
            ) : justAdded ? (
              <>
                <Check className="size-4" /> Eklendi
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" /> Sepete Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
