"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface OrderActionState {
  error?: string;
  success?: boolean;
}

const statusSchema = z.enum([
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

/** Sipariş durumunu günceller ve süreç zaman tüneline olay ekler. */
export async function updateOrderStatus(
  orderId: string,
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Bu işlem için yetkiniz bulunmuyor." };

  const parsedStatus = statusSchema.safeParse(formData.get("status"));
  if (!parsedStatus.success) return { error: "Geçersiz sipariş durumu." };

  const note = String(formData.get("note") ?? "").trim() || null;

  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: parsedStatus.data,
          ...(parsedStatus.data === "DELIVERED" ? { paymentStatus: "PAID" } : {}),
        },
      }),
      prisma.orderEvent.create({
        data: {
          orderId,
          type: "STATUS_CHANGED",
          status: parsedStatus.data,
          note,
          createdById: admin.id,
        },
      }),
    ]);
  } catch {
    return { error: "Sipariş durumu güncellenemedi." };
  }

  revalidatePath(`/admin/siparisler/${orderId}`);
  revalidatePath("/admin/siparisler");
  revalidatePath("/admin");
  return { success: true };
}
