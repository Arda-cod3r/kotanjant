import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { getAdminCategories } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getAdminCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/kategoriler"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Kategorilere dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Kategoriyi Düzenle</h1>
        <p className="mt-1 text-sm text-ink-500">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
