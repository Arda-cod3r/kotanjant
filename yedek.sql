--
-- PostgreSQL database dump
--

\restrict rKrMLZO1Rkzpu3bOXR7mEfcX8CXxC0avDJNu7K2yxGpe78bZxMF7O6FjPiDpImE

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'UNSPECIFIED',
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: OrderEventType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderEventType" AS ENUM (
    'CREATED',
    'STATUS_CHANGED',
    'NOTE'
);


ALTER TYPE public."OrderEventType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PREPARING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'ADMIN',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    "fullName" text NOT NULL,
    phone text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    line1 text NOT NULL,
    "postalCode" text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    "coverImage" text,
    "authorName" text DEFAULT 'Kotanjant Editör'::text NOT NULL,
    tags text[],
    "isPublished" boolean DEFAULT true NOT NULL,
    "publishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brand" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "logoUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Brand" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "imageUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentId" text
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: HeroSlide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HeroSlide" (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    image text NOT NULL,
    href text DEFAULT '/urunler'::text NOT NULL,
    cta text DEFAULT 'Keşfet'::text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."HeroSlide" OWNER TO postgres;

--
-- Name: InventoryLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryLog" (
    id text NOT NULL,
    "orderId" text,
    "productId" text,
    change integer NOT NULL,
    reason text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InventoryLog" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "userId" text,
    subtotal numeric(10,2) NOT NULL,
    shipping numeric(10,2) DEFAULT 0 NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "paymentMethod" text DEFAULT 'COD'::text NOT NULL,
    "paymentStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "customerName" text NOT NULL,
    "customerEmail" text NOT NULL,
    "customerPhone" text,
    "shippingAddress" text NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderEvent" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    type public."OrderEventType" DEFAULT 'STATUS_CHANGED'::public."OrderEventType" NOT NULL,
    status public."OrderStatus",
    note text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OrderEvent" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text,
    name text NOT NULL,
    sku text NOT NULL,
    "imageUrl" text,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    sku text NOT NULL,
    "shortDesc" text,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    "comparePrice" numeric(10,2),
    currency text DEFAULT 'TRY'::text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "lowStockAlert" integer DEFAULT 5 NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isDeal" boolean DEFAULT false NOT NULL,
    "isNew" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "ratingAvg" double precision DEFAULT 0 NOT NULL,
    "ratingCount" integer DEFAULT 0 NOT NULL,
    "categoryId" text,
    "brandId" text,
    tags text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO postgres;

--
-- Name: ProductSpec; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductSpec" (
    id text NOT NULL,
    "productId" text NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ProductSpec" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "userId" text,
    "authorName" text NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    phone text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "birthDate" date,
    "emailOptIn" boolean DEFAULT true NOT NULL,
    gender public."Gender" DEFAULT 'UNSPECIFIED'::public."Gender" NOT NULL,
    "smsOptIn" boolean DEFAULT false NOT NULL,
    "tcKimlik" text,
    "whatsappOptIn" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WishlistItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WishlistItem" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, "userId", title, "fullName", phone, city, district, line1, "postalCode", "isDefault", "createdAt") FROM stdin;
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, title, slug, excerpt, content, "coverImage", "authorName", tags, "isPublished", "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmuv0j364003lpanirhk0doqr	Doğru Jant Kapağı Nasıl Seçilir?	dogru-jant-kapagi-nasil-secilir	Aracınızın jant ölçüsünü nasıl öğrenirsiniz ve hangi kapak tipi size uygun? Adım adım rehber.	Jant kapağı seçiminde ilk adım doğru ölçüyü belirlemektir. Lastik yan duvarında yer alan ifadenin (ör. 195/65 R15) son haneleri jant çapını verir. Doğru ölçü seçildiğinde kapak tam oturur ve yolda çıkmaz.	/images/blog-1.svg	Kotanjant Editör	{rehber,ölçü}	t	2026-09-28 09:00:00	2026-10-05 08:53:42.22	2026-10-05 08:53:42.22
cmuv0j366003mpaniyp1degm4	Jant Kapağı Bakımı ve Temizliği	jant-kapagi-bakimi-ve-temizligi	Jant kapaklarınızın ilk günkü parlaklığını koruması için 5 pratik ipucu.	Düzenli bakım ile jant kapaklarınız uzun yıllar yeni gibi kalır. Asitli olmayan temizleyiciler tercih edin ve basınçlı suyu doğrudan klipslere tutmayın.	/images/blog-2.svg	Kotanjant Editör	{bakım,temizlik}	t	2026-09-15 09:00:00	2026-10-05 08:53:42.222	2026-10-05 08:53:42.222
cmuv0j368003npanib7pj13lv	Kış Öncesi Jant Kontrolü	kis-oncesi-jant-kontrolu	Kış lastiği dönemine girmeden önce yapmanız gereken kontroller ve öneriler.	Kış koşulları jant ve kapaklar üzerinde yıpratıcı etki yapar. Tuz ve nem kaynaklı paslanmayı önlemek için koruyucu uygulama yapılmalıdır.	/images/blog-3.svg	Kotanjant Editör	{kış,bakım}	t	2026-09-02 09:00:00	2026-10-05 08:53:42.224	2026-10-05 08:53:42.224
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brand" (id, name, slug, "logoUrl", "createdAt") FROM stdin;
cmuv0j3400002pani6iw2ijrf	Kotanjant	kotanjant	\N	2026-10-05 08:53:42.144
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, slug, description, "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt", "parentId") FROM stdin;
cmuv0j3430003pani0sgnenko	13" Jant Kapakları	13-inc-jant-kapaklari	Kompakt araçlar için 13 inç kapaklar	/images/product-11.svg	0	t	2026-10-05 08:53:42.147	2026-10-05 11:20:38.466	\N
cmuv0j3450004panipfcqzlqt	14" Jant Kapakları	14-inc-jant-kapaklari	En çok tercih edilen ölçü	/images/product-3.svg	1	t	2026-10-05 08:53:42.149	2026-10-05 11:20:38.469	\N
cmuv0j3470005paniq5h2xwm4	15" Jant Kapakları	15-inc-jant-kapaklari	Sedan ve hatchback uyumlu	/images/product-1.svg	2	t	2026-10-05 08:53:42.151	2026-10-05 11:20:38.47	\N
cmuv0j34a0006pani295n7ay7	16" ve Üzeri Kapaklar	16-inc-ve-uzeri-kapaklar	SUV ve ticari araçlar	/images/product-2.svg	3	t	2026-10-05 08:53:42.154	2026-10-05 11:20:38.471	\N
cmuv0j34c0007pani140epdkc	Oto Aksesuarları	oto-aksesuarlari	Silecek, paspas, koruma ürünleri	/images/product-7.svg	4	t	2026-10-05 08:53:42.156	2026-10-05 11:20:38.472	\N
cmuv0j34d0008paniatjdq23h	Bakım & Temizlik	bakim-temizlik	Jant ve kaporta bakım ürünleri	/images/product-8.svg	5	t	2026-10-05 08:53:42.157	2026-10-05 11:20:38.473	\N
\.


