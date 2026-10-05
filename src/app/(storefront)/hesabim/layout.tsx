import { redirect } from "next/navigation";
import AccountSidebar from "@/components/storefront/AccountSidebar";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Müşteri hesap alanı: giriş yapmamış kullanıcılar giriş sayfasına yönlendirilir. */
export default async function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  if (!user) redirect("/giris");

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <AccountSidebar user={user} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
