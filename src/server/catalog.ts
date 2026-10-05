import { prisma } from "@/lib/prisma";
import type { BlogPostDTO, CategoryDTO, HeroSlideDTO, ProductDTO } from "@/lib/types";
import { demoBlogPosts, demoCategories, demoProducts, heroSlides } from "@/lib/demo-data";

// Prisma sorgusundan dönen satırın ihtiyaç duyduğumuz yapısal tipi.
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDesc: string | null;
  description: string;
  price: unknown;
  comparePrice: unknown;
  currency: string;
  stock: number;
  lowStockAlert: number;
  isFeatured: boolean;
  isDeal: boolean;
  isNew: boolean;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  categoryId: string | null;
  brandId: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string } | null;
  brand: { name: string } | null;
  images: { id: string; url: string; alt: string | null; sortOrder: number; isPrimary: boolean }[];
  specs: { id: string; label: string; value: string; sortOrder: number }[];
};

export const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { name: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
  specs: { orderBy: { sortOrder: "asc" as const } },
};

export function toProductDTO(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    shortDesc: p.shortDesc,
    description: p.description,
    price: Number(p.price),
    comparePrice: p.comparePrice == null ? null : Number(p.comparePrice),
    currency: p.currency,
    stock: p.stock,
    lowStockAlert: p.lowStockAlert,
    isFeatured: p.isFeatured,
    isDeal: p.isDeal,
    isNew: p.isNew,
    isActive: p.isActive,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    categoryId: p.categoryId,
    category: p.category,
    brandId: p.brandId,
    brandName: p.brand?.name ?? null,
    tags: p.tags,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    specs: p.specs.map((s) => ({
      id: s.id,
      label: s.label,
      value: s.value,
      sortOrder: s.sortOrder,
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

/** Veritabanı erişilemezse (örn. kurulum öncesi) demo veriye düşer. */
async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.warn(
      "[catalog] Veritabanı erişilemedi, demo veri kullanılıyor:",
      (error as Error).message,
    );
    return fallback;
  }
}

export type ProductBadge = "featured" | "deal" | "new";

const BADGE_FIELD: Record<ProductBadge, "isFeatured" | "isDeal" | "isNew"> = {
  featured: "isFeatured",
  deal: "isDeal",
  new: "isNew",
};

export async function getProductsByBadge(badge: ProductBadge, limit = 8): Promise<ProductDTO[]> {
  const fallback = demoProducts
    .filter((p) =>
      badge === "featured" ? p.isFeatured : badge === "deal" ? p.isDeal : p.isNew,
    )
    .slice(0, limit);

  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true, [BADGE_FIELD[badge]]: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, fallback);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  return safe(async () => {
    const row = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: PRODUCT_INCLUDE,
    });
    return row ? toProductDTO(row as unknown as ProductRow) : null;
  }, demoProducts.find((p) => p.slug === slug) ?? null);
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  return safe(async () => {
    const row = await prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
    return row ? toProductDTO(row as unknown as ProductRow) : null;
  }, null);
}

export async function getRelatedProducts(product: ProductDTO, limit = 4): Promise<ProductDTO[]> {
  const fallback = demoProducts.filter((p) => p.id !== product.id).slice(0, limit);
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      },
      include: PRODUCT_INCLUDE,
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, fallback);
}

export async function getProducts(limit = 60): Promise<ProductDTO[]> {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, demoProducts.slice(0, limit));
}

/** Admin listesi: pasif ürünler dahil tüm kayıtlar. */
export async function getAdminProducts(limit = 200): Promise<ProductDTO[]> {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      include: PRODUCT_INCLUDE,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, []);
}

export async function getProductsByCategory(categorySlug: string, limit = 60): Promise<ProductDTO[]> {
  const fallback = demoProducts.filter((p) => p.category?.slug === categorySlug).slice(0, limit);
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true, category: { slug: categorySlug } },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, fallback);
}

export async function searchProducts(query: string, limit = 12): Promise<ProductDTO[]> {
  const q = query.trim();
  if (!q) return [];

  const fallback = demoProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase()),
    )
    .slice(0, limit);

  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      },
      include: PRODUCT_INCLUDE,
      take: limit,
    });
    return (rows as unknown as ProductRow[]).map(toProductDTO);
  }, fallback);
}

export async function getCategories(): Promise<CategoryDTO[]> {
  return safe(async () => {
    const rows = await prisma.category.findMany({
      where: { isActive: true },
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
  }, demoCategories);
}

/** Vitrin (hero) slaytları — veritabanı erişilemezse demo slaytlara düşer. */
const demoHeroSlides: HeroSlideDTO[] = heroSlides.map((s, index) => ({
  id: `demo-hero-${index + 1}`,
  title: s.title,
  subtitle: s.subtitle,
  image: s.image,
  href: s.href,
  cta: s.cta,
  sortOrder: index,
  isActive: true,
}));

export async function getHeroSlides(): Promise<HeroSlideDTO[]> {
  return safe(async () => {
    const rows = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
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
  }, demoHeroSlides);
}

export async function getBlogPosts(limit = 3): Promise<BlogPostDTO[]> {
  return safe(async () => {
    const rows = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    return rows.map((b) => ({
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
    }));
  }, demoBlogPosts.slice(0, limit));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDTO | null> {
  return safe(async () => {
    const b = await prisma.blogPost.findFirst({ where: { slug, isPublished: true } });
    if (!b) return null;
    return {
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
    };
  }, demoBlogPosts.find((b) => b.slug === slug) ?? null);
}
