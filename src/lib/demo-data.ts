// Demo/seed verisi. Hem `prisma/seed.ts` hem de veritabanı erişilemezken
// storefront'un çalışmaya devam etmesi için "fallback" olarak kullanılır.
import type { BlogPostDTO, CategoryDTO, ProductDTO } from "./types";

export const demoCategories: CategoryDTO[] = [
  { id: "cat-jant-13", name: '13" Jant Kapakları', slug: "13-inc-jant-kapaklari", description: "Kompakt araçlar için 13 inç kapaklar", imageUrl: "/images/product-11.svg", isActive: true, productCount: 42 },
  { id: "cat-jant-14", name: '14" Jant Kapakları', slug: "14-inc-jant-kapaklari", description: "En çok tercih edilen ölçü", imageUrl: "/images/product-3.svg", isActive: true, productCount: 88 },
  { id: "cat-jant-15", name: '15" Jant Kapakları', slug: "15-inc-jant-kapaklari", description: "Sedan ve hatchback uyumlu", imageUrl: "/images/product-1.svg", isActive: true, productCount: 120 },
  { id: "cat-jant-16", name: '16" ve Üzeri Kapaklar', slug: "16-inc-ve-uzeri-kapaklar", description: "SUV ve ticari araçlar", imageUrl: "/images/product-2.svg", isActive: true, productCount: 64 },
  { id: "cat-aksesuar", name: "Oto Aksesuarları", slug: "oto-aksesuarlari", description: "Silecek, paspas, koruma ürünleri", imageUrl: "/images/product-7.svg", isActive: true, productCount: 156 },
  { id: "cat-bakim", name: "Bakım & Temizlik", slug: "bakim-temizlik", description: "Jant ve kaporta bakım ürünleri", imageUrl: "/images/product-8.svg", isActive: true, productCount: 73 },
];

export interface SeedProduct {
  name: string;
  slug: string;
  sku: string;
  shortDesc: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  categorySlug: string;
  brand: string;
  tags: string[];
  img: number; // /images/product-<img>.svg
  featured?: boolean;
  deal?: boolean;
  isNew?: boolean;
  rating: number;
  ratingCount: number;
  specs: [string, string][];
}

