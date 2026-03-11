export type District = {
  id: number;
  name: string;
};

export type Neighborhood = {
  id: number;
  name: string;
};

export type ListingImage = {
  id: string;
  url: string;
};

export type BaseListing = {
  id: string;
  title: string;
  price: number;
  listingType: string;
};

export interface DetailedListing extends BaseListing {
  description: string;
  expireDate: Date | string;
  districtId: number;
  neighborhoodId: number;
  roomCount: string;
  netSquareMeters: number;
  grossSquareMeters: number;
  buildingAge: number;
  floorAt: string;
  totalFloor: number;
  bathroomCount: number;
  kitchenType: string;
  heating: string;
  parking: string;
  balcony: boolean;
  elevator: boolean;
  furnished: boolean;
  creditworthy: boolean;
  dues: number;
  images: ListingImage[];
}

export type AdminListing = BaseListing & {
  listingNumber: number;
  isActive: boolean;
  slug: string;
  createdAt: Date;
  district: { name: string };
  neighborhood: { name: string };
  user: { fullName: string };
};

export type RecentListing = {
  id: string;
  title: string;
  price: number;
  listingType: string;
  createdAt: Date;
  slug: string;
};

export type DistrictStat = {
  id: number | null;
  name: string;
  count: number;
};

export type DashboardStats = {
  forSaleTotal: number;
  forSaleActive: number;
  forRentTotal: number;
  forRentActive: number;
  listedThisMonth: number;
  recentListings: RecentListing[];
  districtStats: DistrictStat[];
};
