import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "@/components/admin/HeroSlideForm";
import { getAdminHeroSlides } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slides = await getAdminHeroSlides();
  const slide = slides.find((s) => s.id === id);
  if (!slide) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/slider"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Vitrin slider&apos;a dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Slaytı Düzenle</h1>
        <p className="mt-1 text-sm text-ink-500">{slide.title}</p>
      </div>
      <HeroSlideForm slide={slide} />
    </div>
  );
}
