import { prisma } from "@/lib/prisma";
import type { BlogPostDTO, CategoryDTO, HeroSlideDTO } from "@/lib/types";

async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.warn("[admin-content] Veritabanı erişilemedi:", (error as Error).message);
    return fallback;
  }
}

const toBlogDTO = (b: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
}): BlogPostDTO => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  excerpt: b.excerpt,
  content: b.content,
  coverImage: b.coverImage,
  authorName: b.authorName,
  tags: b.tags,
  isPublished: b.isPublished,
  publishedAt: b.publishedAt.toISOString(),
});

/** Admin listesi: yayında olmayanlar dahil tüm blog yazıları. */
export async function getAdminBlogPosts(): Promise<BlogPostDTO[]> {
  return safe(async () => {
    const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return rows.map(toBlogDTO);
  }, []);
}

export async function getBlogPostById(id: string): Promise<BlogPostDTO | null> {
  return safe(async () => {
    const row = await prisma.blogPost.findUnique({ where: { id } });
    return row ? toBlogDTO(row) : null;
  }, null);
}

/** Admin listesi: pasif kategoriler dahil tüm kategoriler. */
export async function getAdminCategories(): Promise<CategoryDTO[]> {
  return safe(async () => {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      isActive: c.isActive,
      productCount: c._count.products,
    }));
  }, []);
}

/** Admin listesi: pasif slaytlar dahil tüm hero (vitrin) slaytları. */
export async function getAdminHeroSlides(): Promise<HeroSlideDTO[]> {
  return safe(async () => {
    const rows = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      href: s.href,
      cta: s.cta,
      sortOrder: s.sortOrder,
      isActive: s.isActive,
    }));
  }, []);
}
