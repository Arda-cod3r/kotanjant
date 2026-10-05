import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Kotanjant'a üye olun; siparişlerinizi takip edin, favorilerinizi saklayın.",
};

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "CUSTOMER" ? "/hesabim" : "/admin");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-brand-600">
          <UserPlus className="size-8" />
          <div>
            <h1 className="text-xl font-black text-ink-900">Kayıt Ol</h1>
            <p className="text-xs text-ink-500">Yeni müşteri hesabı oluşturun</p>
          </div>
        </div>

        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
