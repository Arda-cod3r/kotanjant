import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, User } from "lucide-react";
import { getBlogPostBySlug } from "@/server/catalog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-3xl py-10">
      <nav aria-label="Sayfa yolu" className="flex items-center gap-1 text-xs text-ink-500">
        <Link href="/" className="hover:text-brand-700">Ana Sayfa</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/blog" className="hover:text-brand-700">Blog</Link>
      </nav>

      <h1 className="mt-4 text-3xl font-black leading-tight text-ink-900">{post.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-500">
        <span className="flex items-center gap-1.5">
          <User className="size-4" /> {post.authorName}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" /> {formatDate(post.publishedAt)}
        </span>
      </div>

      {post.coverImage && (
        <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-2xl bg-ink-100">
          <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
      )}

      <p className="mt-6 text-base font-medium leading-relaxed text-ink-700">{post.excerpt}</p>
      <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink-600">
        {post.content}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
            #{tag}
          </span>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-10 inline-flex h-11 items-center rounded-xl border border-ink-200 px-5 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
      >
        ← Tüm yazılara dön
      </Link>
    </article>
  );
}