export const seedProducts: SeedProduct[] = [
  {
    name: 'Krom Jant Kapağı 15"', slug: "krom-jant-kapagi-15", sku: "KT-JK-1501",
    shortDesc: "4'lü set, çelik klipsli, paslanmaz yüzey.",
    description: "Yüksek parlaklıkta krom kaplama ile aracınıza premium bir görünüm kazandırır. Çelik klips mekanizması sayesinde yolda çıkmaz, kolayca takılır.",
    price: 1499.9, comparePrice: 1999.9, stock: 42, categorySlug: "15-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["krom", "15 inç", "4 lü set"], img: 1, featured: true, deal: true,
    rating: 4.7, ratingCount: 128,
    specs: [["Jant Çapı", "15 inç"], ["Malzeme", "ABS + Krom Kaplama"], ["Set İçeriği", "4 Adet"], ["Montaj", "Çelik Klips"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Sportif Jant Kapağı 16"', slug: "sportif-jant-kapagi-16", sku: "KT-JK-1602",
    shortDesc: "Parçalı sportif tasarım, mat yüzey aksanlar.",
    description: "Sportif çok kollu görünümü ile aracınıza dinamik bir karakter katar. Darbeye dayanıklı ABS gövde.",
    price: 1789.0, comparePrice: 2199.0, stock: 18, categorySlug: "16-inc-ve-uzeri-kapaklar", brand: "Kotanjant",
    tags: ["sportif", "16 inç"], img: 2, featured: true, isNew: true,
    rating: 4.5, ratingCount: 74,
    specs: [["Jant Çapı", "16 inç"], ["Malzeme", "ABS"], ["Set İçeriği", "4 Adet"], ["Renk", "Antrasit/Mat Siyah"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Mat Siyah Jant Kapağı 14"', slug: "mat-siyah-jant-kapagi-14", sku: "KT-JK-1403",
    shortDesc: "Mat siyah, darbe dayanımlı ABS gövde.",
    description: "Klasik ve şık mat siyah yüzey. UV dayanımlı boya ile solmaya karşı korumalı.",
    price: 999.9, comparePrice: 1299.9, stock: 65, categorySlug: "14-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["mat siyah", "14 inç"], img: 3, deal: true,
    rating: 4.4, ratingCount: 96,
    specs: [["Jant Çapı", "14 inç"], ["Malzeme", "ABS"], ["Set İçeriği", "4 Adet"], ["Kaplama", "UV Korumalı"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Karbon Desen Jant Kapağı 17"', slug: "karbon-desen-jant-kapagi-17", sku: "KT-JK-1704",
    shortDesc: "Gerçek karbon görünümlü doku, UV korumalı.",
    description: "Gerçekçi karbon fiber dokusu ile sportif bir görünüm. Geniş ölçülerde araçlar için idealdir.",
    price: 2299.0, comparePrice: 2799.0, stock: 9, categorySlug: "16-inc-ve-uzeri-kapaklar", brand: "Kotanjant",
    tags: ["karbon", "17 inç"], img: 4, featured: true, isNew: true,
    rating: 4.8, ratingCount: 51,
    specs: [["Jant Çapı", "17 inç"], ["Malzeme", "ABS + Karbon Desen"], ["Set İçeriği", "4 Adet"], ["Yüzey", "Parlak"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Orijinal Tip Jant Kapağı 13"', slug: "orijinal-tip-jant-kapagi-13", sku: "KT-JK-1305",
    shortDesc: "Kolay montaj, orijinal donanım görünümü.",
    description: "Fabrika çıkışı görünümünü korur. Ekonomik ve pratik bir seçimdir.",
    price: 749.9, stock: 110, categorySlug: "13-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["13 inç", "ekonomik"], img: 5, deal: true,
    rating: 4.2, ratingCount: 143,
    specs: [["Jant Çapı", "13 inç"], ["Malzeme", "ABS"], ["Set İçeriği", "4 Adet"], ["Montaj", "Klipsli"], ["Garanti", "12 Ay"]],
  },
  {
    name: 'Parlak Gümüş Jant Kapağı 15"', slug: "parlak-gumus-jant-kapagi-15", sku: "KT-JK-1506",
    shortDesc: "Paslanmaz klipsli, parlak gümüş yüzey.",
    description: "Parlak gümüş kaplama ve paslanmaz klipsler ile uzun ömürlü kullanım.",
    price: 1399.0, comparePrice: 1699.0, stock: 33, categorySlug: "15-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["gümüş", "15 inç"], img: 6, featured: true,
    rating: 4.6, ratingCount: 87,
    specs: [["Jant Çapı", "15 inç"], ["Malzeme", "ABS + Metalik Kaplama"], ["Set İçeriği", "4 Adet"], ["Klips", "Paslanmaz Çelik"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Off-Road Jant Kapağı 16"', slug: "off-road-jant-kapagi-16", sku: "KT-JK-1607",
    shortDesc: "SUV ve hafif ticari araçlar için dayanıklı.",
    description: "Zorlu yol koşullarına dayanıklı, kalın gövde yapısı. SUV ve ticari araçlar için idealdir.",
    price: 1899.0, stock: 21, categorySlug: "16-inc-ve-uzeri-kapaklar", brand: "Kotanjant",
    tags: ["off-road", "SUV", "16 inç"], img: 7, isNew: true,
    rating: 4.5, ratingCount: 39,
    specs: [["Jant Çapı", "16 inç"], ["Malzeme", "Güçlendirilmiş ABS"], ["Set İçeriği", "4 Adet"], ["Kullanım", "SUV / Ticari"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Kışlık Dayanıklı Kapak 14"', slug: "kislik-dayanikli-kapak-14", sku: "KT-JK-1408",
    shortDesc: "Soğuk havaya ve tuza dirençli özel formül.",
    description: "Kış koşullarında çatlamaya karşı dirençli, tuz ve neme dayanıklı özel karışım.",
    price: 1099.0, comparePrice: 1399.0, stock: 54, categorySlug: "14-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["kışlık", "14 inç"], img: 8, deal: true,
    rating: 4.3, ratingCount: 62,
    specs: [["Jant Çapı", "14 inç"], ["Malzeme", "Soğuğa Dirençli PP"], ["Set İçeriği", "4 Adet"], ["Sıcaklık", "-40°C / +80°C"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Ayna Kaplamalı Kapak 17"', slug: "ayna-kaplamali-kapak-17", sku: "KT-JK-1709",
    shortDesc: "Ayna parlaklığında premium kaplama.",
    description: "Ayna benzeri yansıtıcı yüzey ile araçta fark yaratan premium görünüm.",
    price: 2499.0, comparePrice: 2999.0, stock: 6, categorySlug: "16-inc-ve-uzeri-kapaklar", brand: "Kotanjant",
    tags: ["ayna", "premium", "17 inç"], img: 9, featured: true, isNew: true,
    rating: 4.9, ratingCount: 28,
    specs: [["Jant Çapı", "17 inç"], ["Malzeme", "ABS + Ayna Kaplama"], ["Set İçeriği", "4 Adet"], ["Yüzey", "Yansıtıcı"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Klasik Krom Kapak 15"', slug: "klasik-krom-kapak-15", sku: "KT-JK-1510",
    shortDesc: "Retro seri, klasik krom tasarım.",
    description: "Klasik araçlara uygun retro krom tasarım. Zamansız bir stildir.",
    price: 1599.0, stock: 27, categorySlug: "15-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["retro", "krom", "15 inç"], img: 10,
    rating: 4.4, ratingCount: 44,
    specs: [["Jant Çapı", "15 inç"], ["Malzeme", "ABS + Krom"], ["Set İçeriği", "4 Adet"], ["Stil", "Retro"], ["Garanti", "24 Ay"]],
  },
  {
    name: 'Kompakt Kapak 13"', slug: "kompakt-kapak-13", sku: "KT-JK-1311",
    shortDesc: "Şehir içi kullanım için hafif ve pratik.",
    description: "Hafif yapısı ile yakıt verimliliğine katkı sağlar. Şehir içi kullanım için idealdir.",
    price: 699.9, comparePrice: 899.9, stock: 140, categorySlug: "13-inc-jant-kapaklari", brand: "Kotanjant",
    tags: ["13 inç", "hafif"], img: 11, deal: true,
    rating: 4.1, ratingCount: 118,
    specs: [["Jant Çapı", "13 inç"], ["Malzeme", "Hafif ABS"], ["Set İçeriği", "4 Adet"], ["Ağırlık", "180 g/adet"], ["Garanti", "12 Ay"]],
  },
  {
    name: 'Performans Kapak 18"', slug: "performans-kapak-18", sku: "KT-JK-1812",
    shortDesc: "Düşük rüzgar direnci, aerodinamik tasarım.",
    description: "Aerodinamik formu ile rüzgar direncini azaltır. Performans odaklı araçlar için tasarlandı.",
    price: 2899.0, comparePrice: 3499.0, stock: 4, categorySlug: "16-inc-ve-uzeri-kapaklar", brand: "Kotanjant",
    tags: ["performans", "18 inç", "aerodinamik"], img: 12, featured: true, isNew: true,
    rating: 4.8, ratingCount: 22,
    specs: [["Jant Çapı", "18 inç"], ["Malzeme", "Kompozit ABS"], ["Set İçeriği", "4 Adet"], ["Tasarım", "Aerodinamik"], ["Garanti", "24 Ay"]],
  },
];

export const demoBlogPosts: BlogPostDTO[] = [
  {
    id: "blog-1", title: "Doğru Jant Kapağı Nasıl Seçilir?", slug: "dogru-jant-kapagi-nasil-secilir",
    excerpt: "Aracınızın jant ölçüsünü nasıl öğrenirsiniz ve hangi kapak tipi size uygun? Adım adım rehber.",
    content: "Jant kapağı seçiminde ilk adım doğru ölçüyü belirlemektir. Lastik yan duvarında yer alan ifadenin (ör. 195/65 R15) son haneleri jant çapını verir. Doğru ölçü seçildiğinde kapak tam oturur ve yolda çıkmaz.",
    coverImage: "/images/blog-1.svg", authorName: "Kotanjant Editör", tags: ["rehber", "ölçü"], isPublished: true,
    publishedAt: "2026-09-28T09:00:00.000Z",
  },
  {
    id: "blog-2", title: "Jant Kapağı Bakımı ve Temizliği", slug: "jant-kapagi-bakimi-ve-temizligi",
    excerpt: "Jant kapaklarınızın ilk günkü parlaklığını koruması için 5 pratik ipucu.",
    content: "Düzenli bakım ile jant kapaklarınız uzun yıllar yeni gibi kalır. Asitli olmayan temizleyiciler tercih edin ve basınçlı suyu doğrudan klipslere tutmayın.",
    coverImage: "/images/blog-2.svg", authorName: "Kotanjant Editör", tags: ["bakım", "temizlik"], isPublished: true,
    publishedAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "blog-3", title: "Kış Öncesi Jant Kontrolü", slug: "kis-oncesi-jant-kontrolu",
    excerpt: "Kış lastiği dönemine girmeden önce yapmanız gereken kontroller ve öneriler.",
    content: "Kış koşulları jant ve kapaklar üzerinde yıpratıcı etki yapar. Tuz ve nem kaynaklı paslanmayı önlemek için koruyucu uygulama yapılmalıdır.",
    coverImage: "/images/blog-3.svg", authorName: "Kotanjant Editör", tags: ["kış", "bakım"], isPublished: true,
    publishedAt: "2026-09-02T09:00:00.000Z",
  },
];

export const heroSlides = [
  { image: "/images/hero-1.svg", title: "Yeni Sezon Jant Kapakları", subtitle: "Aracınıza değer katan premium kapaklar", href: "/kategori/15-inc-jant-kapaklari", cta: "Koleksiyonu Keşfet" },
  { image: "/images/hero-2.svg", title: "Fırsat Ürünlerinde %40 İndirim", subtitle: "Seçili jant kapakları ve aksesuarlarda", href: "/kategori/14-inc-jant-kapaklari", cta: "Fırsatları Gör" },
  { image: "/images/hero-3.svg", title: "Kışa Hazır Aksesuar Seti", subtitle: "Silecek, paspas ve jant koruma ürünleri", href: "/kategori/oto-aksesuarlari", cta: "Setleri İncele" },
];

/**
 * `seedProducts` verisini storefront'un beklediği `ProductDTO` biçimine çevirir.
 * Veritabanı erişilemediğinde sayfalar bu listeyle sorunsuz render edilir.
 */
export const demoProducts: ProductDTO[] = seedProducts.map((p, index) => {
  const category = demoCategories.find((c) => c.slug === p.categorySlug) ?? null;
  const created = new Date(Date.now() - index * 86400000).toISOString();
  return {
    id: `demo-${index + 1}`,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    shortDesc: p.shortDesc,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice ?? null,
    currency: "TRY",
    stock: p.stock,
    lowStockAlert: 5,
    isFeatured: !!p.featured,
    isDeal: !!p.deal,
    isNew: !!p.isNew,
    isActive: true,
    ratingAvg: p.rating,
    ratingCount: p.ratingCount,
    categoryId: category?.id ?? null,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    brandId: "brand-kotanjant",
    brandName: p.brand,
    tags: p.tags,
    images: [
      { id: `demo-${index + 1}-img-1`, url: `/images/product-${p.img}.svg`, alt: p.name, sortOrder: 0, isPrimary: true },
      { id: `demo-${index + 1}-img-2`, url: `/images/product-${((p.img + 3) % 12) + 1}.svg`, alt: `${p.name} - görünüm 2`, sortOrder: 1, isPrimary: false },
      { id: `demo-${index + 1}-img-3`, url: `/images/product-${((p.img + 5) % 12) + 1}.svg`, alt: `${p.name} - görünüm 3`, sortOrder: 2, isPrimary: false },
      { id: `demo-${index + 1}-img-4`, url: `/images/product-${((p.img + 7) % 12) + 1}.svg`, alt: `${p.name} - görünüm 4`, sortOrder: 3, isPrimary: false },
    ],
    specs: p.specs.map(([label, value], i) => ({
      id: `demo-${index + 1}-spec-${i}`,
      label,
      value,
      sortOrder: i,
    })),
    createdAt: created,
    updatedAt: created,
  };
});
