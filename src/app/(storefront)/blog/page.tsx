import type { Metadata } from "next";
import BlogSection from "@/components/storefront/BlogSection";
import { getBlogPosts } from "@/server/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Rehber",
  description: "Jant seçimi, bakım ve oto aksesuar rehberleri.",
};

export default async function BlogListPage() {
  const posts = await getBlogPosts(12);

  return (
    <div className="py-6">
      <div className="container-page">
        <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">Blog &amp; Rehber</h1>
        <p className="mt-1 text-sm text-ink-500">
          Jant kapağı seçimi, bakım ve oto aksesuar ürünleri hakkında güncel içerikler.
        </p>
      </div>
      <BlogSection posts={posts} showHeader={false} />
    </div>
  );
}
