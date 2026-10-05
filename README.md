# Kotanjant — Jant Kapağı & Oto Aksesuar E-Ticaret Platformu

Kurumsal, responsive ve yüksek performanslı e-ticaret platformu. Jant kapağı ve oto
aksesuar satışı için **storefront + ürün detay (PDP) + rol tabanlı yönetim paneli**
tek bir Next.js uygulamasında toplanmıştır.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Veritabanı:** PostgreSQL + Prisma ORM 7 (`@prisma/adapter-pg`)
- **Kimlik:** jose (JWT, httpOnly cookie) + bcryptjs · **State:** zustand

> Mimari detayları ve diyagramlar için: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Özellikler

### Üyelik & Hesap
- **Kayıt ol** (`/kayit`) ve **giriş yap** (`/giris`) — müşteri hesapları self-servis oluşturulur
- Rol bazlı yönlendirme: müşteri → `/hesabim`, yönetici → `/admin`
- **Hesap alanı** (`/hesabim`): sipariş özeti, istatistikler, hesap bilgileri
- **Siparişlerim** (`/hesabim/siparisler`): sipariş listesi + **durum takibi adımları** ve detay sayfası
- Siparişler hem üyelik (`userId`) hem de e-posta ile eşleşir; misafirken verilen siparişler de hesapta görünür

### Mağaza (Storefront)
- **Header:** kurumsal logo, dinamik arama çubuğu (canlı öneri), Hesabım / Favorilerim / Sepetim sayaçları
- **Hero Slider:** 3 büyük görsel, otomatik geçiş, ok/nokta navigasyonu, dokunmatik kaydırma
- **Vitrin:** Öne Çıkan Ürünler / Fırsat Ürünleri / Yeni Ürünler **tab** alanları
- **Kategoriler, ürün listeleme + filtre/sıralama, arama sonuçları**
- **Blog:** grid formatında blog yazıları + detay sayfası
- **Güven/Avantaj Barı:** Güvenli Alışveriş, Kolay İade & Değişim, Ödeme Seçenekleri, Hızlı Teslimat
- **Footer:** kurumsal linkler, iletişim, bülten aboneliği, yasal uyarılar
- **Sepet → Ödeme → Sipariş onayı** akışı (stok kontrolü ve koşullu stok düşümü ile)

### Ürün Detay (PDP)
- Çoklu görsel + **thumbnail galerisi**
- Ana görsel üzerinde **hover ile görsel yakınlaştırma (image magnifier)**; dokunmatikte merkez zoom
- Başlık, fiyat/indirim, **stok durumu göstergesi**, teknik özellikler tablosu
- **Favorilere Ekle · Sepete Ekle (adetli) · Paylaş** aksiyonları, benzer ürünler

### Yönetim Paneli (`/admin`)
- **Rol tabanlı yetkilendirme** (ADMIN / SUPERADMIN), oturum korumalı
- **Dashboard & Analitik:** 30 günlük ciro, ortalama sipariş, durum dağılımı, son 7 gün satış grafiği, kritik stok uyarısı
- **Ürün Yönetimi:** listeleme, ekleme, düzenleme, silme; **çoklu görsel yükleme/sıralama/ana görsel**, teknik özellik editörü, stok kontrolü, vitrin bayrakları
- **Vitrin (Hero) Slider:** ana sayfadaki tanıtım görsellerini yükleme/değiştirme; üzerindeki başlık, alt başlık, buton metni ve bağlantısı; sıralama ve yayın durumu
- **Sipariş & Finans:** süreç takibi (Hazırlanıyor → Kargoda → Teslim Edildi), durum filtresi, zaman tüneli, not/kargo takip no

---

## Gereksinimler

| Araç | Sürüm | Neden |
| --- | --- | --- |
| Node.js + npm | 22 LTS veya üzeri (24 önerilir) | Next.js/Prisma çalıştırma ve paket kurulumu |
| Docker + Docker Compose | Güncel | PostgreSQL'i izole konteynerde çalıştırmak |
| Git | Güncel | Sürüm kontrolü |

```bash
node -v && npm -v && docker -v && docker compose version
```

---

## Kurulum

### 1) Bağımlılıkları kur
```bash
npm install
```