--
-- Data for Name: HeroSlide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HeroSlide" (id, title, subtitle, image, href, cta, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
cmuv5s1vz000798ni5mguncrw	Yeni Sezon Jant Kapakları	Aracınıza değer katan premium kapaklar	/uploads/1791200194585-82d56305.avif	/kategori/15-inc-jant-kapaklari	Koleksiyonu Keşfet	0	t	2026-10-05 11:20:38.543	2026-10-05 11:36:36.784
cmuv5s1vz000898niau5etdi7	Fırsat Ürünlerinde %40 İndirim	Seçili jant kapakları ve aksesuarlarda	/uploads/1791200201015-8c86f404.avif	/kategori/14-inc-jant-kapaklari	Fırsatları Gör	1	t	2026-10-05 11:20:38.543	2026-10-05 11:36:41.56
cmuv5s1vz000998ni3iw5t4xj	Kışa Hazır Aksesuar Seti	Silecek, paspas ve jant koruma ürünleri	/uploads/1791200206245-97c6b0a0.avif	/kategori/oto-aksesuarlari	Setleri İncele	2	t	2026-10-05 11:20:38.543	2026-10-05 11:36:47.119
\.


--
-- Data for Name: InventoryLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryLog" (id, "orderId", "productId", change, reason, "createdAt") FROM stdin;
cmuv1fjhm000evjniefvyfme6	cmuv1fjhd000avjnilfspssfa	cmuv0j361003bpanimahhzpfs	-4	Sipariş	2026-10-05 09:18:56.363
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "orderNumber", status, "userId", subtotal, shipping, discount, total, currency, "paymentMethod", "paymentStatus", "customerName", "customerEmail", "customerPhone", "shippingAddress", note, "createdAt", "updatedAt") FROM stdin;
cmuv1fjhd000avjnilfspssfa	KT-20261005-CCD2	PREPARING	cmuv17iud0001hgnij1gp9gam	11596.00	0.00	0.00	11596.00	TRY	CREDIT_CARD	PAID	arda ergin	ardadeneme@gmail.com	05360533053435	Adana, Açık adres deneme		2026-10-05 09:18:56.353	2026-10-05 09:18:56.353
cmuv0j36h003opanih7m96yxl	KT-SEED-1001	PREPARING	cmuv17iud0001hgnij1gp9gam	3798.90	0.00	0.00	3798.90	TRY	CREDIT_CARD	PENDING	Örnek Müşteri	musteri@kotanjant.com	0532 111 2233	İstanbul / Merkez, Örnek Mah. 10. Sok. No:1	\N	2026-10-05 08:53:42.232	2026-10-05 11:20:38.556
cmuv0j36l003tpanim2imexnn	KT-SEED-1002	SHIPPED	cmuv17iud0001hgnij1gp9gam	5077.80	0.00	0.00	5077.80	TRY	COD	PENDING	Örnek Müşteri	musteri@kotanjant.com	0533 222 3344	Ankara / Merkez, Örnek Mah. 11. Sok. No:2	\N	2026-10-04 02:53:42.236	2026-10-05 11:20:38.558
cmuv0j36o003ypanif49otonu	KT-SEED-1003	DELIVERED	\N	2398.90	0.00	0.00	2398.90	TRY	COD	PAID	Mehmet Kaya	mehmet@ornek.com	0534 333 4455	İzmir / Merkez, Örnek Mah. 12. Sok. No:3	\N	2026-10-02 20:53:42.239	2026-10-05 11:20:38.56
cmuv0j36q0043pani1ok3s6nf	KT-SEED-1004	PENDING	\N	8396.00	0.00	0.00	8396.00	TRY	CREDIT_CARD	PENDING	Zeynep Şahin	zeynep@ornek.com	0535 444 5566	Bursa / Merkez, Örnek Mah. 13. Sok. No:4	\N	2026-10-01 14:53:42.241	2026-10-05 11:20:38.562
cmuv0j36t0048pani27nyc7sn	KT-SEED-1005	CANCELLED	\N	1848.90	0.00	0.00	1848.90	TRY	COD	PENDING	Can Aydın	can@ornek.com	0536 555 6677	Antalya / Merkez, Örnek Mah. 14. Sok. No:5	\N	2026-09-30 08:53:42.244	2026-10-05 11:20:38.564
cmuv0j36v004dpanizd9i7kep	KT-SEED-1006	DELIVERED	\N	5797.80	0.00	0.00	5797.80	TRY	COD	PAID	Fatma Çelik	fatma@ornek.com	0537 666 7788	Konya / Merkez, Örnek Mah. 15. Sok. No:6	\N	2026-09-29 02:53:42.246	2026-10-05 11:20:38.566
cmuv0j36y004ipanipmtqakjy	KT-SEED-1007	SHIPPED	\N	3688.00	0.00	0.00	3688.00	TRY	CREDIT_CARD	PENDING	Burak Öztürk	burak@ornek.com	0538 777 8899	Eskişehir / Merkez, Örnek Mah. 16. Sok. No:7	\N	2026-09-27 20:53:42.248	2026-10-05 11:20:38.568
cmuv0j370004npanihmjhmt6y	KT-SEED-1008	PREPARING	\N	4197.80	0.00	0.00	4197.80	TRY	COD	PENDING	Selin Arslan	selin@ornek.com	0539 888 9900	Adana / Merkez, Örnek Mah. 17. Sok. No:8	\N	2026-09-26 14:53:42.252	2026-10-05 11:20:38.57
\.


