"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useMounted } from "@/lib/use-mounted";
import { useCartStore, selectCartCount } from "@/lib/store/cart";
import { useWishlistStore, selectWishlistCount } from "@/lib/store/wishlist";
import { logoutAction } from "@/server/actions/auth";
import type { CategoryDTO, SessionUser } from "@/lib/types";

function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6" />
      <circle cx="24" cy="24" r="4.5" fill="currentColor" />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={24 + Math.cos(angle) * 6}
            y1={24 + Math.sin(angle) * 6}
            x2={24 + Math.cos(angle) * 19}
            y2={24 + Math.sin(angle) * 19}
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold leading-5 text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header({
  categories,
  user = null,
}: {
  categories: CategoryDTO[];
  user?: SessionUser | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // localStorage tabanlı store'lar yalnızca client'ta bilinir; hydration
  // uyuşmazlığını önlemek için sayaçlar mount sonrası gösterilir.
  const mounted = useMounted();

  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const safeCart = mounted ? cartCount : 0;
  const safeWishlist = mounted ? wishlistCount : 0;
  const isStaff = user != null && user.role !== "CUSTOMER";
  const firstName = user?.name.split(" ")[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Üst duyuru çubuğu */}
      <div className="hidden bg-ink-950 text-ink-100 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 text-brand-400" /> 1.500 ₺ üzeri kargo bedava
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand-400" /> 256-bit güvenli ödeme
            </span>
          </div>
          <a href="tel:+908500000000" className="flex items-center gap-1.5 hover:text-white">
            <Phone className="size-3.5 text-brand-400" /> 0850 000 00 00
          </a>
        </div>
      </div>

      {/* Ana bar: logo + arama + aksiyonlar */}
      <div className="border-b border-ink-100">
        <div className="container-page flex h-16 items-center gap-4 lg:h-20">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menüyü aç/kapat"
            className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2 text-brand-600">
            <LogoMark />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-xl font-black tracking-tight text-ink-900">KOTANJANT</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-500">
                Jant &amp; Aksesuar
              </span>
            </span>
          </Link>

          <SearchBar className="hidden flex-1 lg:block" />

          <nav className="ml-auto flex items-center gap-1 lg:gap-2">
            {isStaff && (
              <Link
                href="/admin"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-brand-700 xl:flex"
              >
                <LayoutDashboard className="size-5" />
                Yönetim
              </Link>
            )}
            <Link
              href={user ? "/hesabim" : "/giris"}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-brand-700"
            >
              <User className="size-5" />
              <span className="hidden lg:inline">{user ? firstName : "Hesabım"}</span>
            </Link>
            <Link
              href="/favoriler"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-brand-700"
            >
              <Heart className="size-5" />
              <span className="hidden lg:inline">Favorilerim</span>
              <CountBadge count={safeWishlist} />
            </Link>
            <Link
              href="/sepet"
              className="relative ml-1 flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <ShoppingCart className="size-5" />
              <span className="hidden sm:inline">Sepetim</span>
              <CountBadge count={safeCart} />
            </Link>
          </nav>
        </div>

        {/* Mobil arama */}
        <div className="container-page pb-3 lg:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Kategori navigasyonu (masaüstü) */}
      <div className="hidden border-b border-ink-100 bg-ink-50/60 lg:block">
        <div className="container-page flex h-11 items-center gap-1 text-sm">
          <Link
            href="/urunler"
            className="rounded-lg px-3 py-1.5 font-semibold text-ink-900 hover:bg-white hover:text-brand-700"
          >
            Tüm Ürünler
          </Link>
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="rounded-lg px-3 py-1.5 text-ink-700 transition hover:bg-white hover:text-brand-700"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/urunler?firsat=1"
            className="rounded-lg px-3 py-1.5 font-medium text-brand-700 transition hover:bg-white"
          >
            Fırsatlar
          </Link>
          <Link
            href="/blog"
            className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-ink-700 transition hover:bg-white hover:text-brand-700"
          >
            Blog <ChevronDown className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="border-b border-ink-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col py-2">
            <Link
              href="/urunler"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 font-semibold text-ink-900 hover:bg-ink-50"
            >
              Tüm Ürünler
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-50"
            >
              Blog
            </Link>
            <Link
              href={user ? "/hesabim" : "/giris"}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 font-semibold text-ink-900 hover:bg-ink-50"
            >
              {user ? "Hesabım" : "Giriş Yap"}
            </Link>
            {!user && (
              <Link
                href="/kayit"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 font-semibold text-brand-700 hover:bg-ink-50"
              >
                Kayıt Ol
              </Link>
            )}
            {isStaff && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-brand-700 hover:bg-ink-50"
              >
                Yönetim Paneli
              </Link>
            )}
            {user && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-lg px-3 py-2.5 text-left font-medium text-red-600 hover:bg-red-50"
                >
                  Çıkış Yap
                </button>
              </form>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