### 2) Ortam değişkenlerini hazırla
```bash
cp .env.example .env
```
`.env` içeriği:

| Değişken | Varsayılan | Açıklama |
| --- | --- | --- |
| `DATABASE_URL` | `…@localhost:5432/kotanjant` | PostgreSQL bağlantısı |
| `AUTH_SECRET` | dev değeri | Oturum imzalama anahtarı (**üretimde değiştirin** – `openssl rand -base64 32`) |
| `AUTH_SESSION_TTL` | `604800` | Oturum süresi (saniye, 7 gün) |
| `NEXT_PUBLIC_SITE_NAME` | `Kotanjant Jant & Aksesuar` | Site adı (meta) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Site kök adresi |
| `SEED_ADMIN_EMAIL/PASSWORD/NAME` | süperadmin | Seed ile oluşturulacak ilk yönetici |

### 3) Veritabanını başlat
```bash
docker compose up -d --wait
```
> **Port çakışması:** Makinenizde 5432 doluysa boş bir port seçip hem compose'u hem `.env`'i güncelleyin:
> ```bash
> POSTGRES_PORT=5434 docker compose up -d --wait
> # .env → DATABASE_URL="postgresql://postgres:postgres@localhost:5434/kotanjant?schema=public"
> ```

### 4) Şemayı uygula ve örnek veriyi yükle
```bash
npm run db:migrate -- --name init   # tabloları oluşturur + migration üretir
npm run db:generate                 # Prisma Client'ı üretir
npm run db:seed                     # admin, kategori, ürün, blog ve örnek siparişler
```

### 5) Geliştirme sunucusunu başlat
```bash
npm run dev
```
Arayüz: http://localhost:3000 · Yönetim: http://localhost:3000/admin

---

## Demo Hesaplar (seed ile oluşturulur)

| Rol | E-posta | Şifre | Giriş sonrası |
| --- | --- | --- | --- |
| **Müşteri** | `musteri@kotanjant.com` | `Musteri!234` | `/hesabim` |
| Admin | `admin@kotanjant.com` | `Admin!2345` | `/admin` |
| Süperadmin | `superadmin@kotanjant.com` | `SuperAdmin!234` | `/admin` |

> **Neden 2 yönetici hesabı var?** İstenen "rol tabanlı yetkilendirme (Admin/Superadmin)"
> gereksinimini göstermek için: `ADMIN` mağaza yönetimi yapar, `SUPERADMIN` ek yetkiler için
> ayrılmıştır. Bunlar **seed ile gelen hazır hesaplardır**, sistem yalnızca bunlarla sınırlı değil —
> müşteriler `/kayit` üzerinden **kendi hesaplarını oluşturabilir**.
>
> Giriş sayfasındaki **"Hızlı giriş"** butonlarıyla üç demo hesaba tek tıkla giriş yapabilirsiniz.
> Not: Veritabanı erişilemezse storefront **demo veriyle** çalışmaya devam eder
> (bkz. `src/lib/demo-data.ts`), fakat giriş/kayıt ve panel işlemleri veritabanı gerektirir.

---

## Sık Kullanılan Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (http://localhost:3000) |
| `npm run build` | `prisma generate` + üretim derlemesi |
| `npm start` | Derlenmiş uygulamayı çalıştırır |
| `npm run typecheck` | Tip kontrolü (`tsc --noEmit`) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Örnek veriyi ekler/günceller |
| `npm run db:studio` | Prisma Studio arayüzü |


---

## Sayfa Haritası

