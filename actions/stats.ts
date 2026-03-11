"use server";
import { prisma } from "@/lib/prisma";
import type { DashboardStats, DistrictStat } from "@/types/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  try {
    const [
      forSaleTotal,
      forSaleActive,
      forRentTotal,
      forRentActive,
      listedThisMonth,
      recentListings,
      districtResults,
    ] = await Promise.all([
      prisma.listing.count({ where: { listingType: "sale" } }),
      prisma.listing.count({ where: { listingType: "sale", isActive: true } }),
      prisma.listing.count({ where: { listingType: "rent" } }),
      prisma.listing.count({ where: { listingType: "rent", isActive: true } }),
      prisma.listing.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.listing.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          listingType: true,
          createdAt: true,
          slug: true,
        },
      }),
      prisma.district.findMany({
        where: { listings: { some: { isActive: true } } },
        select: {
          id: true,
          name: true,
          _count: { select: { listings: { where: { isActive: true } } } },
        },
        orderBy: { listings: { _count: "desc" } },
        take: 5,
      }),
    ]);

    const districtStats: DistrictStat[] = districtResults.map((d) => ({
      id: d.id,
      name: d.name,
      count: d._count.listings,
    }));

    return {
      forSaleTotal,
      forSaleActive,
      forRentTotal,
      forRentActive,
      listedThisMonth,
      recentListings,
      districtStats,
    };
  } catch (error) {
    console.error("Error while fetching statistics!: \n", error);
    return {
      forSaleTotal: 0,
      forSaleActive: 0,
      forRentTotal: 0,
      forRentActive: 0,
      listedThisMonth: 0,
      recentListings: [],
      districtStats: [],
    };
  }
}
