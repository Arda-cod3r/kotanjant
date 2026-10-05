import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { demoBlogPosts, demoCategories, heroSlides, seedProducts } from "../src/lib/demo-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Kullanıcıları oluşturur:
 * - SUPERADMIN: tüm yetkiler (seed ile)
 * - ADMIN: mağaza yöneticisi (rol tabanlı yetkilendirmeyi göstermek için ikinci hesap)
 * - CUSTOMER: müşteri hesabı (kayıt/giriş ve /hesabim akışını test etmek için)
 */
async function seedUsers() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "superadmin@kotanjant.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "SuperAdmin!234";
  const name = process.env.SEED_ADMIN_NAME ?? "Süper Admin";

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "SUPERADMIN", name },
    create: { email, name, passwordHash: await bcrypt.hash(password, 10), role: "SUPERADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "admin@kotanjant.com" },
    update: {},
    create: {
      email: "admin@kotanjant.com",
      name: "Mağaza Yöneticisi",
      passwordHash: await bcrypt.hash("Admin!2345", 10),
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "musteri@kotanjant.com" },
    update: {},
    create: {
      email: "musteri@kotanjant.com",
      name: "Örnek Müşteri",
      phone: "0555 000 00 00",
      passwordHash: await bcrypt.hash("Musteri!234", 10),
      role: "CUSTOMER",
    },
  });

  console.log(`✓ ${email} (SUPERADMIN), admin@kotanjant.com (ADMIN), musteri@kotanjant.com (CUSTOMER)`);
  return { admin, customer };
}

async function seedCatalog() {
  const brand = await prisma.brand.upsert({
    where: { slug: "kotanjant" },
    update: {},
    create: { name: "Kotanjant", slug: "kotanjant" },
  });

  const categoryIds = new Map<string, string>();
  for (const [index, c] of demoCategories.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, imageUrl: c.imageUrl, sortOrder: index },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl,
        sortOrder: index,
      },
    });
    categoryIds.set(c.slug, cat.id);
  }
  console.log(`✓ ${categoryIds.size} kategori`);

  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDesc: p.shortDesc,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        isFeatured: !!p.featured,
        isDeal: !!p.deal,
        isNew: !!p.isNew,
        ratingAvg: p.rating,
        ratingCount: p.ratingCount,
        tags: p.tags,
        categoryId: categoryIds.get(p.categorySlug) ?? null,
        brandId: brand.id,
        images: {
          create: [
            { url: `/images/product-${p.img}.svg`, alt: p.name, sortOrder: 0, isPrimary: true },
            { url: `/images/product-${((p.img + 3) % 12) + 1}.svg`, alt: `${p.name} - 2`, sortOrder: 1 },
            { url: `/images/product-${((p.img + 5) % 12) + 1}.svg`, alt: `${p.name} - 3`, sortOrder: 2 },
            { url: `/images/product-${((p.img + 7) % 12) + 1}.svg`, alt: `${p.name} - 4`, sortOrder: 3 },
          ],
        },
        specs: {
          create: p.specs.map(([label, value], i) => ({ label, value, sortOrder: i })),
        },
      },
    });
  }
  console.log(`✓ ${seedProducts.length} ürün`);

  for (const b of demoBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        tags: b.tags,
        publishedAt: new Date(b.publishedAt),
      },
    });
  }
  console.log(`✓ ${demoBlogPosts.length} blog yazısı`);
}

async function seedOrders(adminId: string, customerId: string) {
  const products = await prisma.product.findMany({
    take: 8,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });
  if (products.length === 0) return;

  const statuses = [
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "PENDING",
    "CANCELLED",
    "DELIVERED",
    "SHIPPED",
    "PREPARING",
  ] as const;

  // İlk iki sipariş demo müşteriye bağlanır; böylece /hesabim ekranı dolu gelir.
  const shops = [
    { name: "Örnek Müşteri", email: "musteri@kotanjant.com", city: "İstanbul", phone: "0555 000 00 00", userId: customerId },
    { name: "Örnek Müşteri", email: "musteri@kotanjant.com", city: "İstanbul", phone: "0555 000 00 00", userId: customerId },
    { name: "Mehmet Kaya", email: "mehmet@ornek.com", city: "İzmir", phone: "0534 333 4455", userId: null },
    { name: "Zeynep Şahin", email: "zeynep@ornek.com", city: "Bursa", phone: "0535 444 5566", userId: null },
    { name: "Can Aydın", email: "can@ornek.com", city: "Antalya", phone: "0536 555 6677", userId: null },
    { name: "Fatma Çelik", email: "fatma@ornek.com", city: "Konya", phone: "0537 666 7788", userId: null },
    { name: "Burak Öztürk", email: "burak@ornek.com", city: "Eskişehir", phone: "0538 777 8899", userId: null },
    { name: "Selin Arslan", email: "selin@ornek.com", city: "Adana", phone: "0539 888 9900", userId: null },
  ];

  let created = 0;
  for (let i = 0; i < shops.length; i++) {
    const orderNumber = `KT-SEED-${1001 + i}`;
    const shop = shops[i];
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (existing) {
      // Mevcut seed siparişini müşteriye bağla (tekrar çalıştırılabilir olsun).
      await prisma.order.update({
        where: { orderNumber },
        data: { userId: shop.userId, customerEmail: shop.email, customerName: shop.name },
      });
      continue;
    }

    const picks = [products[i % products.length], products[(i + 3) % products.length]];
    const items = picks.map((p) => {
      const quantity = (i % 2) + 1;
      const unitPrice = Number(p.price);
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        imageUrl: p.images[0]?.url ?? null,
        unitPrice,
        quantity,
      };
    });
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const shipping = subtotal >= 1000 ? 0 : 79.9;
    const status = statuses[i];
    const createdAt = new Date(Date.now() - i * 30 * 3600 * 1000);

    await prisma.order.create({
      data: {
        orderNumber,
        status,
        userId: shop.userId,
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod: i % 3 === 0 ? "CREDIT_CARD" : "COD",
        paymentStatus: status === "DELIVERED" ? "PAID" : "PENDING",
        customerName: shop.name,
        customerEmail: shop.email,
        customerPhone: shop.phone,
        shippingAddress: `${shop.city} / Merkez, Örnek Mah. ${10 + i}. Sok. No:${i + 1}`,
        createdAt,
        items: { create: items },
        events: {
          create: [
            { type: "CREATED", status: "PENDING", createdById: adminId, createdAt },
            {
              type: "STATUS_CHANGED",
              status,
              note: "Seed verisi",
              createdById: adminId,
              createdAt: new Date(createdAt.getTime() + 3600_000),
            },
          ],
        },
      },
    });
    created++;
  }
  console.log(`✓ ${created} yeni örnek sipariş (mevcutlar müşteriye bağlandı)`);
}

async function seedHeroSlides() {
  const count = await prisma.heroSlide.count();
  if (count > 0) {
    console.log("• Hero (vitrin) slaytları zaten mevcut, atlandı");
    return;
  }
  await prisma.heroSlide.createMany({
    data: heroSlides.map((s, index) => ({
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      href: s.href,
      cta: s.cta,
      sortOrder: index,
      isActive: true,
    })),
  });
  console.log(`✓ ${heroSlides.length} hero (vitrin) slaytı`);
}

async function main() {
  console.log("→ Seed başlıyor...");
  const { admin, customer } = await seedUsers();
  await seedCatalog();
  await seedHeroSlides();
  await seedOrders(admin.id, customer.id);
  console.log("✔ Seed tamamlandı.");
}

main()
  .catch((error) => {
    console.error("✖ Seed hatası:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
