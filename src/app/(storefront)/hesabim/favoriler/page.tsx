import WishlistPanel from "@/components/storefront/WishlistPanel";

export const dynamic = "force-dynamic";

export default function AccountFavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Favorilerim</h1>
        <p className="mt-1 text-sm text-ink-500">
          Beğendiğiniz ürünler bu sayfada listelenir; dilediğinizi favorilerden çıkarabilirsiniz.
        </p>
      </div>
      <WishlistPanel />
    </div>
  );
}