| Yol | Açıklama |
| --- | --- |
| `/` | Ana sayfa (Hero, kategori şeridi, Vitrin tab'ları, Blog, Güven barı) |
| `/urunler` | Tüm ürünler + kategori filtresi + sıralama |
| `/kategori/[slug]` | Kategori bazlı listeleme |
| `/arama?q=` | Arama sonuçları |
| `/urun/[slug]` | Ürün detay (galeri + zoom + teknik özellikler) |
| `/sepet` · `/odeme` · `/siparis/[no]` | Sepet, ödeme ve sipariş onayı |
| `/favoriler` | Favori listesi |
| `/blog` · `/blog/[slug]` | Blog liste ve detay |
| `/kayit` | Müşteri kaydı (yeni hesap) |
| `/giris` | Ortak giriş (müşteri + yönetici) |
| `/hesabim` · `/hesabim/siparisler` · `/hesabim/siparisler/[id]` | Müşteri hesabı, sipariş listesi ve takip |
| `/hesabim/adreslerim` · `/hesabim/bilgilerim` · `/hesabim/odemelerim` · `/hesabim/favoriler` · `/hesabim/iletisim-tercihleri` | Hesap alt sayfaları |
| `/admin` · `/admin/urunler` · `/admin/siparisler` | Yönetim paneli |
| `/admin/kategoriler` · `/admin/slider` · `/admin/blog` | Kategori, vitrin slider ve blog yönetimi |
| `/hakkimizda` · `/iletisim` · `/sss` · `/kargo-takip` · `/jant-olcu-rehberi` | Kurumsal & yardım sayfaları |
| `/kvkk` · `/gizlilik` · `/cerez-politikasi` · `/garanti-ve-iade` | Yasal sayfalar |

---

## Proje Yapısı (özet)

```
src/
├── app/
│   ├── (storefront)/        # Mağaza sayfaları (Header + Footer layout)
│   ├── admin/               # Yönetim paneli (rol korumalı ayrı layout)
│   └── api/                 # search, upload, newsletter route handler'ları
├── components/
│   ├── storefront/          # Header, Footer, HeroSlider, ProductTabs, ProductCard…
│   ├── product/             # ProductGallery (zoom), ProductActions, StockStatus
│   └── admin/               # AdminSidebar, ProductForm, ImageUploader, SpecEditor…
├── lib/                     # prisma, auth, types, utils, demo-data, store (zustand)
├── server/                  # catalog, orders sorguları + actions (auth/products/orders/checkout)
└── generated/prisma/        # prisma generate çıktısı
prisma/
├── schema.prisma            # Veri modeli
├── migrations/              # Migration geçmişi
└── seed.ts                  # Örnek veri
scripts/
└── generate-placeholders.mjs # Markalı SVG placeholder üretici
```

Detaylı katman açıklaması ve veri modeli için: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Teknik Notlar

- **Görseller:** Ürün/hero görselleri demo amaçlı markalı **SVG**'lerdir (`public/images/`,
  `node scripts/generate-placeholders.mjs` ile üretilir). Gerçek ürün görselleri yönetim
  panelinden **yüklenir** ve `public/uploads/` altında saklanır. Üretimde nesne depolama (S3/R2) önerilir.
- **Kategori ağacı:** `Category.parentId` self-relation ile sınırsız derinlik destekler.
- **Sipariş bütünlüğü:** `OrderItem` sipariş anındaki ürün bilgisini (snapshot) tutar; ürün
  silinse bile geçmiş fatura bozulmaz.
- **Overselling koruması:** Ödemede stok düşümü `where: { stock: { gte: adet } }` koşuluyla
  transaction içinde yapılır.
- **Bağımlılık güvenliği:** Üretim bağımlılıklarında bilinen açık yoktur (`npm audit --omit=dev`
  → 0). `npm audit` yalnızca **geliştirme** zincirinde (`eslint-config-next` → `fast-glob` →
  `micromatch` → `braces`) yaması henüz yayınlanmamış bir `braces` danışma raporunu
  (GHSA-vfj7-8cjw-p6xm) gösterir; bu paketler çalışma zamanı paketine dahil değildir.
  `deepmerge-ts` ve `mysql2` için `package.json` `overrides` alanıyla yamalı sürümler
  sabitlenmiştir.
- **Kurulum script'leri (npm 12):** npm 12, bağımlılık install-script'lerini (postinstall/preinstall)
  varsayılan olarak **bloklar**. Prisma, `@prisma/engines`, esbuild gibi araçların gerekli
  script'leri `package.json` → **`allowScripts`** alanıyla onaylanmıştır (Vercel/npm 12 build'i
  için gereklidir). Yeni bir paket eklendiğinde `npm install-scripts ls` ile kontrol edip
  `npm install-scripts approve <pkg>` ile onaylayın.

---

## Ek

> Not: Projenin ilk sürümünde yer alan ve başka bir uygulamadan kalan kullanılmayan
> `backend/` ile `frontend/` iskelet klasörleri kaldırılmıştır.
