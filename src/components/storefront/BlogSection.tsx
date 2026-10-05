import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { BlogPostDTO } from "@/lib/types";

export default function BlogSection({
  posts,
  showHeader = true,
}: {
  posts: BlogPostDTO[];
  showHeader?: boolean;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-ink-100 bg-ink-50/40 py-14">
      <div className="container-page">
        {showHeader && (
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">Blog &amp; Rehber</h2>
              <p className="mt-1 text-sm text-ink-500">
                Jant seçimi, bakım ve aksesuar önerileri hakkında güncel yazılar.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Tüm yazılar <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-ink-100">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  <CalendarDays className="size-3.5" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>
                <h3 className="mt-2 text-base font-bold leading-6 text-ink-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand-700">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2-custom text-sm leading-relaxed text-ink-500">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5"
                >
                  Devamını oku <ArrowRight className="size-4 transition-all" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
