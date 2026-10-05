import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { DeleteHeroSlideButton } from "@/components/admin/ContentDeleteButtons";
import { getAdminHeroSlides } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function AdminHeroSliderPage() {
  const slides = await getAdminHeroSlides();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Vitrin Slider</h1>
          <p className="mt-1 text-sm text-ink-500">
            {slides.length} slayt · ana sayfadaki büyük görselleri ve üzerindeki yazıları düzenleyin
          </p>
        </div>
        <Link
          href="/admin/slider/yeni"
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Yeni Slayt
        </Link>
      </div>

      <div className="overflow-hidden border border-ink-100 bg-white">
        {slides.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-500">
            Henüz slayt yok. &quot;Yeni Slayt&quot; ile ana sayfa vitrinine görsel ekleyin.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Slayt</th>
                  <th className="px-4 py-3 font-semibold">Buton</th>
                  <th className="px-4 py-3 font-semibold">Sıra</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 text-right font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-20 shrink-0 overflow-hidden bg-ink-50">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/slider/${slide.id}/duzenle`}
                            className="font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {slide.title}
                          </Link>
                          <p className="truncate text-xs text-ink-400">{slide.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-700">{slide.cta}</p>
                      <p className="truncate text-xs text-ink-400">{slide.href}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{slide.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold ${
                          slide.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        {slide.isActive ? "Yayında" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/slider/${slide.id}/duzenle`}
                          aria-label="Slaytı düzenle"
                          className="flex size-9 items-center justify-center text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteHeroSlideButton id={slide.id} title={slide.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
