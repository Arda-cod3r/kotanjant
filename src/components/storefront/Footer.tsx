import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import NewsletterForm from "./NewsletterForm";
import type { CategoryDTO } from "@/lib/types";

const CORPORATE_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/blog", label: "Blog" },
  { href: "/garanti-ve-iade", label: "Garanti ve İade" },
  { href: "/kargo-takip", label: "Kargo Takip" },
];

const HELP_LINKS = [
  { href: "/sss", label: "Sıkça Sorulan Sorular" },
  { href: "/jant-olcu-rehberi", label: "Jant Ölçü Rehberi" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
];

export default function Footer({ categories }: { categories: CategoryDTO[] }) {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      {/* Bülten */}
      <div className="border-b border-white/10">
        <div className="container-page grid grid-cols-1 items-center gap-6 py-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-white">Fırsatlardan ilk siz haberdar olun</h2>
            <p className="mt-1 text-sm text-ink-400">
              Yeni ürünler, indirimler ve jant bakım ipuçları için bültenimize abone olun.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Kurumsal kolonlar */}
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Kategoriler</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link href={`/kategori/${category.slug}`} className="transition hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Kurumsal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CORPORATE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Yardım &amp; Yasal
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">İletişim</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>Örnek Mah. Jant Sok. No: 15, İstanbul / Türkiye</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-brand-400" />
              <a href="tel:+908500000000" className="transition hover:text-white">
                0850 000 00 00
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-brand-400" />
              <a href="mailto:destek@kotanjant.com" className="transition hover:text-white">
                destek@kotanjant.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-brand-400" />
              <span>Hafta içi 09:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Yasal uyarı + telif */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Kotanjant Jant &amp; Aksesuar. Tüm hakları saklıdır.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>ETBİS&apos;e kayıtlıdır.</span>
            <span className="hidden sm:inline">·</span>
            <span>Fiyatlar KDV dahildir.</span>
            <span className="hidden sm:inline">·</span>
            <span>Ödeme: Visa / Mastercard / Troy / Havale / Kapıda</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
