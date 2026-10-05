import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Kotanjant hesabınıza giriş yapın.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "CUSTOMER" ? "/hesabim" : "/admin");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-brand-600">
          <LogIn className="size-8" />
          <div>
            <h1 className="text-xl font-black text-ink-900">Giriş Yap</h1>
            <p className="text-xs text-ink-500">
              Müşteri ve yönetici hesapları için ortak giriş
            </p>
          </div>
        </div>

        <div className="mt-6">
          <LoginForm />
        </div>

        <div className="mt-6 rounded-xl bg-ink-50 px-4 py-3 text-xs leading-relaxed text-ink-500">
          <p className="font-semibold text-ink-700">Girişten sonra yönlendirme</p>
          Müşteri hesapları <span className="font-medium text-ink-700">/hesabim</span>, yönetici
          hesapları <span className="font-medium text-ink-700">/admin</span> paneline yönlendirilir.
        </div>
      </div>
    </div>
  );
}
