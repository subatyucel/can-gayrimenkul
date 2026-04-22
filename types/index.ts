import { Prisma } from '@prisma/client';

type DefaultSearchParams = Record<string, string | string[] | undefined>;

export type NextPageProps<T = DefaultSearchParams> = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<T>;
};

export type ActionResponse<T = void> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export type DistrictDistributionChartData = {
  district: string;
  count: number;
  fill: string;
}[];

export const dashboardListing = {
  select: {
    title: true,
    listingType: true,
    listingNumber: true,
    price: true,
    isActive: true,
    slug: true,
    createdAt: true,
    district: { select: { name: true } },
    neighborhood: { select: { name: true } },
    user: { select: { fullName: true } },
    images: { select: { url: true } },
  },
} satisfies Prisma.ListingFindManyArgs;

export type ListingCardData = Prisma.ListingGetPayload<typeof dashboardListing>;
