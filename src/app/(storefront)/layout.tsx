import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getCategories } from "@/server/catalog";
import { getSessionUser } from "@/lib/auth";

// Mağaza (storefront) düzeni: üst menü + içerik + alt bilgi.
// Oturum bilgisi header'a aktarılır (Hesabım linki ve menü durumu için).
export default async function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categories, user] = await Promise.all([getCategories(), getSessionUser()]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header categories={categories} user={user} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}
