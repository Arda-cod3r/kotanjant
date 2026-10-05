"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  GalleryHorizontalEnd,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/server/actions/auth";
import type { Role } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/urunler", label: "Ürün Yönetimi", icon: Package, exact: false },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree, exact: false },
  { href: "/admin/slider", label: "Vitrin Slider", icon: GalleryHorizontalEnd, exact: false },
  { href: "/admin/blog", label: "Blog Yazıları", icon: Newspaper, exact: false },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag, exact: false },
];

export default function AdminSidebar({
  user,
}: {
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-ink-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5">
        <span className="text-brand-600">
          <svg viewBox="0 0 48 48" className="size-8" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="24" cy="24" r="4.5" fill="currentColor" />
            <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6" />
          </svg>
        </span>
        <div className="leading-tight">
          <p className="text-sm font-black text-ink-900">KOTANJANT</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            Yönetim Paneli
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
        >
          <Store className="size-5" /> Mağazaya dön
        </Link>

        <div className="mt-2 rounded-xl bg-ink-50 p-3">
          <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-ink-500">{user.email}</p>
          <span className="mt-1.5 inline-block rounded-md bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {user.role === "SUPERADMIN" ? "Süperadmin" : "Admin"}
          </span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="size-5" /> Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
