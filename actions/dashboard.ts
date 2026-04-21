'use server';
import { ActionResponseFactory } from '@/lib/action-response';
import { prisma } from '@/lib/prisma';

export async function getListingStats() {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      addedThisMonthCount,
      forSaleActiveCount,
      forSaleTotalCount,
      forRentActiveCount,
      forRentTotalCount,
    ] = await Promise.all([
      prisma.listing.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.listing.count({ where: { listingType: 'sale', isActive: true } }),
      prisma.listing.count({ where: { listingType: 'sale' } }),
      prisma.listing.count({ where: { listingType: 'rent', isActive: true } }),
      prisma.listing.count({ where: { listingType: 'rent' } }),
    ]);

    const data = {
      totalListingsCount: forSaleTotalCount + forRentTotalCount,
      addedThisMonthCount: addedThisMonthCount,
      activeListingsCount: forSaleActiveCount + forRentActiveCount,
      forSaleTotalCount: forSaleTotalCount,
      forSaleActiveCount: forSaleActiveCount,
      forRentTotalCount: forRentTotalCount,
      forRentActiveCount: forRentActiveCount,
    };

    return ActionResponseFactory.success(
      'İstatistikler başarıyla getirildi.',
      data,
    );
  } catch (error) {
    console.error('💥💥 getListingStats action error: ', error);
    return ActionResponseFactory.error(
      'İstatistikler yüklenirken sunucuda bir hata oluştu.',
    );
  }
}

export async function getListingCountGroupedByDistrict() {
  try {
    const topDistricts = await prisma.district.findMany({
      take: 5,
      orderBy: { listings: { _count: 'desc' } },
      select: {
        name: true,
        _count: { select: { listings: { where: { isActive: true } } } },
      },
    });

    const data = topDistricts.map((district) => ({
      district: district.name,
      count: district._count.listings,
    }));

    return ActionResponseFactory.success(
      'İlçe dağılım verileri başarıyla getirildi.',
      data,
    );
  } catch (error) {
    console.error('💥💥 getDistrictDistributionStats action error: ', error);
    return ActionResponseFactory.error(
      'İstatistikler yüklenirken sunucuda bir hata oluştu.',
    );
  }
}
