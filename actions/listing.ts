'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { cloudinary } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/auth';
import { ActionResponseFactory } from '@/lib/action-response';
import { dashboardListing } from '@/types';

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
    console.error('getListings action error:', error);
    return ActionResponseFactory.error('İlanlar getirilirken bir hata oluştu.');
  }
}

export async function toggleListingState(slug: string) {
  const user = await getCurrentUser();
  if (!user) {
    return ActionResponseFactory.error(
      'Bu işlemi yapabilmek için giriş yapmanız gerekmektedir.',
    );
  }
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug },
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
      where: { slug },
      data: { isActive: !listing.isActive },
    });

    revalidatePath('/admin/ilanlar');
    return ActionResponseFactory.success('Başarıyla güncellendi.');
  } catch (error) {
    console.error('💥💥 toggleListingStatus action error: ', error);
    return ActionResponseFactory.error('Durum güncellenirken bir hata oluştu');
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

export async function deleteListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user)
    return { error: 'Kullanıcı bulunamadı! Lütfen yeniden giriş yapınız.' };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing) return { error: 'İlan bulunamadı!' };

  if (user.role === 'admin' && listing.userId !== user.id) {
    return { error: 'Bu ilanı silme yetkiniz bulunmamaktadır!' };
  }

  await cloudinary.api
    .delete_resources_by_prefix(`listings/${listingId}`)
    .catch(() => {});
  await cloudinary.api.delete_folder(`listings/${listingId}`).catch(() => {});

  await prisma.listing.delete({ where: { id: listingId } });

  revalidatePath('/admin/ilanlar');
  return { success: true };
}

export async function getDistricts() {
  return prisma.district.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export async function getNeighborhoods(districtId: number) {
  return prisma.neighborhood.findMany({
    where: { districtId },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export async function getListingBySlug(slug: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const where = user.role === 'owner' ? { slug } : { slug, userId: user.id };

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

// function parseListingFormData(formData: FormData): ListingFields {
//   return {
//     title: (formData.get('title') as string)?.trim(),
//     description: (formData.get('description') as string)?.trim(),
//     price: parseFloat(formData.get('price') as string),
//     listingType: formData.get('listingType') as string,
//     roomCount: formData.get('roomCount') as string,
//     netSquareMeters: parseInt(formData.get('netSquareMeters') as string),
//     grossSquareMeters: parseInt(formData.get('grossSquareMeters') as string),
//     buildingAge: parseInt(formData.get('buildingAge') as string),
//     floorAt: formData.get('floorAt') as string,
//     totalFloor: parseInt(formData.get('totalFloor') as string),
//     bathroomCount: parseInt(formData.get('bathroomCount') as string),
//     kitchenType: formData.get('kitchenType') as string,
//     balcony: formData.get('balcony') === 'on',
//     elevator: formData.get('elevator') === 'on',
//     parking: formData.get('parking') as string,
//     furnished: formData.get('furnished') === 'on',
//     dues: parseInt(formData.get('dues') as string) || 0,
//     creditworthy: formData.get('creditworthy') === 'on',
//     heating: formData.get('heating') as string,
//     districtId: parseInt(formData.get('districtId') as string),
//     neighborhoodId: parseInt(formData.get('neighborhoodId') as string),
//     expireDate: new Date(formData.get('expireDate') as string),
//   };
// }

// function validateListingFields(data: ListingFields): string | null {
//   if (
//     !data.title ||
//     !data.description ||
//     !data.listingType ||
//     !data.roomCount ||
//     !data.kitchenType ||
//     !data.parking ||
//     !data.heating ||
//     !data.floorAt
//   ) {
//     return 'Lütfen tüm zorunlu alanları doldurun!';
//   }
//   if (isNaN(data.price) || data.price <= 0) return 'Geçerli bir fiyat girin!';
//   if (isNaN(data.districtId) || isNaN(data.neighborhoodId))
//     return 'İlçe ve mahalle seçin!';
//   if (isNaN(data.netSquareMeters) || isNaN(data.grossSquareMeters))
//     return 'Geçerli metrekare değerleri girin!';
//   if (isNaN(data.expireDate.getTime()))
//     return 'Geçerli bir son yayın tarihi girin!';
//   return null;
// }

async function uploadImageToCloudinary(
  file: File,
  folder: string,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        })
        .end(buffer);
    },
  );
  return result.secure_url;
}

function extractCloudinaryPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : '';
}