--
-- Data for Name: OrderEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderEvent" (id, "orderId", type, status, note, "createdById", "createdAt") FROM stdin;
cmuv0j36i003rpanikmluxnnx	cmuv0j36h003opanih7m96yxl	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-10-05 08:53:42.232
cmuv0j36i003spaniet9xfsli	cmuv0j36h003opanih7m96yxl	STATUS_CHANGED	PREPARING	Seed verisi	cmuv0j3140000panifuymljuu	2026-10-05 09:53:42.232
cmuv0j36l003wpani2ci63kl4	cmuv0j36l003tpanim2imexnn	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-10-04 02:53:42.236
cmuv0j36l003xpani3pxoy9ra	cmuv0j36l003tpanim2imexnn	STATUS_CHANGED	SHIPPED	Seed verisi	cmuv0j3140000panifuymljuu	2026-10-04 03:53:42.236
cmuv0j36o0041pani6o1hp71n	cmuv0j36o003ypanif49otonu	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-10-02 20:53:42.239
cmuv0j36o0042panij6njfrk7	cmuv0j36o003ypanif49otonu	STATUS_CHANGED	DELIVERED	Seed verisi	cmuv0j3140000panifuymljuu	2026-10-02 21:53:42.239
cmuv0j36r0046paniop7o9wab	cmuv0j36q0043pani1ok3s6nf	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-10-01 14:53:42.241
cmuv0j36r0047pani8up82wwq	cmuv0j36q0043pani1ok3s6nf	STATUS_CHANGED	PENDING	Seed verisi	cmuv0j3140000panifuymljuu	2026-10-01 15:53:42.241
cmuv0j36t004bpaniejah8q5x	cmuv0j36t0048pani27nyc7sn	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-09-30 08:53:42.244
cmuv0j36t004cpani961i4at5	cmuv0j36t0048pani27nyc7sn	STATUS_CHANGED	CANCELLED	Seed verisi	cmuv0j3140000panifuymljuu	2026-09-30 09:53:42.244
cmuv0j36v004gpani2pu0oved	cmuv0j36v004dpanizd9i7kep	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-09-29 02:53:42.246
cmuv0j36v004hpani93vklywb	cmuv0j36v004dpanizd9i7kep	STATUS_CHANGED	DELIVERED	Seed verisi	cmuv0j3140000panifuymljuu	2026-09-29 03:53:42.246
cmuv0j36y004lpani0aa88t6u	cmuv0j36y004ipanipmtqakjy	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-09-27 20:53:42.248
cmuv0j36y004mpanifr0ck7cz	cmuv0j36y004ipanipmtqakjy	STATUS_CHANGED	SHIPPED	Seed verisi	cmuv0j3140000panifuymljuu	2026-09-27 21:53:42.248
cmuv0j371004qpaniv4pli4j4	cmuv0j370004npanihmjhmt6y	CREATED	PENDING	\N	cmuv0j3140000panifuymljuu	2026-09-26 14:53:42.252
cmuv0j371004rpaniv7luqjq4	cmuv0j370004npanihmjhmt6y	STATUS_CHANGED	PREPARING	Seed verisi	cmuv0j3140000panifuymljuu	2026-09-26 15:53:42.252
cmuv1fjhi000cvjnixw21pzoi	cmuv1fjhd000avjnilfspssfa	CREATED	PENDING	Sipariş oluşturuldu	\N	2026-10-05 09:18:56.353
cmuv1fjhi000dvjni4hlh0fah	cmuv1fjhd000avjnilfspssfa	STATUS_CHANGED	PREPARING	Hazırlanıyor	\N	2026-10-05 09:18:56.353
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", name, sku, "imageUrl", "unitPrice", quantity) FROM stdin;
cmuv0j36h003ppaniys9kodq6	cmuv0j36h003opanih7m96yxl	cmuv0j34q0009panigxi61h7l	Krom Jant Kapağı 15"	KT-JK-1501	/images/product-1.svg	1499.90	1
cmuv0j36h003qpani7sukow1w	cmuv0j36h003opanih7m96yxl	cmuv0j3550013panij8x99x1r	Karbon Desen Jant Kapağı 17"	KT-JK-1704	/images/product-4.svg	2299.00	1
cmuv0j36l003upaniiazlu627	cmuv0j36l003tpanim2imexnn	cmuv0j34w000jpanixvhrjhgg	Sportif Jant Kapağı 16"	KT-JK-1602	/images/product-2.svg	1789.00	2
cmuv0j36l003vpanipfyv6086	cmuv0j36l003tpanim2imexnn	cmuv0j35a001dpanie9xtxy8d	Orijinal Tip Jant Kapağı 13"	KT-JK-1305	/images/product-5.svg	749.90	2
cmuv0j36o003zpanid0n4bbpu	cmuv0j36o003ypanif49otonu	cmuv0j350000tpanisuvrggmb	Mat Siyah Jant Kapağı 14"	KT-JK-1403	/images/product-3.svg	999.90	1
cmuv0j36o0040panid4o287pe	cmuv0j36o003ypanif49otonu	cmuv0j35e001npanionza3ip9	Parlak Gümüş Jant Kapağı 15"	KT-JK-1506	/images/product-6.svg	1399.00	1
cmuv0j36r0044pani6hfava3c	cmuv0j36q0043pani1ok3s6nf	cmuv0j3550013panij8x99x1r	Karbon Desen Jant Kapağı 17"	KT-JK-1704	/images/product-4.svg	2299.00	2
cmuv0j36r0045pani532jxgc8	cmuv0j36q0043pani1ok3s6nf	cmuv0j35i001xpanin9jt9mv3	Off-Road Jant Kapağı 16"	KT-JK-1607	/images/product-7.svg	1899.00	2
cmuv0j36t0049panit6879dcj	cmuv0j36t0048pani27nyc7sn	cmuv0j35a001dpanie9xtxy8d	Orijinal Tip Jant Kapağı 13"	KT-JK-1305	/images/product-5.svg	749.90	1
cmuv0j36t004apani0bcuox97	cmuv0j36t0048pani27nyc7sn	cmuv0j35m0027pani7psn79rh	Kışlık Dayanıklı Kapak 14"	KT-JK-1408	/images/product-8.svg	1099.00	1
cmuv0j36v004epani1tlctmbz	cmuv0j36v004dpanizd9i7kep	cmuv0j35e001npanionza3ip9	Parlak Gümüş Jant Kapağı 15"	KT-JK-1506	/images/product-6.svg	1399.00	2
cmuv0j36v004fpani5gm4s95z	cmuv0j36v004dpanizd9i7kep	cmuv0j34q0009panigxi61h7l	Krom Jant Kapağı 15"	KT-JK-1501	/images/product-1.svg	1499.90	2
cmuv0j36y004jpanimugve809	cmuv0j36y004ipanipmtqakjy	cmuv0j35i001xpanin9jt9mv3	Off-Road Jant Kapağı 16"	KT-JK-1607	/images/product-7.svg	1899.00	1
cmuv0j36y004kpanis3o50zsp	cmuv0j36y004ipanipmtqakjy	cmuv0j34w000jpanixvhrjhgg	Sportif Jant Kapağı 16"	KT-JK-1602	/images/product-2.svg	1789.00	1
cmuv0j371004opanifvzwaaqo	cmuv0j370004npanihmjhmt6y	cmuv0j35m0027pani7psn79rh	Kışlık Dayanıklı Kapak 14"	KT-JK-1408	/images/product-8.svg	1099.00	2
cmuv0j371004ppanifl1l6lyl	cmuv0j370004npanihmjhmt6y	cmuv0j350000tpanisuvrggmb	Mat Siyah Jant Kapağı 14"	KT-JK-1403	/images/product-3.svg	999.90	2
cmuv1fjhg000bvjnipj70cnq2	cmuv1fjhd000avjnilfspssfa	cmuv0j361003bpanimahhzpfs	Performans Kapak 18"	KT-JK-1812	/images/product-12.svg	2899.00	4
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, slug, sku, "shortDesc", description, price, "comparePrice", currency, stock, "lowStockAlert", "isFeatured", "isDeal", "isNew", "isActive", "ratingAvg", "ratingCount", "categoryId", "brandId", tags, "createdAt", "updatedAt") FROM stdin;
cmuv0j34q0009panigxi61h7l	Krom Jant Kapağı 15"	krom-jant-kapagi-15	KT-JK-1501	4'lü set, çelik klipsli, paslanmaz yüzey.	Yüksek parlaklıkta krom kaplama ile aracınıza premium bir görünüm kazandırır. Çelik klips mekanizması sayesinde yolda çıkmaz, kolayca takılır.	1499.90	1999.90	TRY	42	5	t	t	f	t	4.7	128	cmuv0j3470005paniq5h2xwm4	cmuv0j3400002pani6iw2ijrf	{krom,"15 inç","4 lü set"}	2026-10-05 08:53:42.17	2026-10-05 08:53:42.17
cmuv0j34w000jpanixvhrjhgg	Sportif Jant Kapağı 16"	sportif-jant-kapagi-16	KT-JK-1602	Parçalı sportif tasarım, mat yüzey aksanlar.	Sportif çok kollu görünümü ile aracınıza dinamik bir karakter katar. Darbeye dayanıklı ABS gövde.	1789.00	2199.00	TRY	18	5	t	f	t	t	4.5	74	cmuv0j34a0006pani295n7ay7	cmuv0j3400002pani6iw2ijrf	{sportif,"16 inç"}	2026-10-05 08:53:42.176	2026-10-05 08:53:42.176
cmuv0j350000tpanisuvrggmb	Mat Siyah Jant Kapağı 14"	mat-siyah-jant-kapagi-14	KT-JK-1403	Mat siyah, darbe dayanımlı ABS gövde.	Klasik ve şık mat siyah yüzey. UV dayanımlı boya ile solmaya karşı korumalı.	999.90	1299.90	TRY	65	5	f	t	f	t	4.4	96	cmuv0j3450004panipfcqzlqt	cmuv0j3400002pani6iw2ijrf	{"mat siyah","14 inç"}	2026-10-05 08:53:42.18	2026-10-05 08:53:42.18
cmuv0j3550013panij8x99x1r	Karbon Desen Jant Kapağı 17"	karbon-desen-jant-kapagi-17	KT-JK-1704	Gerçek karbon görünümlü doku, UV korumalı.	Gerçekçi karbon fiber dokusu ile sportif bir görünüm. Geniş ölçülerde araçlar için idealdir.	2299.00	2799.00	TRY	9	5	t	f	t	t	4.8	51	cmuv0j34a0006pani295n7ay7	cmuv0j3400002pani6iw2ijrf	{karbon,"17 inç"}	2026-10-05 08:53:42.185	2026-10-05 08:53:42.185
cmuv0j35a001dpanie9xtxy8d	Orijinal Tip Jant Kapağı 13"	orijinal-tip-jant-kapagi-13	KT-JK-1305	Kolay montaj, orijinal donanım görünümü.	Fabrika çıkışı görünümünü korur. Ekonomik ve pratik bir seçimdir.	749.90	\N	TRY	110	5	f	t	f	t	4.2	143	cmuv0j3430003pani0sgnenko	cmuv0j3400002pani6iw2ijrf	{"13 inç",ekonomik}	2026-10-05 08:53:42.19	2026-10-05 08:53:42.19
cmuv0j35e001npanionza3ip9	Parlak Gümüş Jant Kapağı 15"	parlak-gumus-jant-kapagi-15	KT-JK-1506	Paslanmaz klipsli, parlak gümüş yüzey.	Parlak gümüş kaplama ve paslanmaz klipsler ile uzun ömürlü kullanım.	1399.00	1699.00	TRY	33	5	t	f	f	t	4.6	87	cmuv0j3470005paniq5h2xwm4	cmuv0j3400002pani6iw2ijrf	{gümüş,"15 inç"}	2026-10-05 08:53:42.194	2026-10-05 08:53:42.194
cmuv0j35i001xpanin9jt9mv3	Off-Road Jant Kapağı 16"	off-road-jant-kapagi-16	KT-JK-1607	SUV ve hafif ticari araçlar için dayanıklı.	Zorlu yol koşullarına dayanıklı, kalın gövde yapısı. SUV ve ticari araçlar için idealdir.	1899.00	\N	TRY	21	5	f	f	t	t	4.5	39	cmuv0j34a0006pani295n7ay7	cmuv0j3400002pani6iw2ijrf	{off-road,SUV,"16 inç"}	2026-10-05 08:53:42.198	2026-10-05 08:53:42.198
cmuv0j35m0027pani7psn79rh	Kışlık Dayanıklı Kapak 14"	kislik-dayanikli-kapak-14	KT-JK-1408	Soğuk havaya ve tuza dirençli özel formül.	Kış koşullarında çatlamaya karşı dirençli, tuz ve neme dayanıklı özel karışım.	1099.00	1399.00	TRY	54	5	f	t	f	t	4.3	62	cmuv0j3450004panipfcqzlqt	cmuv0j3400002pani6iw2ijrf	{kışlık,"14 inç"}	2026-10-05 08:53:42.202	2026-10-05 08:53:42.202
cmuv0j35r002hpani10jkswwl	Ayna Kaplamalı Kapak 17"	ayna-kaplamali-kapak-17	KT-JK-1709	Ayna parlaklığında premium kaplama.	Ayna benzeri yansıtıcı yüzey ile araçta fark yaratan premium görünüm.	2499.00	2999.00	TRY	6	5	t	f	t	t	4.9	28	cmuv0j34a0006pani295n7ay7	cmuv0j3400002pani6iw2ijrf	{ayna,premium,"17 inç"}	2026-10-05 08:53:42.207	2026-10-05 08:53:42.207
cmuv0j35u002rpani4eed6ibe	Klasik Krom Kapak 15"	klasik-krom-kapak-15	KT-JK-1510	Retro seri, klasik krom tasarım.	Klasik araçlara uygun retro krom tasarım. Zamansız bir stildir.	1599.00	\N	TRY	27	5	f	f	f	t	4.4	44	cmuv0j3470005paniq5h2xwm4	cmuv0j3400002pani6iw2ijrf	{retro,krom,"15 inç"}	2026-10-05 08:53:42.21	2026-10-05 08:53:42.21
cmuv0j35y0031panieknrpobt	Kompakt Kapak 13"	kompakt-kapak-13	KT-JK-1311	Şehir içi kullanım için hafif ve pratik.	Hafif yapısı ile yakıt verimliliğine katkı sağlar. Şehir içi kullanım için idealdir.	699.90	899.90	TRY	140	5	f	t	f	t	4.1	118	cmuv0j3430003pani0sgnenko	cmuv0j3400002pani6iw2ijrf	{"13 inç",hafif}	2026-10-05 08:53:42.214	2026-10-05 08:53:42.214
cmuv0j361003bpanimahhzpfs	Performans Kapak 18"	performans-kapak-18	KT-JK-1812	Düşük rüzgar direnci, aerodinamik tasarım.	Aerodinamik formu ile rüzgar direncini azaltır. Performans odaklı araçlar için tasarlandı.	2899.00	3499.00	TRY	0	5	t	f	t	t	4.8	22	cmuv0j34a0006pani295n7ay7	cmuv0j3400002pani6iw2ijrf	{performans,"18 inç",aerodinamik}	2026-10-05 08:53:42.217	2026-10-05 09:18:56.349
cmuv23efu000hvjni6kon1o79	Deneme Ürün Adı	deneme-urun-adi	KT-JK-18153	Deneme Kısa Açıklama	Detaylı açıklama	120.00	150.00	TRY	4	5	f	f	t	t	0	0	\N	cmuv0j3400002pani6iw2ijrf	{"etiket deneme"}	2026-10-05 09:37:29.562	2026-10-05 09:37:29.562
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductImage" (id, "productId", url, alt, "sortOrder", "isPrimary") FROM stdin;
cmuv0j34r000apanioccar2o3	cmuv0j34q0009panigxi61h7l	/images/product-1.svg	Krom Jant Kapağı 15"	0	t
cmuv0j34r000bpani3t6q2lr4	cmuv0j34q0009panigxi61h7l	/images/product-5.svg	Krom Jant Kapağı 15" - 2	1	f
cmuv0j34r000cpani6hd2j3aa	cmuv0j34q0009panigxi61h7l	/images/product-7.svg	Krom Jant Kapağı 15" - 3	2	f
cmuv0j34r000dpani01czgmuy	cmuv0j34q0009panigxi61h7l	/images/product-9.svg	Krom Jant Kapağı 15" - 4	3	f
cmuv0j34w000kpanifeasgilo	cmuv0j34w000jpanixvhrjhgg	/images/product-2.svg	Sportif Jant Kapağı 16"	0	t
cmuv0j34w000lpani53398cvy	cmuv0j34w000jpanixvhrjhgg	/images/product-6.svg	Sportif Jant Kapağı 16" - 2	1	f
cmuv0j34w000mpanikshf1jsn	cmuv0j34w000jpanixvhrjhgg	/images/product-8.svg	Sportif Jant Kapağı 16" - 3	2	f
cmuv0j34w000npanigvht9qma	cmuv0j34w000jpanixvhrjhgg	/images/product-10.svg	Sportif Jant Kapağı 16" - 4	3	f
cmuv0j351000upani7cpvrdie	cmuv0j350000tpanisuvrggmb	/images/product-3.svg	Mat Siyah Jant Kapağı 14"	0	t
cmuv0j351000vpaniac9w5p5t	cmuv0j350000tpanisuvrggmb	/images/product-7.svg	Mat Siyah Jant Kapağı 14" - 2	1	f
cmuv0j351000wpaniu7inlq05	cmuv0j350000tpanisuvrggmb	/images/product-9.svg	Mat Siyah Jant Kapağı 14" - 3	2	f
cmuv0j351000xpanic9q2phoq	cmuv0j350000tpanisuvrggmb	/images/product-11.svg	Mat Siyah Jant Kapağı 14" - 4	3	f
cmuv0j3560014panidrnrxllj	cmuv0j3550013panij8x99x1r	/images/product-4.svg	Karbon Desen Jant Kapağı 17"	0	t
cmuv0j3560015panivpufje67	cmuv0j3550013panij8x99x1r	/images/product-8.svg	Karbon Desen Jant Kapağı 17" - 2	1	f
cmuv0j3560016pani8wytzig0	cmuv0j3550013panij8x99x1r	/images/product-10.svg	Karbon Desen Jant Kapağı 17" - 3	2	f
cmuv0j3560017panil4oxq2nf	cmuv0j3550013panij8x99x1r	/images/product-12.svg	Karbon Desen Jant Kapağı 17" - 4	3	f
cmuv0j35b001epani34omrvoi	cmuv0j35a001dpanie9xtxy8d	/images/product-5.svg	Orijinal Tip Jant Kapağı 13"	0	t
cmuv0j35b001fpanijzrzrqpl	cmuv0j35a001dpanie9xtxy8d	/images/product-9.svg	Orijinal Tip Jant Kapağı 13" - 2	1	f
cmuv0j35b001gpanit15gjw34	cmuv0j35a001dpanie9xtxy8d	/images/product-11.svg	Orijinal Tip Jant Kapağı 13" - 3	2	f
cmuv0j35b001hpani6904qhpk	cmuv0j35a001dpanie9xtxy8d	/images/product-1.svg	Orijinal Tip Jant Kapağı 13" - 4	3	f
cmuv0j35f001opanivn9x0qye	cmuv0j35e001npanionza3ip9	/images/product-6.svg	Parlak Gümüş Jant Kapağı 15"	0	t
cmuv0j35f001ppanil1yw2lld	cmuv0j35e001npanionza3ip9	/images/product-10.svg	Parlak Gümüş Jant Kapağı 15" - 2	1	f
cmuv0j35f001qpanibzg7ndi5	cmuv0j35e001npanionza3ip9	/images/product-12.svg	Parlak Gümüş Jant Kapağı 15" - 3	2	f
cmuv0j35f001rpanixpjfrmes	cmuv0j35e001npanionza3ip9	/images/product-2.svg	Parlak Gümüş Jant Kapağı 15" - 4	3	f
cmuv0j35j001ypanidvid779a	cmuv0j35i001xpanin9jt9mv3	/images/product-7.svg	Off-Road Jant Kapağı 16"	0	t
cmuv0j35j001zpaniu1g8od42	cmuv0j35i001xpanin9jt9mv3	/images/product-11.svg	Off-Road Jant Kapağı 16" - 2	1	f
cmuv0j35j0020panidqttdsbl	cmuv0j35i001xpanin9jt9mv3	/images/product-1.svg	Off-Road Jant Kapağı 16" - 3	2	f
cmuv0j35j0021panil84dqr19	cmuv0j35i001xpanin9jt9mv3	/images/product-3.svg	Off-Road Jant Kapağı 16" - 4	3	f
cmuv0j35m0028paniv2sah59w	cmuv0j35m0027pani7psn79rh	/images/product-8.svg	Kışlık Dayanıklı Kapak 14"	0	t
cmuv0j35m0029pani8ylcphoe	cmuv0j35m0027pani7psn79rh	/images/product-12.svg	Kışlık Dayanıklı Kapak 14" - 2	1	f
cmuv0j35m002apanih9fxlovr	cmuv0j35m0027pani7psn79rh	/images/product-2.svg	Kışlık Dayanıklı Kapak 14" - 3	2	f
cmuv0j35m002bpaniu04j9gp2	cmuv0j35m0027pani7psn79rh	/images/product-4.svg	Kışlık Dayanıklı Kapak 14" - 4	3	f
cmuv0j35r002ipani3s1nkzzz	cmuv0j35r002hpani10jkswwl	/images/product-9.svg	Ayna Kaplamalı Kapak 17"	0	t
cmuv0j35r002jpanihn88qf0l	cmuv0j35r002hpani10jkswwl	/images/product-1.svg	Ayna Kaplamalı Kapak 17" - 2	1	f
cmuv0j35r002kpanitbozbd18	cmuv0j35r002hpani10jkswwl	/images/product-3.svg	Ayna Kaplamalı Kapak 17" - 3	2	f
cmuv0j35r002lpaniiqsd3hi0	cmuv0j35r002hpani10jkswwl	/images/product-5.svg	Ayna Kaplamalı Kapak 17" - 4	3	f
cmuv0j35u002spanik395h9j0	cmuv0j35u002rpani4eed6ibe	/images/product-10.svg	Klasik Krom Kapak 15"	0	t
cmuv0j35u002tpanid8ygyz2i	cmuv0j35u002rpani4eed6ibe	/images/product-2.svg	Klasik Krom Kapak 15" - 2	1	f
cmuv0j35u002upani6vxbgrpp	cmuv0j35u002rpani4eed6ibe	/images/product-4.svg	Klasik Krom Kapak 15" - 3	2	f
cmuv0j35u002vpaniqeznecjg	cmuv0j35u002rpani4eed6ibe	/images/product-6.svg	Klasik Krom Kapak 15" - 4	3	f
cmuv0j35y0032paniitrtb8re	cmuv0j35y0031panieknrpobt	/images/product-11.svg	Kompakt Kapak 13"	0	t
cmuv0j35y0033paniide555u7	cmuv0j35y0031panieknrpobt	/images/product-3.svg	Kompakt Kapak 13" - 2	1	f
cmuv0j35y0034pani8217tsty	cmuv0j35y0031panieknrpobt	/images/product-5.svg	Kompakt Kapak 13" - 3	2	f
cmuv0j35y0035panijucx5iez	cmuv0j35y0031panieknrpobt	/images/product-7.svg	Kompakt Kapak 13" - 4	3	f
cmuv0yyyz0001vjnix649ibfk	cmuv0j361003bpanimahhzpfs	/images/product-12.svg	Performans Kapak 18"	0	t
cmuv0yyyz0002vjnie4bpulsg	cmuv0j361003bpanimahhzpfs	/images/product-4.svg	Performans Kapak 18" - 2	1	f
cmuv0yyyz0003vjniq3jjwlqe	cmuv0j361003bpanimahhzpfs	/images/product-6.svg	Performans Kapak 18" - 3	2	f
cmuv0yyyz0004vjnii8a3wvmc	cmuv0j361003bpanimahhzpfs	/images/product-8.svg	Performans Kapak 18" - 4	3	f
cmuv23efx000ivjni5lr4za6n	cmuv23efu000hvjni6kon1o79	/uploads/1791193037183-bc29da35.webp		0	t
\.


