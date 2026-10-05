import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export const dynamic = "force-dynamic";

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/slider"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Vitrin slider&apos;a dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Yeni Slayt</h1>
      </div>
      <HeroSlideForm />
    </div>
  );
}
