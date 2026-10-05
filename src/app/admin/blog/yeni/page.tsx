import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="size-4" /> Yazılara dön
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900">Yeni Blog Yazısı</h1>
      </div>
      <BlogForm />
    </div>
  );
}
