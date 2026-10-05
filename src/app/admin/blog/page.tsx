import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { DeleteBlogPostButton } from "@/components/admin/ContentDeleteButtons";
import { getAdminBlogPosts } from "@/server/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Blog Yazıları</h1>
          <p className="mt-1 text-sm text-ink-500">{posts.length} yazı · ekle, düzenle, sil</p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex h-11 items-center gap-2 bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Yeni Yazı
        </Link>
      </div>

      <div className="overflow-hidden border border-ink-100 bg-white">
        {posts.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-500">
            Henüz blog yazısı yok. &quot;Yeni Yazı&quot; ile ekleyin.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Yazı</th>
                  <th className="px-4 py-3 font-semibold">Yazar</th>
                  <th className="px-4 py-3 font-semibold">Yayın Tarihi</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 text-right font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 shrink-0 overflow-hidden bg-ink-50">
                          {post.coverImage && (
                            <Image src={post.coverImage} alt={post.title} fill sizes="48px" className="object-cover" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/blog/${post.id}/duzenle`}
                            className="line-clamp-2-custom font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-ink-400">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{post.authorName}</td>
                    <td className="px-4 py-3 text-ink-600">{formatDate(post.publishedAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold ${
                          post.isPublished
                            ? "bg-green-50 text-green-700"
                            : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        {post.isPublished ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/blog/${post.id}/duzenle`}
                          aria-label="Yazıyı düzenle"
                          className="flex size-9 items-center justify-center text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteBlogPostButton id={post.id} title={post.title} />
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
