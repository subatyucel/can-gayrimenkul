"use server";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
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
      districtGroups,
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
        },
      }),
      prisma.listing.groupBy({
        by: ["districtId"],
        where: { isActive: true },
        _count: { _all: true },
        orderBy: { _count: { districtId: "desc" } },
        take: 5,
      }),
    ]);

    const districtIds = districtGroups
      .map((g) => g.districtId)
      .filter((id): id is number => id !== null);

    const districts = await prisma.district.findMany({
      where: { id: { in: districtIds } },
      select: { id: true, name: true },
    });

    const districtStats = districtGroups.map((group) => ({
      id: group.districtId,
      name:
        districts.find((d) => d.id === group.districtId)?.name || "Bilinmiyor",
      count: group._count._all,
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
