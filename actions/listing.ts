"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { cloudinary } from "@/lib/cloudinary";
import { getCurrentUser } from "./auth";

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

export async function getPublicListings(
  params: {
    listingType?: string;
    districtId?: number;
    neighborhoodId?: number;
    roomCount?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  } = {},
) {
  const now = new Date();

  return prisma.listing.findMany({
    where: {
      isActive: true,
      expireDate: { gte: now },
      ...(params.listingType && {
        listingType: params.listingType as "sale" | "rent",
      }),
      ...(params.districtId && { districtId: params.districtId }),
      ...(params.neighborhoodId && { neighborhoodId: params.neighborhoodId }),
      ...(params.roomCount && { roomCount: params.roomCount }),
      ...((params.minPrice || params.maxPrice) && {
        price: {
          ...(params.minPrice && { gte: params.minPrice }),
          ...(params.maxPrice && { lte: params.maxPrice }),
        },
      }),
    },
    select: {
      id: true,
      listingNumber: true,
      title: true,
      price: true,
      listingType: true,
      slug: true,
      roomCount: true,
      netSquareMeters: true,
      floorAt: true,
      totalFloor: true,
      district: { select: { name: true } },
      neighborhood: { select: { name: true } },
      images: { select: { url: true }, take: 1 },
      createdAt: true,
    },
    orderBy:
      params.sort === "oldest"
        ? { createdAt: "asc" }
        : params.sort === "price_asc"
          ? { price: "asc" }
          : params.sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
  });
}

export async function getPublicListingBySlug(slug: string) {
  const now = new Date();

  return prisma.listing.findFirst({
    where: { slug, isActive: true, expireDate: { gte: now } },
    select: {
      id: true,
      listingNumber: true,
      title: true,
      description: true,
      price: true,
      listingType: true,
      slug: true,
      roomCount: true,
      netSquareMeters: true,
      grossSquareMeters: true,
      buildingAge: true,
      floorAt: true,
      totalFloor: true,
      bathroomCount: true,
      kitchenType: true,
      heating: true,
      parking: true,
      balcony: true,
      elevator: true,
      furnished: true,
      creditworthy: true,
      dues: true,
      expireDate: true,
      createdAt: true,
      district: { select: { name: true } },
      neighborhood: { select: { name: true } },
      images: { select: { id: true, url: true } },
      user: { select: { fullName: true } },
    },
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

  // Cloudinary'deki fotoğrafları sil
  await cloudinary.api
    .delete_resources_by_prefix(`listings/${listingId}`)
    .catch(() => {});
  await cloudinary.api.delete_folder(`listings/${listingId}`).catch(() => {});

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

export async function getListingBySlug(slug: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const where = user.role === "owner" ? { slug } : { slug, userId: user.id };

  return prisma.listing.findFirst({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      listingType: true,
      expireDate: true,
      districtId: true,
      neighborhoodId: true,
      roomCount: true,
      netSquareMeters: true,
      grossSquareMeters: true,
      buildingAge: true,
      floorAt: true,
      totalFloor: true,
      bathroomCount: true,
      kitchenType: true,
      heating: true,
      parking: true,
      balcony: true,
      elevator: true,
      furnished: true,
      creditworthy: true,
      dues: true,
      images: { select: { id: true, url: true } },
    },
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

  // Fotoğrafları al ve doğrula
  const images = formData.getAll("images") as File[];
  const validImages = images.filter((f) => f.size > 0);

  if (validImages.length === 0) {
    return { error: "En az bir fotoğraf yüklemelisiniz!" };
  }

  if (validImages.length > 10) {
    return { error: "En fazla 10 fotoğraf yükleyebilirsiniz!" };
  }

  for (const img of validImages) {
    if (img.size > 5 * 1024 * 1024) {
      return { error: "Her fotoğraf en fazla 5 MB olabilir!" };
    }
    if (!img.type.startsWith("image/")) {
      return { error: "Sadece görsel dosyaları yükleyebilirsiniz!" };
    }
  }

  const baseSlug = slugify(title, { lower: true, strict: true, locale: "tr" });

  try {
    // İlanı oluştur
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

    // Slug'ı listingNumber ile güncelle
    await prisma.listing.update({
      where: { id: listing.id },
      data: { slug: `${baseSlug}-${listing.listingNumber}` },
    });

    // Fotoğrafları Cloudinary'ye yükle
    const imageUrls: string[] = [];

    for (const file of validImages) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `listings/${listing.id}`,
                resource_type: "image",
              },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve(result);
              },
            )
            .end(buffer);
        },
      );

      imageUrls.push(result.secure_url);
    }

    // Image kayıtlarını veritabanına ekle
    await prisma.image.createMany({
      data: imageUrls.map((url) => ({
        url,
        listingId: listing.id,
      })),
    });
  } catch (e) {
    console.log("İlan oluştururken bir hata", e);
    return { error: "İlan oluşturulurken bir hata oluştu!" };
  }

  revalidatePath("/admin/ilanlar");
  return { success: true };
}

function extractCloudinaryPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : "";
}

export async function updateListing(listingId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Oturum bulunamadı! Lütfen yeniden giriş yapın." };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing) return { error: "İlan bulunamadı!" };

  if (user.role === "admin" && listing.userId !== user.id) {
    return { error: "Bu ilanı düzenleme yetkiniz bulunmamaktadır!" };
  }

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

  try {
    // Silinecek fotoğrafları işle
    const deletedImageIds = formData.getAll("deletedImageId") as string[];
    if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.image.findMany({
        where: { id: { in: deletedImageIds }, listingId },
        select: { id: true, url: true },
      });

      for (const img of imagesToDelete) {
        const publicId = extractCloudinaryPublicId(img.url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(() => {});
        }
      }

      await prisma.image.deleteMany({
        where: { id: { in: deletedImageIds } },
      });
    }

    // Yeni fotoğrafları yükle
    const newImages = formData.getAll("images") as File[];
    const validNewImages = newImages.filter((f) => f.size > 0);

    if (validNewImages.length > 0) {
      for (const img of validNewImages) {
        if (img.size > 5 * 1024 * 1024) {
          return { error: "Her fotoğraf en fazla 5 MB olabilir!" };
        }
        if (!img.type.startsWith("image/")) {
          return { error: "Sadece görsel dosyaları yükleyebilirsiniz!" };
        }
      }

      const remainingCount = await prisma.image.count({
        where: { listingId },
      });
      if (remainingCount + validNewImages.length > 10) {
        return { error: "En fazla 10 fotoğraf yükleyebilirsiniz!" };
      }

      const imageUrls: string[] = [];
      for (const file of validNewImages) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string }>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: `listings/${listingId}`, resource_type: "image" },
                (error, result) => {
                  if (error || !result) reject(error);
                  else resolve(result);
                },
              )
              .end(buffer);
          },
        );

        imageUrls.push(result.secure_url);
      }

      await prisma.image.createMany({
        data: imageUrls.map((url) => ({ url, listingId })),
      });
    }

    // En az 1 fotoğraf kaldığını doğrula
    const totalImages = await prisma.image.count({ where: { listingId } });
    if (totalImages === 0) {
      return { error: "En az bir fotoğraf olmalıdır!" };
    }

    await prisma.listing.update({
      where: { id: listingId },
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
        expireDate,
        districtId,
        neighborhoodId,
      },
    });
  } catch {
    return { error: "İlan güncellenirken bir hata oluştu!" };
  }

  revalidatePath("/admin/ilanlar");
  return { success: true };
}
