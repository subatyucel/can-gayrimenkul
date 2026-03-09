"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./settings";
import slugify from "slugify";

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

export async function getDistricts() {
  return prisma.district.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getNeighborhoods(districtId: number) {
  return prisma.neighborhood.findMany({
    where: { districtId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function createListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum bulunamadı! Lütfen yeniden giriş yapın." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = parseFloat(formData.get("price") as string);
  const listingType = formData.get("listingType") as string;
  const roomCount = formData.get("roomCount") as string;
  const netSquareMeters = parseInt(formData.get("netSquareMeters") as string);
  const grossSquareMeters = parseInt(
    formData.get("grossSquareMeters") as string,
  );
  const buildingAge = parseInt(formData.get("buildingAge") as string);
  const floorAt = formData.get("floorAt") as string;
  const totalFloor = parseInt(formData.get("totalFloor") as string);
  const bathroomCount = parseInt(formData.get("bathroomCount") as string);
  const kitchenType = formData.get("kitchenType") as string;
  const balcony = formData.get("balcony") === "on";
  const elevator = formData.get("elevator") === "on";
  const parking = formData.get("parking") as string;
  const furnished = formData.get("furnished") === "on";
  const dues = parseInt(formData.get("dues") as string) || 0;
  const creditworthy = formData.get("creditworthy") === "on";
  const heating = formData.get("heating") as string;
  const districtId = parseInt(formData.get("districtId") as string);
  const neighborhoodId = parseInt(formData.get("neighborhoodId") as string);
  const expireDate = new Date(formData.get("expireDate") as string);

  if (
    !title ||
    !description ||
    !listingType ||
    !roomCount ||
    !kitchenType ||
    !parking ||
    !heating ||
    !floorAt
  ) {
    return { error: "Lütfen tüm zorunlu alanları doldurun!" };
  }

  if (isNaN(price) || price <= 0) return { error: "Geçerli bir fiyat girin!" };
  if (isNaN(districtId) || isNaN(neighborhoodId))
    return { error: "İlçe ve mahalle seçin!" };
  if (isNaN(netSquareMeters) || isNaN(grossSquareMeters))
    return { error: "Geçerli metrekare değerleri girin!" };
  if (isNaN(expireDate.getTime()))
    return { error: "Geçerli bir son yayın tarihi girin!" };

  const baseSlug = slugify(title, { lower: true, strict: true, locale: "tr" });

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        listingType: listingType as "sale" | "rent",
        roomCount,
        netSquareMeters,
        grossSquareMeters,
        buildingAge,
        floorAt,
        totalFloor,
        bathroomCount,
        kitchenType,
        balcony,
        elevator,
        parking,
        furnished,
        dues,
        creditworthy,
        heating,
        slug: baseSlug,
        expireDate,
        districtId,
        neighborhoodId,
        userId: user.id,
      },
      select: { id: true, listingNumber: true },
    });

    await prisma.listing.update({
      where: { id: listing.id },
      data: { slug: `${baseSlug}-${listing.listingNumber}` },
    });
  } catch {
    return { error: "İlan oluşturulurken bir hata oluştu!" };
  }

  revalidatePath("/admin/ilanlar");
  return { success: true };
}
