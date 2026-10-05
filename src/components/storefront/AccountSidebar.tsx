"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

const NAV = [
  { href: "/hesabim", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
  { href: "/hesabim/bilgilerim", label: "Üye Bilgilerim", icon: User, exact: false },
  { href: "/hesabim/iletisim-tercihleri", label: "İletişim Tercihlerim", icon: Mail, exact: false },
  { href: "/hesabim/adreslerim", label: "Adreslerim", icon: MapPin, exact: false },
  { href: "/hesabim/siparisler", label: "Sipariş ve İade", icon: Package, exact: false },
  { href: "/hesabim/odemelerim", label: "Ödemelerim", icon: CreditCard, exact: false },
  { href: "/hesabim/favoriler", label: "Favorilerim", icon: Heart, exact: false },
];

export default function AccountSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const isStaff = user.role !== "CUSTOMER";

  return (
    <aside className="h-fit border border-ink-100 bg-white lg:sticky lg:top-28">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <User className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-ink-500">{user.email}</p>
        </div>
      </div>

      <nav className="p-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-transparent text-ink-600 hover:bg-ink-50 hover:text-ink-900",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}

        {isStaff && (
          <Link
            href="/admin"
            className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <ShieldCheck className="size-5" /> Yönetim Paneli
          </Link>
        )}
      </nav>

      <form action={logoutAction} className="border-t border-ink-100 p-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="size-5" /> Güvenli Çıkış
        </button>
      </form>
    </aside>
  );
}

