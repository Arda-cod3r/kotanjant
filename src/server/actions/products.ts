"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface ProductActionState {
  error?: string;
}

const imageListSchema = z.array(
  z.object({
    url: z.string().min(1),
    alt: z.string().nullish(),
    isPrimary: z.boolean().nullish(),
  }),
);

const specListSchema = z.array(
  z.object({ label: z.string().min(1), value: z.string().min(1) }),
);

function toNumber(value: FormDataEntryValue | null): number {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

interface ParsedProduct {
  name: string;
  slug: string;
  sku: string;
  shortDesc: string | null;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  lowStockAlert: number;
  categoryId: string | null;
  brandName: string | null;
  tags: string[];
  isFeatured: boolean;
  isDeal: boolean;
  isNew: boolean;
  isActive: boolean;
  images: { url: string; alt: string | null; isPrimary: boolean; sortOrder: number }[];
  specs: { label: string; value: string; sortOrder: number }[];
}

/** FormData'yı doğrulanmış ürün verisine çevirir (zod + JSON alanları). */
function parseProductForm(formData: FormData): { data?: ParsedProduct; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = toNumber(formData.get("price"));

  if (!name) return { error: "Ürün adı zorunludur." };
  if (!sku) return { error: "SKU (stok kodu) zorunludur." };
  if (price <= 0) return { error: "Geçerli bir satış fiyatı girin." };
  if (!description) return { error: "Ürün açıklaması zorunludur." };

  let images: ParsedProduct["images"] = [];
  let specs: ParsedProduct["specs"] = [];
  try {
    const parsedImages = imageListSchema.safeParse(
      JSON.parse(String(formData.get("images") ?? "[]")),
    );
    if (!parsedImages.success) return { error: "Görsel verisi geçersiz." };
    images = parsedImages.data.map((img, index) => ({
      url: img.url,
      alt: img.alt ?? null,
      isPrimary: img.isPrimary ?? index === 0,
      sortOrder: index,
    }));

    const parsedSpecs = specListSchema.safeParse(
      JSON.parse(String(formData.get("specs") ?? "[]")),
    );
    if (!parsedSpecs.success) return { error: "Teknik özellik verisi geçersiz." };
    specs = parsedSpecs.data.map((spec, index) => ({
      label: spec.label,
      value: spec.value,
      sortOrder: index,
    }));
  } catch {
    return { error: "Görsel veya teknik özellik verisi okunamadı." };
  }

  if (images.length === 0) return { error: "En az bir ürün görseli ekleyin." };

  const comparePrice = toNumber(formData.get("comparePrice"));
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    data: {
      name,
      slug: String(formData.get("slug") ?? "").trim() || slugify(name),
      sku,
      shortDesc: String(formData.get("shortDesc") ?? "").trim() || null,
      description,
      price,
      comparePrice: comparePrice > 0 ? comparePrice : null,
      stock: Math.max(0, Math.round(toNumber(formData.get("stock")))),
      lowStockAlert: Math.max(1, Math.round(toNumber(formData.get("lowStockAlert"))) || 5),
      categoryId: String(formData.get("categoryId") ?? "").trim() || null,
      brandName: String(formData.get("brandName") ?? "").trim() || null,
      tags,
      isFeatured: formData.get("isFeatured") === "on",
      isDeal: formData.get("isDeal") === "on",
      isNew: formData.get("isNew") === "on",
      isActive: formData.get("isActive") === "on",
      images,
      specs,
    },
  };
}

async function resolveBrandId(brandName: string | null): Promise<string | null> {
  if (!brandName) return null;
  const slug = slugify(brandName);
  const brand = await prisma.brand.upsert({
    where: { slug },
    update: { name: brandName },
    create: { name: brandName, slug },
  });
  return brand.id;
}

function refreshStorefront() {
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
}

/** Yeni ürün oluşturur (çoklu görsel + teknik özellik dahil). */
export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseProductForm(formData);
  if (!data) return { error };

  try {
    const brandId = await resolveBrandId(data.brandName);
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        shortDesc: data.shortDesc,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        stock: data.stock,
        lowStockAlert: data.lowStockAlert,
        isFeatured: data.isFeatured,
        isDeal: data.isDeal,
        isNew: data.isNew,
        isActive: data.isActive,
        tags: data.tags,
        categoryId: data.categoryId,
        brandId,
        images: { create: data.images },
        specs: { create: data.specs },
      },
    });
  } catch (err) {
    const message = (err as Error).message.includes("Unique constraint")
      ? "Bu slug veya SKU zaten kullanımda."
      : "Ürün kaydedilemedi.";
    return { error: message };
  }

  refreshStorefront();
  redirect("/admin/urunler");
}

/** Mevcut ürünü günceller; görseller/özellikler sıfırdan yazılır (sıralama korunur). */
export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const { data, error } = parseProductForm(formData);
  if (!data) return { error };

  try {
    const brandId = await resolveBrandId(data.brandName);
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        shortDesc: data.shortDesc,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        stock: data.stock,
        lowStockAlert: data.lowStockAlert,
        isFeatured: data.isFeatured,
        isDeal: data.isDeal,
        isNew: data.isNew,
        isActive: data.isActive,
        tags: data.tags,
        categoryId: data.categoryId,
        brandId,
        images: { deleteMany: {}, create: data.images },
        specs: { deleteMany: {}, create: data.specs },
      },
    });
  } catch (err) {
    const message = (err as Error).message.includes("Unique constraint")
      ? "Bu slug veya SKU başka bir üründe kullanımda."
      : "Ürün güncellenemedi.";
    return { error: message };
  }

  refreshStorefront();
  redirect("/admin/urunler");
}

/** Ürünü siler (ilişkili görseller/özellikler cascade ile temizlenir). */
export async function deleteProduct(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return;
  }

  refreshStorefront();
}
