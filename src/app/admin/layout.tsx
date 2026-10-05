import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderTree, GalleryHorizontalEnd, LayoutDashboard, Newspaper, Package, ShoppingBag } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSessionUser, isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Rol tabanlı koruma: yalnızca ADMIN / SUPERADMIN erişebilir.
  const user = await getSessionUser();
  if (!user || !isAdminUser(user)) redirect("/giris");

  return (
    <div className="min-h-dvh bg-ink-50 lg:flex">
      <AdminSidebar user={user} />

      <div className="min-w-0 flex-1">
        {/* Mobil üst navigasyon */}
        <div className="flex h-14 items-center gap-1 overflow-x-auto border-b border-ink-200 bg-white px-3 lg:hidden">
          <span className="mr-2 shrink-0 text-sm font-black text-ink-900">Yönetim</span>
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <LayoutDashboard className="size-4" /> Panel
          </Link>
          <Link
            href="/admin/urunler"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <Package className="size-4" /> Ürünler
          </Link>
          <Link
            href="/admin/kategoriler"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <FolderTree className="size-4" /> Kategoriler
          </Link>
          <Link
            href="/admin/slider"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <GalleryHorizontalEnd className="size-4" /> Slider
          </Link>
          <Link
            href="/admin/blog"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <Newspaper className="size-4" /> Blog
          </Link>
          <Link
            href="/admin/siparisler"
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <ShoppingBag className="size-4" /> Siparişler
          </Link>
        </div>

        <div className="p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
