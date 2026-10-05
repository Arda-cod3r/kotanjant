# Kotanjant — Mimari

Jant kapağı ve oto aksesuar satışı için kurumsal, responsive ve yüksek performanslı
e-ticaret platformu. Tek bir **Next.js** uygulamasında (full-stack monolit) toplanmıştır:
storefront, ürün detay, sepet/ödeme ve rol tabanlı yönetim paneli aynı kod tabanında yer alır.

## 1. Teknoloji Yığını

| Katman | Teknoloji | Rol |
| --- | --- | --- |
| Framework | **Next.js 16 (App Router)** | Sunucu bileşenleri (RSC), Route Handlers, Server Actions |
| Dil | **TypeScript 5.9** | Uçtan uca tip güvenliği |
| UI | **React 19** + **Tailwind CSS v4** | Responsive kurumsal arayüz (`@theme` tasarım tokenları) |
| Veritabanı | **PostgreSQL 18** | İlişkisel veri, envanter, sipariş |
| ORM | **Prisma 7** (`prisma-client` generator + `@prisma/adapter-pg`) | Tip güvenli veri erişimi, migration |
| Kimlik | **jose** (JWT, httpOnly cookie) + **bcryptjs** | Oturum imzalama, şifre hash'leme |
| Client state | **zustand** (+ `persist`) | Sepet ve favori listesi (localStorage) |
| Doğrulama | **zod** | Form/API girdi doğrulama |
| İkonlar | **lucide-react** | Tutarlı ikon seti |

### Neden Next.js (monolit)?
- Ürün detay ve vitrin sayfaları **sunucuda render** edilir → SEO ve ilk yükleme hızı.
- Sepet/favori gibi kişisel durumlar **client store**'da tutulur → anında etkileşim.
- Server Actions ile form gönderimi ayrı bir API katmanı yazmadan güvenli şekilde yapılır.
- Tek dilim (language/runtime) → daha basit dağıtım ve bakım.

## 2. Klasör Yapısı

```
src/
├── app/
│   ├── layout.tsx                 # Kök layout (html/body + metadata)
│   ├── globals.css                # Tailwind v4 + tasarım tokenları
│   ├── (storefront)/              # Mağaza route grubu (Header + Footer layout)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Ana sayfa: Hero, Vitrin tab'ları, Blog, Trust bar
│   │   ├── urun/[slug]/page.tsx   # PDP (galeri + zoom + teknik özellikler)
│   │   ├── urunler/page.tsx       # Ürün listeleme + filtre/sıralama
│   │   ├── kategori/[slug]/page.tsx
│   │   ├── arama/page.tsx
│   │   ├── sepet/page.tsx
│   │   ├── odeme/page.tsx         # Checkout (server action ile sipariş)
│   │   ├── siparis/[orderNumber]/page.tsx  # Sipariş onayı
│   │   ├── favoriler/page.tsx
│   │   ├── blog/…                 # Blog liste + detay
│   │   └── giris/page.tsx         # Ortak giriş (müşteri + yönetici)
│   ├── admin/                     # Yönetim paneli (ayrı layout, rol korumalı)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Dashboard + analitik
│   │   ├── urunler/…              # Liste / yeni / düzenle
│   │   └── siparisler/…           # Liste / detay + süreç takibi
│   └── api/
│       ├── products/search/route.ts  # Header canlı arama
│       ├── upload/route.ts           # Çoklu görsel yükleme
│       └── newsletter/route.ts
├── components/
│   ├── storefront/                # Header, Footer, HeroSlider, ProductTabs, ProductCard…
│   ├── product/                   # ProductGallery (zoom), ProductActions, StockStatus
│   └── admin/                     # AdminSidebar, ProductForm, ImageUploader, SpecEditor…
├── lib/
│   ├── prisma.ts                  # PrismaClient singleton + driver adapter
│   ├── auth.ts                    # Oturum imzalama/çözme, rol kontrolü
│   ├── types.ts                   # DTO'lar ve paylaşılan tipler
│   ├── utils.ts                   # formatPrice, slugify, generateOrderNumber…
│   ├── demo-data.ts               # Seed + DB erişilemezken fallback verisi
│   └── store/                     # zustand sepet & favori store'ları
├── server/
│   ├── catalog.ts                 # Ürün/kategori/blog sorguları (DTO dönüşümü)
│   ├── orders.ts                  # Sipariş sorguları + dashboard istatistikleri
│   └── actions/                   # Server Actions (auth, products, orders, checkout)
└── generated/prisma/              # `prisma generate` çıktısı (Prisma Client)
```

