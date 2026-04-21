'use server';
import { ActionResponseFactory } from '@/lib/action-response';
import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
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
    console.error('💥💥 Dashboard stats action error: ', error);
    return ActionResponseFactory.error(
      'İstatistikler yüklenirken sunucuda bir hata oluştu.',
    );
  }
}
