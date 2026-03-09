"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./settings";

export async function getListings() {
  const user = await getCurrentUser();

  if (!user) return [];

  const where = user.role === "owner" ? {} : { userId: user.id };

  return prisma.listing.findMany({
    where,
    select: {
      id: true,
      listingNumber: true,
      title: true,
      price: true,
      description: true,
      listingType: true,
      isActive: true,
      slug: true,
      district: { select: { name: true } },
      neighborhood: { select: { name: true } },
      user: { select: { fullName: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user)
    return { error: "Kullanıcı bulunamadı! Lütfen yeniden giriş yapınız." };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing) return { error: "İlan bulunamadı!" };

  if (user.role === "admin" && listing.userId !== user.id) {
    return { error: "Bu ilanı silme yetkiniz bulunmamaktadır!" };
  }

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath("/admin/ilanlar");
  return { success: true };
}

export async function toggleListingStatus(listingId: string) {
  const user = await getCurrentUser();

  if (!user)
    return { error: "Kullanıcı bulunamadı! Lütfen yeniden giriş yapınız" };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true, isActive: true },
  });

  if (!listing) return { error: "İlan bulunamadı!" };

  if (user.role === "admin" && listing.userId !== user.id) {
    return { error: "Bu ilan üzerinde yetkiniz bulunmamaktadır!" };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { isActive: !listing.isActive },
  });

  revalidatePath("/admin/ilanlar");
  return { success: true };
}