## 3. Katmanlı Mimari

```
UI (RSC + Client Components)
        │  server action / fetch
        ▼
Server Actions & Route Handlers        (src/server/actions, src/app/api)
        │  zod doğrulama + yetki kontrolü (requireAdmin)
        ▼
Veri Erişim Katmanı                    (src/server/catalog.ts, orders.ts)
        │  Prisma → DTO dönüşümü (Decimal → number)
        ▼
Prisma Client + pg adapter → PostgreSQL
```

**Önemli kural:** Prisma'nın `Decimal`/`Date` gibi tipleri asla doğrudan Client
Component'lere geçirilmez. `catalog.ts` / `orders.ts` içindeki `toProductDTO` ve
`toOrderDTO` fonksiyonları bunları düz JS tiplerine (`number`, ISO `string`) çevirir.

## 4. Veri Modeli (Prisma)

```
User ──1:N──> Order ──1:N──> OrderItem ──N:1──> Product
  │              │                                 │
  │              ├──1:N──> OrderEvent (süreç takibi)│
  │              └──1:N──> InventoryLog            │
  ├──1:N──> Address                                │
  ├──1:N──> WishlistItem ──────────────────────────┤
  └──1:N──> Review ────────────────────────────────┤
                                                   │
Category ──1:N──> Product ──1:N──> ProductImage ───┤
                          └─1:N──> ProductSpec     │
Brand    ──1:N──> Product ─────────────────────────┘

BlogPost (bağımsız içerik)
```

| Model | Amaç | Öne çıkan alanlar |
| --- | --- | --- |
| `User` | Müşteri ve yönetici hesapları | `role` (CUSTOMER/ADMIN/SUPERADMIN), `passwordHash` |
| `Category` | Ağaç yapılı kategoriler | `parentId` (self-relation), `slug` |
| `Brand` | Marka | `slug` |
| `Product` | Ürün | `price`, `comparePrice`, `stock`, `isFeatured/isDeal/isNew`, `tags` |
| `ProductImage` | Çoklu görsel + sıralama | `sortOrder`, `isPrimary` |
| `ProductSpec` | Teknik özellikler | `label`, `value`, `sortOrder` |
| `Order` | Sipariş başlığı | `orderNumber`, `status`, `subtotal/shipping/total`, müşteri snapshot'ı |
| `OrderItem` | Sipariş kalemi (snapshot) | `name`, `sku`, `unitPrice`, `quantity` |
| `OrderEvent` | Süreç zaman tüneli | `status`, `note`, `createdById` |
| `InventoryLog` | Stok hareketleri | `change`, `reason` |
| `WishlistItem` | Favoriler | `@@unique([userId, productId])` |
| `Review` | Ürün yorumları | `rating`, `isApproved` |
| `BlogPost` | Blog içeriği | `slug`, `publishedAt` |

**Tasarım kararları**
- `OrderItem`, ürün silinse bile faturayı koruyan **snapshot** alanları tutar (`onDelete: SetNull`).
- `Product.comparePrice` indirim gösterimini (% ve üstü çizili fiyat) besler.
- `isFeatured / isDeal / isNew` bayrakları ana sayfadaki **Vitrin tab'larını** doğrudan besler.
- Sipariş durumu `PENDING → PREPARING → SHIPPED → DELIVERED` akışını izler; `CANCELLED/REFUNDED` ayrıca tutulur.

## 5. Kimlik Doğrulama & Rol Modeli

**Kayıt ve giriş**
- Müşteriler `/kayit` sayfasından **Server Action** (`registerAction`) ile hesap oluşturur:
  `zod` doğrulaması → e-posta tekilliği kontrolü → `bcryptjs` ile hash → kayıt → otomatik giriş.
- `/giris` sayfası **tüm roller için ortak** giriştir (`loginAction`).
- Şifre doğrulanınca **jose** ile HS256 JWT üretilir ve `kotanjant_session` adlı
  **httpOnly + sameSite=lax** cookie olarak yazılır.