--
-- Data for Name: ProductSpec; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductSpec" (id, "productId", label, value, "sortOrder") FROM stdin;
cmuv0j34s000epanikud87qo6	cmuv0j34q0009panigxi61h7l	Jant Çapı	15 inç	0
cmuv0j34s000fpani94qj2rwf	cmuv0j34q0009panigxi61h7l	Malzeme	ABS + Krom Kaplama	1
cmuv0j34s000gpani5nsmawjj	cmuv0j34q0009panigxi61h7l	Set İçeriği	4 Adet	2
cmuv0j34s000hpanif20921ls	cmuv0j34q0009panigxi61h7l	Montaj	Çelik Klips	3
cmuv0j34s000ipani57bo7jde	cmuv0j34q0009panigxi61h7l	Garanti	24 Ay	4
cmuv0j34x000opanimkeypy14	cmuv0j34w000jpanixvhrjhgg	Jant Çapı	16 inç	0
cmuv0j34x000ppani9j0jhqp2	cmuv0j34w000jpanixvhrjhgg	Malzeme	ABS	1
cmuv0j34x000qpani0o99ph4z	cmuv0j34w000jpanixvhrjhgg	Set İçeriği	4 Adet	2
cmuv0j34x000rpani1bss7pcc	cmuv0j34w000jpanixvhrjhgg	Renk	Antrasit/Mat Siyah	3
cmuv0j34x000spanioyx7shgw	cmuv0j34w000jpanixvhrjhgg	Garanti	24 Ay	4
cmuv0j351000ypaniyvsvmhob	cmuv0j350000tpanisuvrggmb	Jant Çapı	14 inç	0
cmuv0j351000zpani3ash7bqr	cmuv0j350000tpanisuvrggmb	Malzeme	ABS	1
cmuv0j3510010paniyq6a3e1j	cmuv0j350000tpanisuvrggmb	Set İçeriği	4 Adet	2
cmuv0j3510011pani6v6lwgxx	cmuv0j350000tpanisuvrggmb	Kaplama	UV Korumalı	3
cmuv0j3510012paniuws71m3s	cmuv0j350000tpanisuvrggmb	Garanti	24 Ay	4
cmuv0j3570018paniybdjajkg	cmuv0j3550013panij8x99x1r	Jant Çapı	17 inç	0
cmuv0j3570019paniuhix4skx	cmuv0j3550013panij8x99x1r	Malzeme	ABS + Karbon Desen	1
cmuv0j357001apaniyx22ts1p	cmuv0j3550013panij8x99x1r	Set İçeriği	4 Adet	2
cmuv0j357001bpani177p93n3	cmuv0j3550013panij8x99x1r	Yüzey	Parlak	3
cmuv0j357001cpanizxb7kfh3	cmuv0j3550013panij8x99x1r	Garanti	24 Ay	4
cmuv0j35b001ipanig8ndvfka	cmuv0j35a001dpanie9xtxy8d	Jant Çapı	13 inç	0
cmuv0j35b001jpaniy5un1fi8	cmuv0j35a001dpanie9xtxy8d	Malzeme	ABS	1
cmuv0j35b001kpaniey231907	cmuv0j35a001dpanie9xtxy8d	Set İçeriği	4 Adet	2
cmuv0j35b001lpanixv3md9js	cmuv0j35a001dpanie9xtxy8d	Montaj	Klipsli	3
cmuv0j35b001mpani0z9ndd3h	cmuv0j35a001dpanie9xtxy8d	Garanti	12 Ay	4
cmuv0j35f001spaniv3k6lqcr	cmuv0j35e001npanionza3ip9	Jant Çapı	15 inç	0
cmuv0j35f001tpaniu8fxf1hz	cmuv0j35e001npanionza3ip9	Malzeme	ABS + Metalik Kaplama	1
cmuv0j35f001upaniekpj572b	cmuv0j35e001npanionza3ip9	Set İçeriği	4 Adet	2
cmuv0j35f001vpani6b4ie6fv	cmuv0j35e001npanionza3ip9	Klips	Paslanmaz Çelik	3
cmuv0j35f001wpanikujgzllz	cmuv0j35e001npanionza3ip9	Garanti	24 Ay	4
cmuv0j35j0022panihru5nmrr	cmuv0j35i001xpanin9jt9mv3	Jant Çapı	16 inç	0
cmuv0j35j0023panizf5a27wx	cmuv0j35i001xpanin9jt9mv3	Malzeme	Güçlendirilmiş ABS	1
cmuv0j35j0024panimfajcx7h	cmuv0j35i001xpanin9jt9mv3	Set İçeriği	4 Adet	2
cmuv0j35j0025pani0j9up7o1	cmuv0j35i001xpanin9jt9mv3	Kullanım	SUV / Ticari	3
cmuv0j35j0026pani5jfnc4o3	cmuv0j35i001xpanin9jt9mv3	Garanti	24 Ay	4
cmuv0j35m002cpaniy5377vih	cmuv0j35m0027pani7psn79rh	Jant Çapı	14 inç	0
cmuv0j35m002dpanifsd5pt8o	cmuv0j35m0027pani7psn79rh	Malzeme	Soğuğa Dirençli PP	1
cmuv0j35m002epanioqumahzt	cmuv0j35m0027pani7psn79rh	Set İçeriği	4 Adet	2
cmuv0j35m002fpanirkhlvlno	cmuv0j35m0027pani7psn79rh	Sıcaklık	-40°C / +80°C	3
cmuv0j35m002gpaniizw2dqla	cmuv0j35m0027pani7psn79rh	Garanti	24 Ay	4
cmuv0j35r002mpani4py9nj7l	cmuv0j35r002hpani10jkswwl	Jant Çapı	17 inç	0
cmuv0j35r002npanicos9utsu	cmuv0j35r002hpani10jkswwl	Malzeme	ABS + Ayna Kaplama	1
cmuv0j35r002opanilsmedc6c	cmuv0j35r002hpani10jkswwl	Set İçeriği	4 Adet	2
cmuv0j35r002ppanilfnc99m2	cmuv0j35r002hpani10jkswwl	Yüzey	Yansıtıcı	3
cmuv0j35r002qpanivlejlrq7	cmuv0j35r002hpani10jkswwl	Garanti	24 Ay	4
cmuv0j35v002wpaniqu50mpg8	cmuv0j35u002rpani4eed6ibe	Jant Çapı	15 inç	0
cmuv0j35v002xpanizl4wf7gw	cmuv0j35u002rpani4eed6ibe	Malzeme	ABS + Krom	1
cmuv0j35v002ypani366n0k7k	cmuv0j35u002rpani4eed6ibe	Set İçeriği	4 Adet	2
cmuv0j35v002zpaniki61ubtx	cmuv0j35u002rpani4eed6ibe	Stil	Retro	3
cmuv0j35v0030panillpy8nmt	cmuv0j35u002rpani4eed6ibe	Garanti	24 Ay	4
cmuv0j35y0036panidzv5aosi	cmuv0j35y0031panieknrpobt	Jant Çapı	13 inç	0
cmuv0j35y0037paniyd6yk0xm	cmuv0j35y0031panieknrpobt	Malzeme	Hafif ABS	1
cmuv0j35y0038pani3q68gpfs	cmuv0j35y0031panieknrpobt	Set İçeriği	4 Adet	2
cmuv0j35y0039pani7wk3pq5a	cmuv0j35y0031panieknrpobt	Ağırlık	180 g/adet	3
cmuv0j35y003apanin8ttqp03	cmuv0j35y0031panieknrpobt	Garanti	12 Ay	4
cmuv0yyz20005vjni3u7b8s1n	cmuv0j361003bpanimahhzpfs	Jant Çapı	18 inç	0
cmuv0yyz20006vjnigjw5ywny	cmuv0j361003bpanimahhzpfs	Malzeme	Kompozit ABS	1
cmuv0yyz20007vjnigj46emks	cmuv0j361003bpanimahhzpfs	Set İçeriği	4 Adet	2
cmuv0yyz20008vjniyrwsvoby	cmuv0j361003bpanimahhzpfs	Tasarım	Aerodinamik	3
cmuv0yyz20009vjnirplfowey	cmuv0j361003bpanimahhzpfs	Garanti	24 Ay	4
cmuv23efz000jvjnilfkg8um2	cmuv23efu000hvjni6kon1o79	jant çapı	15 inç	0
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "productId", "userId", "authorName", rating, comment, "isApproved", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "passwordHash", role, phone, "isActive", "createdAt", "updatedAt", "birthDate", "emailOptIn", gender, "smsOptIn", "tcKimlik", "whatsappOptIn") FROM stdin;
cmuv0j33n0001paniyb63hypa	admin@kotanjant.com	Mağaza Yöneticisi	$2b$10$gQUyUnm0mLsPZniDJzcPh.XhR7QJOusHxSCC3bhwuu9ze.IYsX2CC	ADMIN	\N	t	2026-10-05 08:53:42.131	2026-10-05 08:53:42.131	\N	t	UNSPECIFIED	f	\N	f
cmuv1zc32000fvjniy4bf05ki	denemeacc@gmail.com	deneme kayit	$2b$10$KTIQTZkLMlGgeXzuWieHruEmqn.Oa3lTv4BKvYC0o.hTXsYjjAQAS	CUSTOMER	0536057344222	t	2026-10-05 09:34:19.886	2026-10-05 09:34:19.886	\N	t	UNSPECIFIED	f	\N	f
cmuv0j3140000panifuymljuu	superadmin@kotanjant.com	Süper Admin	$2b$10$txzezFleKWdII1yarO5S.ungABzzpdequKIifhvzW/cwQHSewoYBW	SUPERADMIN	\N	t	2026-10-05 08:53:42.04	2026-10-05 11:20:38.317	\N	t	UNSPECIFIED	f	\N	f
cmuv17iud0001hgnij1gp9gam	musteri@kotanjant.com	Örnek Müşteri	$2b$10$xRGzjSoHUth1maQmSzsque1SmPzEVaKwLMOyCQwtejby3Ki68Mtxi	CUSTOMER	0555 000 00 00	t	2026-10-05 09:12:42.277	2026-10-05 11:30:15.931	\N	t	UNSPECIFIED	t	\N	t
cmuv69wh70000jpnif4zqtzn5	denemeaccc@gmail.com	deneme acc	$2b$10$sTcTET7.0iHZZmO0LfHZAOER0DTjOoXSK2jl1Oo2GWemGYw3Sh7DO	CUSTOMER	0536 057 34 42	t	2026-10-05 11:34:31.339	2026-10-05 11:35:08.33	2005-02-23	t	MALE	f	10162432762	f
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WishlistItem" (id, "userId", "productId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9d654ff7-46b5-4ee9-b19b-61c39463907e	b2b068585340c8c2c30ce05b800071b67bba15b35dc355d3aa9a1c09dc33d2e5	2026-10-05 08:53:35.85565+00	20261005085335_init	\N	\N	2026-10-05 08:53:35.810453+00	1
d81842d0-fa68-440f-b1be-9b45e1bc6400	bf37a4ecfcab9a933dca0248097317ed23ec5da68f3fc8bd6fa19b87cb190a74	2026-10-05 10:14:53.002389+00	20261005131451_user_profile_fields	\N	\N	2026-10-05 10:14:52.992176+00	1
35ce0f6b-6c4f-4105-b5f4-3bf4c677440d	f6bc5fe46bf9d3e37b03f783ba09c46a014948ca879193e45fe1282c193dbcf4	2026-10-05 11:18:00.60314+00	20261005111800_hero_slides	\N	\N	2026-10-05 11:18:00.598991+00	1
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: HeroSlide HeroSlide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HeroSlide"
    ADD CONSTRAINT "HeroSlide_pkey" PRIMARY KEY (id);


