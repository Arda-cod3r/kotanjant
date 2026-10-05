import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Güvenli Alışveriş",
    text: "256-bit SSL sertifikası ile korunan ödeme altyapısı.",
  },
  {
    icon: RotateCcw,
    title: "Kolay İade & Değişim",
    text: "14 gün içinde koşulsuz iade ve ücretsiz değişim.",
  },
  {
    icon: CreditCard,
    title: "Ödeme Seçenekleri",
    text: "Kredi kartı, havale/EFT ve kapıda ödeme imkânı.",
  },
  {
    icon: Truck,
    title: "Hızlı Teslimat",
    text: "14:00'a kadar verilen siparişler aynı gün kargoda.",
  },
];

export default function TrustBar() {
  return (
    <section aria-label="Alışveriş avantajları" className="border-y border-ink-100 bg-ink-50/60">
      <div className="container-page grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group flex items-start gap-4 border border-transparent bg-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ink-200 hover:bg-white hover:shadow-lg"
          >
            <span className="flex size-12 shrink-0 items-center justify-center bg-white text-brand-600 shadow-sm ring-1 ring-ink-100 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
              <Icon className="size-6" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