- Giriş sonrası rol bazlı yönlendirme: `CUSTOMER → /hesabim`, `ADMIN/SUPERADMIN → /admin`.
- Güvenlik notu: kullanıcı yok / pasif / şifre yanlış durumları tek bir "E-posta veya şifre hatalı."
  mesajıyla döner (hesap varlığını sızdırmaz).

**Yetki**
- `getSessionUser()` cookie'yi çözer; geçersizse `null` döner.
- `/admin` layout'u her istekte rol kontrolü yapar: `ADMIN` veya `SUPERADMIN` değilse `/giris`'e
  yönlendirir (**defense in depth**: her server action ayrıca `requireAdmin()` çağırır).
- `/hesabim` layout'u oturum yoksa `/giris`'e yönlendirir; sipariş detayında **sahiplik kontrolü**
  yapılır (`getCustomerOrder` yalnızca kullanıcının kendi siparişini döner, aksi halde 404).
- `SUPERADMIN`, panelde ek yetkiler için ayrılmıştır.

## 6. Storefront Akışları

| Akış | Akıllı nokta |
| --- | --- |
| **Canlı arama** | `SearchBar` 250ms debounce ile `/api/products/search` çağırır, dropdown'da öneri gösterir |
| **Hero slider** | Otomatik geçiş (5.5s), ok/nokta navigasyonu, **dokunmatik swipe**, hover'da durur |
| **Vitrin tab'ları** | Öne Çıkan / Fırsat / Yeni listeleri tek bileşende client tab ile |
| **Sepet & favori** | zustand + `persist`; header sayaçları hydration uyuşmazlığını önlemek için mount sonrası gösterilir |
| **PDP zoom** | Fare hareketi yüzdeye çevrilir, `background-size: 220%` ile magnifier katmanı üretilir; dokunmatikte merkez zoom |
| **Checkout** | Server action sepeti doğrular, **koşullu stok düşümü** (`updateMany` `where stock >= qty`) ile overselling'i engeller |

## 7. Yönetim Paneli Akışları

- **Dashboard**: 30 günlük ciro, ortalama sipariş, durum dağılımı, son 7 gün satış grafiği,
  kritik stok listesi (`stock <= 5`), son siparişler.
- **Ürün yönetimi**: liste (arama/sıralama altyapısı), ekleme, düzenleme, silme;
  **çoklu görsel yükleme + sıralama + ana görsel seçimi**, teknik özellik editörü,
  stok/kritik seviye, vitrin bayrakları, yayın durumu.
- **Görsel yükleme**: `POST /api/upload` (yalnız yönetici), `public/uploads` altına yazar,
  8MB ve tür doğrulaması yapar. (Üretimde S3/Cloudflare R2 gibi bir nesne deposuna taşınmalıdır.)
- **Sipariş yönetimi**: durum filtresi, detay, **süreç takibi zaman tüneli**, durum güncelleme
  ve not/kargo takip no ekleme. `DELIVERED` olduğunda ödeme durumu otomatik `PAID` olur.

## 8. Performans, SEO ve Güvenlik

**Performans**
- RSC ile sunucuda render + `next/image` ile otomatik görsel optimizasyonu ve `sizes`.
- Vitrin/liste sayfaları `dynamic = "force-dynamic"` (yönetimden güncellenir), ürün sayfaları
  istek anında tazelenir; statik varlıklar build'de üretilir.
- Zustand selector'ları ile minimum re-render.

**SEO**
- Dinamik `generateMetadata` (başlık, açıklama, OG görseli) PDP ve blog detayında.
- Anlamsal HTML (`article`, `nav`, `time`, `aria-*`), breadcrumb, `lang="tr"`.

**Güvenlik**
- Girdi doğrulama: tüm server action'lar `zod` ile doğrulanır.
- Yetki: `requireAdmin()` + layout seviyesinde rol kontrolü.
- Şifreler bcrypt ile hash'lenir; oturum httpOnly cookie'de; gizli anahtar `.env`'de.
- Yüklenen dosyalar tür ve boyut açısından doğrulanır.

## 9. Komutlar

```bash
npm run dev            # Geliştirme (http://localhost:3000)
npm run build          # prisma generate + next build
npm start              # Üretim sunucusu
npm run typecheck      # Tip kontrolü
npm run db:migrate     # prisma migrate dev
npm run db:seed        # Örnek veri
npm run db:studio      # Prisma Studio
```

Detaylı kurulum için bkz. [README](../README.md).
