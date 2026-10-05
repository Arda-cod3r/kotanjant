// Uygulama genelinde kullanılan paylaşılan tipler (DTO katmanı).
// Prisma'nın Decimal gibi serialize edilemeyen tipleri burada düz JS
// tiplerine (number) çevrilir; böylece Server -> Client aktarımı güvenlidir.

export type Role = "CUSTOMER" | "ADMIN" | "SUPERADMIN";

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Ödeme Bekliyor",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

/** Admin panelindeki sürüklenebilir süreç adımları */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
];

export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSpecDTO {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface ProductCategoryDTO {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDesc: string | null;
  description: string;
  price: number;
  comparePrice: number | null;
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
  category: ProductCategoryDTO | null;
  brandId: string | null;
  brandName: string | null;
  tags: string[];
  images: ProductImageDTO[];
  specs: ProductSpecDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  id: string;
  productId: string | null;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderEventDTO {
  id: string;
  status: OrderStatus | null;
  note: string | null;
  type: "CREATED" | "STATUS_CHANGED" | "NOTE";
  createdAt: string;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  userId: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  note: string | null;
  items: OrderItemDTO[];
  events: OrderEventDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  productCount?: number;
}

/** Ana sayfa hero slider slaytı (mağaza + yönetim paneli). */
export interface HeroSlideDTO {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta: string;
  sortOrder: number;
  isActive: boolean;
}

/** Sepet/favori tarafında kullanılan hafif ürün görünümü (client store). */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  sku: string;
  quantity: number;
  stock: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** Cinsiyet (opsiyonel profil alanı) */
export type Gender = "UNSPECIFIED" | "MALE" | "FEMALE" | "OTHER";

export const GENDER_LABELS: Record<Gender, string> = {
  UNSPECIFIED: "Belirtmek istemiyorum",
  MALE: "Erkek",
  FEMALE: "Kadın",
  OTHER: "Diğer",
};

export interface AddressDTO {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  line1: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  tcKimlik: string | null;
  birthDate: string | null; // ISO (yyyy-mm-dd)
  gender: Gender;
  emailOptIn: boolean;
  smsOptIn: boolean;
  whatsappOptIn: boolean;
  createdAt: string;
}