--
-- Name: InventoryLog InventoryLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryLog"
    ADD CONSTRAINT "InventoryLog_pkey" PRIMARY KEY (id);


--
-- Name: OrderEvent OrderEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderEvent"
    ADD CONSTRAINT "OrderEvent_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductSpec ProductSpec_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductSpec"
    ADD CONSTRAINT "ProductSpec_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Address_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Address_userId_idx" ON public."Address" USING btree ("userId");


--
-- Name: BlogPost_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_publishedAt_idx" ON public."BlogPost" USING btree ("publishedAt");


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Brand_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Brand_name_idx" ON public."Brand" USING btree (name);


--
-- Name: Brand_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_slug_key" ON public."Brand" USING btree (slug);


--
-- Name: Category_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Category_parentId_idx" ON public."Category" USING btree ("parentId");


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: HeroSlide_sortOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "HeroSlide_sortOrder_idx" ON public."HeroSlide" USING btree ("sortOrder");


--
-- Name: InventoryLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryLog_createdAt_idx" ON public."InventoryLog" USING btree ("createdAt");


--
-- Name: InventoryLog_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryLog_productId_idx" ON public."InventoryLog" USING btree ("productId");


--
-- Name: OrderEvent_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderEvent_orderId_idx" ON public."OrderEvent" USING btree ("orderId");


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: OrderItem_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_productId_idx" ON public."OrderItem" USING btree ("productId");


