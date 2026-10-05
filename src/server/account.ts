import { prisma } from "@/lib/prisma";
import type { AddressDTO, Gender, UserProfileDTO } from "@/lib/types";

/** Müşteri hesabı için tam profil bilgisi (yeni alanlar dahil). */
export async function getUserProfile(id: string): Promise<UserProfileDTO | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        tcKimlik: true,
        birthDate: true,
        gender: true,
        emailOptIn: true,
        smsOptIn: true,
        whatsappOptIn: true,
        createdAt: true,
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tcKimlik: user.tcKimlik,
      birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : null,
      gender: user.gender as Gender,
      emailOptIn: user.emailOptIn,
      smsOptIn: user.smsOptIn,
      whatsappOptIn: user.whatsappOptIn,
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    console.warn("[account] Profil okunamadı:", (error as Error).message);
    return null;
  }
}

/** Kullanıcının kayıtlı adresleri (varsayılan en üstte). */
export async function getAddresses(userId: string): Promise<AddressDTO[]> {
  try {
    const rows = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return rows.map((a) => ({
      id: a.id,
      title: a.title,
      fullName: a.fullName,
      phone: a.phone,
      city: a.city,
      district: a.district,
      line1: a.line1,
      postalCode: a.postalCode,
      isDefault: a.isDefault,
    }));
  } catch (error) {
    console.warn("[account] Adresler okunamadı:", (error as Error).message);
    return [];
  }
}
