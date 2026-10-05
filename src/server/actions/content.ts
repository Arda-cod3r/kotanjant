"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface ContentActionState {
  error?: string;
}

const blogSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı."),
  excerpt: z.string().min(10, "Özet en az 10 karakter olmalı."),
  content: z.string().min(20, "İçerik en az 20 karakter olmalı."),
  authorName: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  publishedAt: z.string().trim().optional(),
});

function parseBlogForm(formData: FormData) {
  const parsed = blogSchema.safeParse({
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    authorName: String(formData.get("authorName") ?? "").trim() || undefined,
    coverImage: String(formData.get("coverImage") ?? "").trim() || undefined,
    publishedAt: String(formData.get("publishedAt") ?? "").trim() || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let publishedAt = new Date();
  if (parsed.data.publishedAt) {
    const d = new Date(parsed.data.publishedAt);
    if (!Number.isNaN(d.getTime())) publishedAt = d;
  }

  return {
    data: {
      title: parsed.data.title,
      slug: String(formData.get("slug") ?? "").trim() || slugify(parsed.data.title),
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage ?? null,
      authorName: parsed.data.authorName ?? "Kotanjant Editör",
      tags,
      isPublished: formData.get("isPublished") === "on",
      publishedAt,
    },
  };
}

function refreshBlog() {
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

export async function createBlogPost(
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseBlogForm(formData);
  if (!data) return { error };

  try {
    await prisma.blogPost.create({ data });
  } catch (err) {
    return {
      error: (err as Error).message.includes("Unique constraint")
        ? "Bu slug zaten kullanımda."
        : "Yazı kaydedilemedi.",
    };
  }

  refreshBlog();
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseBlogForm(formData);
  if (!data) return { error };

  try {
    await prisma.blogPost.update({ where: { id }, data });
  } catch (err) {
    return {
      error: (err as Error).message.includes("Unique constraint")
        ? "Bu slug başka bir yazıda kullanımda."
        : "Yazı güncellenemedi.",
    };
  }

  refreshBlog();
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch {
    return;
  }
  refreshBlog();
}

// ---------------------------------------------------------------------------
// Kategoriler
// ---------------------------------------------------------------------------

const categorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı."),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
});

function parseCategoryForm(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  return {
    data: {
      name: parsed.data.name,
      slug: String(formData.get("slug") ?? "").trim() || slugify(parsed.data.name),
      description: parsed.data.description ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      sortOrder: Math.max(0, Math.round(Number(formData.get("sortOrder") ?? 0) || 0)),
      isActive: formData.get("isActive") === "on",
    },
  };
}

function refreshCategories() {
  revalidatePath("/admin/kategoriler");
  revalidatePath("/");
  revalidatePath("/urunler");
}

export async function createCategory(
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseCategoryForm(formData);
  if (!data) return { error };

  try {
    await prisma.category.create({ data });
  } catch (err) {
    return {
      error: (err as Error).message.includes("Unique constraint")
        ? "Bu slug zaten kullanımda."
        : "Kategori kaydedilemedi.",
    };
  }

  refreshCategories();
  redirect("/admin/kategoriler");
}

export async function updateCategory(
  id: string,
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseCategoryForm(formData);
  if (!data) return { error };

  try {
    await prisma.category.update({ where: { id }, data });
  } catch (err) {
    return {
      error: (err as Error).message.includes("Unique constraint")
        ? "Bu slug başka bir kategoride kullanımda."
        : "Kategori güncellenemedi.",
    };
  }

  refreshCategories();
  redirect("/admin/kategoriler");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return;
  }
  refreshCategories();
}

// ---------------------------------------------------------------------------
// Vitrin (Hero) Slider
// ---------------------------------------------------------------------------

const heroSlideSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalı."),
  subtitle: z.string().min(2, "Alt başlık en az 2 karakter olmalı."),
  image: z.string().min(1, "Bir görsel seçin veya yükleyin."),
  href: z.string().min(1, "Butonun gideceği bağlantı gerekli."),
  cta: z.string().min(1, "Buton metni gerekli."),
});

function parseHeroSlideForm(formData: FormData) {
  const parsed = heroSlideSchema.safeParse({
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    href: String(formData.get("href") ?? "").trim(),
    cta: String(formData.get("cta") ?? "").trim(),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  return {
    data: {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      image: parsed.data.image,
      href: parsed.data.href,
      cta: parsed.data.cta,
      sortOrder: Math.max(0, Math.round(Number(formData.get("sortOrder") ?? 0) || 0)),
      isActive: formData.get("isActive") === "on",
    },
  };
}

function refreshHero() {
  revalidatePath("/");
  revalidatePath("/admin/slider");
}

export async function createHeroSlide(
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseHeroSlideForm(formData);
  if (!data) return { error };

  try {
    await prisma.heroSlide.create({ data });
  } catch {
    return { error: "Slayt kaydedilemedi." };
  }

  refreshHero();
  redirect("/admin/slider");
}

export async function updateHeroSlide(
  id: string,
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseHeroSlideForm(formData);
  if (!data) return { error };

  try {
    await prisma.heroSlide.update({ where: { id }, data });
  } catch {
    return { error: "Slayt güncellenemedi." };
  }

  refreshHero();
  redirect("/admin/slider");
}

export async function deleteHeroSlide(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.heroSlide.delete({ where: { id } });
  } catch {
    return;
  }
  refreshHero();
}
