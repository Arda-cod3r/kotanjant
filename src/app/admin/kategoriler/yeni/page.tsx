import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/kategoriler"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Kategorilere dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Yeni Kategori</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
