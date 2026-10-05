import type { Metadata } from "next";
import WishlistPanel from "@/components/storefront/WishlistPanel";

export const metadata: Metadata = {
  title: "Favorilerim",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">Favorilerim</h1>
      <p className="mt-1 mb-8 text-sm text-ink-500">
        Beğendiğiniz ürünler burada saklanır; hesabınıza giriş yaptığınızda da görüntüleyebilirsiniz.
      </p>
      <WishlistPanel />
    </div>
  );
}

