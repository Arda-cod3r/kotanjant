import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Yazılara dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Yazıyı Düzenle</h1>
        <p className="mt-1 text-sm text-ink-500">{post.title}</p>
      </div>
      <BlogForm post={post} />
    </div>
  );
}
