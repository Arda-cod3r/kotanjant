import { prisma } from "@/lib/prisma";
import type { OrderDTO, OrderItemDTO, OrderEventDTO, OrderStatus } from "@/lib/types";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  userId: string | null;
  subtotal: unknown;
  shipping: unknown;
  discount: unknown;
  total: unknown;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: {
    id: string;
    productId: string | null;
    name: string;
    sku: string;
    imageUrl: string | null;
    unitPrice: unknown;
    quantity: number;
  }[];
  events?: {
    id: string;
    status: OrderStatus | null;
    note: string | null;
    type: "CREATED" | "STATUS_CHANGED" | "NOTE";
    createdAt: Date;
  }[];
};

const n = (value: unknown) => Number(value);

export function toOrderDTO(order: OrderRow): OrderDTO {
  const items: OrderItemDTO[] = (order.items ?? []).map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    sku: item.sku,
    imageUrl: item.imageUrl,
    unitPrice: n(item.unitPrice),
    quantity: item.quantity,
    lineTotal: n(item.unitPrice) * item.quantity,
  }));

  const events: OrderEventDTO[] = (order.events ?? [])
    .map((event) => ({
      id: event.id,
      status: event.status,
      note: event.note,
      type: event.type,
      createdAt: event.createdAt.toISOString(),
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    userId: order.userId,
    subtotal: n(order.subtotal),
    shipping: n(order.shipping),
    discount: n(order.discount),
    total: n(order.total),
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    note: order.note,
    items,
    events,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

/** Veritabanı erişilemezse boş sonuç döner (panel çökmesin). */
async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.warn("[orders] Veritabanı erişilemedi:", (error as Error).message);
    return fallback;
  }
}

export async function getOrders(status?: OrderStatus): Promise<OrderDTO[]> {
  return safe(async () => {
    const rows = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: true },
    });
    return (rows as unknown as OrderRow[]).map(toOrderDTO);
  }, []);
}

export async function getOrderById(id: string): Promise<OrderDTO | null> {
  return safe(async () => {
    const row = await prisma.order.findUnique({
      where: { id },
      include: { items: true, events: true },
    });
    return row ? toOrderDTO(row as unknown as OrderRow) : null;
  }, null);
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDTO | null> {
  return safe(async () => {
    const row = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, events: true },
    });
    return row ? toOrderDTO(row as unknown as OrderRow) : null;
  }, null);
}

/**
 * Bir müşterinin siparişleri. Hem üyelik ile (`userId`) hem de aynı e-posta ile
 * verilmiş misafir siparişleri birlikte listelenir; böylece kullanıcı üye olmadan
 * önce verdiği siparişleri de hesabında görebilir.
 */
export async function getOrdersForUser(user: {
  id: string;
  email: string;
}): Promise<OrderDTO[]> {
  return safe(async () => {
    const rows = await prisma.order.findMany({
      where: { OR: [{ userId: user.id }, { customerEmail: user.email }] },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return (rows as unknown as OrderRow[]).map(toOrderDTO);
  }, []);
}

/** Müşteri sipariş detayı: yalnızca kendi siparişine erişebilir. */
export async function getCustomerOrder(
  id: string,
  user: { id: string; email: string },
): Promise<OrderDTO | null> {
  return safe(async () => {
    const row = await prisma.order.findFirst({
      where: { id, OR: [{ userId: user.id }, { customerEmail: user.email }] },
      include: { items: true, events: true },
    });
    return row ? toOrderDTO(row as unknown as OrderRow) : null;
  }, null);
}

export interface DashboardStats {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  lowStockProducts: { id: string; name: string; slug: string; stock: number }[];
  recentOrders: OrderDTO[];
  salesByDay: { date: string; total: number }[];
}

const EMPTY_STATUS: Record<OrderStatus, number> = {
  PENDING: 0,
  PREPARING: 0,
  SHIPPED: 0,
  DELIVERED: 0,
  CANCELLED: 0,
  REFUNDED: 0,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  return safe(
    async () => {
      const since = new Date();
      since.setDate(since.getDate() - 29);

      const [orders, statusGroups, lowStockRows, recentRows] = await Promise.all([
        prisma.order.findMany({
          where: { createdAt: { gte: since }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
          select: { total: true, createdAt: true },
        }),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.product.findMany({
          where: { isActive: true, stock: { lte: 5 } },
          orderBy: { stock: "asc" },
          take: 6,
          select: { id: true, name: true, slug: true, stock: true },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { items: true },
        }),
      ]);

      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const orderCount = orders.length;

      const salesMap = new Map<string, number>();
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        salesMap.set(d.toISOString().slice(0, 10), 0);
      }
      for (const order of orders) {
        const key = order.createdAt.toISOString().slice(0, 10);
        if (salesMap.has(key)) salesMap.set(key, (salesMap.get(key) ?? 0) + Number(order.total));
      }

      const statusCounts = { ...EMPTY_STATUS };
      for (const group of statusGroups) {
        statusCounts[group.status] = group._count._all;
      }

      return {
        totalRevenue,
        orderCount,
        averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
        statusCounts,
        lowStockProducts: lowStockRows,
        recentOrders: (recentRows as unknown as OrderRow[]).map(toOrderDTO),
        salesByDay: [...salesMap.entries()].map(([date, total]) => ({ date, total })),
      };
    },
    {
      totalRevenue: 0,
      orderCount: 0,
      averageOrderValue: 0,
      statusCounts: { ...EMPTY_STATUS },
      lowStockProducts: [],
      recentOrders: [],
      salesByDay: [],
    },
  );
}
