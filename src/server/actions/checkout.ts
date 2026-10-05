"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateOrderNumber, formatPhoneTR, isValidTurkishPhone } from "@/lib/utils";

export interface CheckoutState {
  error?: string;
}

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 79.9;

const cartSchema = z
  .array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() }))
  .min(1, "Sepetinizde ürün bulunmuyor.");

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Ad soyad girin."),
  customerEmail: z.string().email("Geçerli bir e-posta girin."),
  customerPhone: z
    .string()
    .refine(isValidTurkishPhone, "Geçerli bir Türk cep telefonu girin (05XX XXX XX XX)."),
  city: z.string().min(2, "Şehir girin."),
  address: z.string().min(10, "Açık adres girin."),
  paymentMethod: z.enum(["COD", "CREDIT_CARD", "TRANSFER"]),
  note: z.string().optional(),
});

interface OrderLine {
  productId: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
}

/** Sepeti siparişe dönüştürür: stok kontrolü + düşüm + olay kaydı. */
export async function createOrderAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsedForm = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    city: formData.get("city"),
    address: formData.get("address"),
    paymentMethod: formData.get("paymentMethod"),
    note: formData.get("note") ?? undefined,
  });
  if (!parsedForm.success) {
    return { error: parsedForm.error.issues[0]?.message ?? "Form bilgileri geçersiz." };
  }

  let rawCart: unknown;
  try {
    rawCart = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return { error: "Sepet verisi okunamadı." };
  }
  const parsedCart = cartSchema.safeParse(rawCart);
  if (!parsedCart.success) {
    return { error: parsedCart.error.issues[0]?.message ?? "Sepet geçersiz." };
  }

  // Sepet kalemlerini güncel ürün/fiyat bilgisiyle eşleştir.
  const products = await prisma.product.findMany({
    where: { id: { in: parsedCart.data.map((l) => l.productId) }, isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const items: OrderLine[] = [];
  for (const line of parsedCart.data) {
    const product = products.find((p) => p.id === line.productId);
    if (!product) return { error: "Sepetinizdeki bir ürün artık mevcut değil." };
    if (product.stock < line.quantity) {
      return { error: `${product.name} için yeterli stok yok (${product.stock} adet).` };
    }
    items.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      imageUrl: product.images[0]?.url ?? null,
      unitPrice: Number(product.price),
      quantity: line.quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const orderNumber = generateOrderNumber();
  const data = parsedForm.data;

  // Giriş yapmış müşterinin siparişi hesabına bağlanır (misafir alışverişi de desteklenir).
  const sessionUser = await getSessionUser();

  try {
    await prisma.$transaction(async (tx) => {
      // Stok düşümü: yarış koşulunu önlemek için koşullu güncelleme.
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) throw new Error("STOCK");
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          status: "PREPARING",
          userId: sessionUser?.id ?? null,
          subtotal,
          shipping,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === "CREDIT_CARD" ? "PAID" : "PENDING",
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: formatPhoneTR(data.customerPhone),
          shippingAddress: `${data.city}, ${data.address}`,
          note: data.note ?? null,
          items: { create: items },
          events: {
            create: [
              { type: "CREATED", status: "PENDING", note: "Sipariş oluşturuldu" },
              { type: "STATUS_CHANGED", status: "PREPARING", note: "Hazırlanıyor" },
            ],
          },
        },
      });

      await tx.inventoryLog.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          change: -item.quantity,
          reason: "Sipariş",
        })),
      });
    });
  } catch (error) {
    if ((error as Error).message === "STOCK") {
      return { error: "Maalesef ürün stokta kalmadı. Lütfen sepetinizi güncelleyin." };
    }
    return { error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin." };
  }

  redirect(`/siparis/${orderNumber}`);
}
