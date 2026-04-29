'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { ActionResponseFactory } from '@/lib/action-response';
import { dashboardListing } from '@/types';
import {
  ListingPayload,
  imageUrlsSchema,
  serverListingSchema,
} from '@/lib/validations/listing';
import { generateUniqueSlug } from '@/lib/helpers';
import { deleteImagesFromCloudinary } from '@/lib/cloudinary/cloudinary-server';

export async function createListing(data: ListingPayload, imageUrls: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ActionResponseFactory.error(
        'Bu işlem için yetkiniz bulunmamaktadır. Lütfen yöneticinizle görüşün!',
      );
    }

    const validatedFields = serverListingSchema.safeParse(data);
    const validatedImages = imageUrlsSchema.safeParse(imageUrls);

    if (!validatedFields.success || !validatedImages.success) {
      return ActionResponseFactory.error(
        'Gönderilen veriler hatalı. Formu uygun formatta doldurun.',
      );
    }

    const validData = validatedFields.data;
    const safeImageUrls = validatedImages.data;

    const slug = await generateUniqueSlug(validData.title);
    const newListing = await prisma.listing.create({
      data: {
        ...validData,
        slug,
        images: { create: safeImageUrls.map((url) => ({ url })) },
        userId: user.id,
      },
    });

    return ActionResponseFactory.success(
      'İlan başarıyla oluşturuldu.',
      newListing,
    );
  } catch (error) {
    console.error('💥💥 createListing action error: ', error);
    return ActionResponseFactory.error('İlan oluşturulurken bir hata oluştu');
  }
}

export async function getDashboardListings() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ActionResponseFactory.error(
        'İlanları görüntüleyebilmek için giriş yapmalısınız.',
      );
    }
    const where = user.role === 'owner' ? {} : { userId: user.id };

    const listings = await prisma.listing.findMany({
      where,
      ...dashboardListing,
      orderBy: { createdAt: 'desc' },
    });
    return ActionResponseFactory.success(
      'İlanlar başarıyla getirildi.',
      listings,
    );
  } catch (error) {
    console.error('💥💥 getDashboardListings action error:', error);
    return ActionResponseFactory.error('İlanlar getirilirken bir hata oluştu.');
  }
}

export async function toggleListingState(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    return ActionResponseFactory.error(
      'Bu işlemi yapabilmek için giriş yapmanız gerekmektedir.',
    );
  }
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { isActive: true, userId: true },
    });

    if (!listing) {
      return ActionResponseFactory.error('İlan bulunamadı.');
    }

    if (user.role !== 'owner' && user.id !== listing.userId) {
      return ActionResponseFactory.error(
        'Bu ilan üzerinde yetkiniz bulunmuyor.',
      );
    }

    await prisma.listing.update({
      where: { id },
      data: { isActive: !listing.isActive },
    });

    revalidatePath('/admin/ilanlar');
    return ActionResponseFactory.success('Başarıyla güncellendi.');
  } catch (error) {
    console.error('💥💥 toggleListingStatus action error: ', error);
    return ActionResponseFactory.error('Durum güncellenirken bir hata oluştu');
  }
}

export async function deleteListing(slug: string) {
  const user = await getCurrentUser();
  if (!user) {
    return ActionResponseFactory.error(
      'Kullanıcı bulunamadı. Lütfen yeniden giriş yapınız.',
    );
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { slug },
      select: { userId: true },
    });
    if (!listing) {
      return ActionResponseFactory.error(
        'İlan bulunamadı. Lütfen sayfayı yenileyip tekrar deneyiniz.',
      );
    }

    if (user.role === 'admin' && listing.userId !== user.id) {
      return ActionResponseFactory.error(
        'Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır!',
      );
    }

    //TODO DELETE IMAGES FROM CLOUDINARY FIRST

    await prisma.listing.delete({ where: { slug } });
    revalidatePath('/admin/ilanlar');
    return ActionResponseFactory.success('İlan başarıyla silindi.');
  } catch (error) {
    console.error('💥💥 deleteListing action error: ', error);
    return ActionResponseFactory.error(
      'İlan silinirken sunucuda bir hata meydana geldi.',
    );
  }
}

export async function getListingBySlug(slug: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!listing) {
      return ActionResponseFactory.error('İlan bulunamadı.');
    }

    return ActionResponseFactory.success(
      'İlanlar başarıyla getirildi',
      listing,
    );
  } catch (error) {
    console.error('💥💥 getListingBySlug action error: ', error);
    return ActionResponseFactory.error('İlan getirilirken bir hata oluştu.');
  }
}

export async function updateListing(
  id: string,
  data: ListingPayload,
  imageUrls: string[],
) {
  try {
    const user = await getCurrentUser();
    const validatedFields = serverListingSchema.safeParse(data);
    const validatedImages = imageUrlsSchema.safeParse(imageUrls);

    if (!validatedFields.success || !validatedImages.success) {
      return ActionResponseFactory.error(
        'Gönderilen veriler hatalı. Formu uygun formatta doldurun.',
      );
    }

    const currentListing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!currentListing || currentListing.userId !== user?.id) {
      return ActionResponseFactory.error(
        'Bu ilanı güncellemek için yetkiniz yok.',
      );
    }

    let slug = currentListing.slug;
    if (currentListing.title !== validatedFields.data.title) {
      slug = await generateUniqueSlug(validatedFields.data.title);
    }

    await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id },
        data: {
          ...validatedFields.data,
          slug,
        },
      });

      await tx.image.deleteMany({
        where: {
          listingId: id,
          url: { notIn: imageUrls },
        },
      });

      const remainingImages = await tx.image.findMany({
        where: { listingId: id },
        select: { url: true },
      });
      const remainingUrls = remainingImages.map((img) => img.url);
      const newUrlsToCreate = imageUrls.filter(
        (url) => !remainingUrls.includes(url),
      );

      if (newUrlsToCreate.length > 0) {
        await tx.image.createMany({
          data: newUrlsToCreate.map((url) => ({
            url,
            listingId: id,
          })),
        });
      }
    });

    const deletedUrls = currentListing.images
      .map((img) => img.url)
      .filter((url) => !imageUrls.includes(url));

    if (deletedUrls.length > 0) {
      await deleteImagesFromCloudinary(deletedUrls);
    }

    revalidatePath('/admin/ilanlar');
    revalidatePath(`/admin/ilanlar/${slug}`);
    return ActionResponseFactory.success('İlan başarıyla güncellendi.');
  } catch (error) {
    console.log('💥💥 updateListing action error: ', error);
    return ActionResponseFactory.error(
      'İlan güncellenirken bir hata meydana geldi.',
    );
  }
}

export async function cleanupOrphanImages(urls: string[]) {
  try {
    if (urls.length > 0) {
      await deleteImagesFromCloudinary(urls);
      console.log('🧹 Orphan images cleaned.');
    }
  } catch (error) {
    console.error('💥💥 Error while cleaning orphan images:', error);
  }
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
        listingType: params.listingType as 'sale' | 'rent',
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
      params.sort === 'oldest'
        ? { createdAt: 'asc' }
        : params.sort === 'price_asc'
          ? { price: 'asc' }
          : params.sort === 'price_desc'
            ? { price: 'desc' }
            : { createdAt: 'desc' },
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

export async function getDistricts() {
  return prisma.district.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}
