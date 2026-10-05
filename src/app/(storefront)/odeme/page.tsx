import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import CheckoutForm from "@/components/storefront/CheckoutForm";

export const metadata: Metadata = {
  title: "Ödeme",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">Ödeme</h1>
      <p className="mt-1 flex items-center gap-2 text-sm text-ink-500">
        <ShieldCheck className="size-4 text-brand-600" />
        Bilgileriniz güvenli bir şekilde işlenir.
      </p>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