--
-- Name: Order_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_createdAt_idx" ON public."Order" USING btree ("createdAt");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: ProductImage_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProductImage_productId_idx" ON public."ProductImage" USING btree ("productId");


--
-- Name: ProductSpec_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProductSpec_productId_idx" ON public."ProductSpec" USING btree ("productId");


--
-- Name: Product_brandId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_brandId_idx" ON public."Product" USING btree ("brandId");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Product_isDeal_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_isDeal_idx" ON public."Product" USING btree ("isDeal");


--
-- Name: Product_isFeatured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_isFeatured_idx" ON public."Product" USING btree ("isFeatured");


--
-- Name: Product_isNew_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_isNew_idx" ON public."Product" USING btree ("isNew");


--
-- Name: Product_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_name_idx" ON public."Product" USING btree (name);


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Review_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_productId_idx" ON public."Review" USING btree ("productId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: User_tcKimlik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_tcKimlik_key" ON public."User" USING btree ("tcKimlik");


--
-- Name: WishlistItem_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WishlistItem_userId_idx" ON public."WishlistItem" USING btree ("userId");


--
-- Name: WishlistItem_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON public."WishlistItem" USING btree ("userId", "productId");


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryLog InventoryLog_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryLog"
    ADD CONSTRAINT "InventoryLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryLog InventoryLog_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryLog"
    ADD CONSTRAINT "InventoryLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderEvent OrderEvent_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderEvent"
    ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductSpec ProductSpec_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductSpec"
    ADD CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WishlistItem WishlistItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rKrMLZO1Rkzpu3bOXR7mEfcX8CXxC0avDJNu7K2yxGpe78bZxMF7O6FjPiDpImE