export async function createListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Oturum bulunamadı! Lütfen yeniden giriş yapın.' };

  const fields = parseListingFormData(formData);
  const validationError = validateListingFields(fields);
  if (validationError) return { error: validationError };

  const images = formData.getAll('images') as File[];
  const validImages = images.filter((f) => f.size > 0);

  if (validImages.length === 0)
    return { error: 'En az bir fotoğraf yüklemelisiniz!' };
  if (validImages.length > 10)
    return { error: 'En fazla 10 fotoğraf yükleyebilirsiniz!' };

  for (const img of validImages) {
    if (img.size > 5 * 1024 * 1024)
      return { error: 'Her fotoğraf en fazla 5 MB olabilir!' };
    if (!img.type.startsWith('image/'))
      return { error: 'Sadece görsel dosyaları yükleyebilirsiniz!' };
  }

  const baseSlug = slugify(fields.title, {
    lower: true,
    strict: true,
    locale: 'tr',
  });

  try {
    const listing = await prisma.listing.create({
      data: {
        ...fields,
        listingType: fields.listingType as 'sale' | 'rent',
        slug: baseSlug,
        userId: user.id,
      },
      select: { id: true, listingNumber: true },
    });

    await prisma.listing.update({
      where: { id: listing.id },
      data: { slug: `${baseSlug}-${listing.listingNumber}` },
    });

    const imageUrls = await Promise.all(
      validImages.map((file) =>
        uploadImageToCloudinary(file, `listings/${listing.id}`),
      ),
    );

    await prisma.image.createMany({
      data: imageUrls.map((url) => ({ url, listingId: listing.id })),
    });
  } catch {
    return { error: 'İlan oluşturulurken bir hata oluştu!' };
  }

  revalidatePath('/admin/ilanlar');
  return { success: true };
}

// export async function updateListing(listingId: string, formData: FormData) {
//   const user = await getCurrentUser();
//   if (!user) return { error: 'Oturum bulunamadı! Lütfen yeniden giriş yapın.' };

//   const listing = await prisma.listing.findUnique({
//     where: { id: listingId },
//     select: { userId: true },
//   });

//   if (!listing) return { error: 'İlan bulunamadı!' };
//   if (user.role === 'admin' && listing.userId !== user.id) {
//     return { error: 'Bu ilanı düzenleme yetkiniz bulunmamaktadır!' };
//   }

//   const fields = parseListingFormData(formData);
//   const validationError = validateListingFields(fields);
//   if (validationError) return { error: validationError };

//   try {
//     const deletedImageIds = formData.getAll('deletedImageId') as string[];
//     if (deletedImageIds.length > 0) {
//       const imagesToDelete = await prisma.image.findMany({
//         where: { id: { in: deletedImageIds }, listingId },
//         select: { id: true, url: true },
//       });

//       await Promise.all(
//         imagesToDelete.map((img) => {
//           const publicId = extractCloudinaryPublicId(img.url);
//           return publicId
//             ? cloudinary.uploader.destroy(publicId).catch(() => {})
//             : Promise.resolve();
//         }),
//       );

//       await prisma.image.deleteMany({ where: { id: { in: deletedImageIds } } });
//     }

//     const validNewImages = (formData.getAll('images') as File[]).filter(
//       (f) => f.size > 0,
//     );

//     if (validNewImages.length > 0) {
//       for (const img of validNewImages) {
//         if (img.size > 5 * 1024 * 1024)
//           return { error: 'Her fotoğraf en fazla 5 MB olabilir!' };
//         if (!img.type.startsWith('image/'))
//           return { error: 'Sadece görsel dosyaları yükleyebilirsiniz!' };
//       }

//       const remainingCount = await prisma.image.count({ where: { listingId } });
//       if (remainingCount + validNewImages.length > 10)
//         return { error: 'En fazla 10 fotoğraf yükleyebilirsiniz!' };

//       const imageUrls = await Promise.all(
//         validNewImages.map((file) =>
//           uploadImageToCloudinary(file, `listings/${listingId}`),
//         ),
//       );

//       await prisma.image.createMany({
//         data: imageUrls.map((url) => ({ url, listingId })),
//       });
//     }

//     const totalImages = await prisma.image.count({ where: { listingId } });
//     if (totalImages === 0) return { error: 'En az bir fotoğraf olmalıdır!' };

//     await prisma.listing.update({
//       where: { id: listingId },
//       data: {
//         ...fields,
//         listingType: fields.listingType as 'sale' | 'rent',
//       },
//     });
//   } catch {
//     return { error: 'İlan güncellenirken bir hata oluştu!' };
//   }

//   revalidatePath('/admin/ilanlar');
//   return { success: true };
// }
