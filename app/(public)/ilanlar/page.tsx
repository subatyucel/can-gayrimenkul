import { Suspense } from "react";
import { getPublicListings, getDistricts } from "@/actions/listing";
import PublicListingCard from "@/components/public/PublicListingCard";
import ListingsFilter from "@/components/public/ListingsFilter";
import { Search } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const metadata = {
  title: "İlanlar",
};

export default async function IlanlarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const listingType = sp.tur ?? "";
  const districtId = sp.ilce ? parseInt(sp.ilce) : undefined;
  const neighborhoodId = sp.mahalle ? parseInt(sp.mahalle) : undefined;
  const roomCount = sp.oda ?? "";
  const minPrice = sp.minFiyat ? parseFloat(sp.minFiyat) : undefined;
  const maxPrice = sp.maxFiyat ? parseFloat(sp.maxFiyat) : undefined;
  const sort = sp.sirala ?? "newest";

  const [listings, districts] = await Promise.all([
    getPublicListings({
      listingType: listingType || undefined,
      districtId,
      neighborhoodId,
      roomCount: roomCount || undefined,
      minPrice,
      maxPrice,
      sort,
    }),
    getDistricts(),
  ]);

  const hasFilters =
    listingType ||
    districtId ||
    neighborhoodId ||
    roomCount ||
    minPrice ||
    maxPrice;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-2">
            <p className="text-gold text-[10px] tracking-[0.6em] uppercase">
              Portföy
            </p>
            <h1 className="text-gray-900 font-serif text-3xl md:text-4xl">
              Gayrimenkul İlanları
            </h1>
            <p className="text-gray-400 text-sm">
              {listings.length} ilan listeleniyor
              {hasFilters && (
                <span className="text-gold"> — filtre uygulandı</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <Suspense fallback={null}>
            <ListingsFilter districts={districts} />
          </Suspense>

          {/* Listing grid */}
          <div className="flex-1 min-w-0">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <Search className="h-10 w-10 text-gray-300" />
                <p className="text-gray-500 text-sm">
                  Arama kriterlerinize uygun ilan bulunamadı.
                </p>
                <p className="text-gray-400 text-xs tracking-wider">
                  Filtreleri değiştirerek tekrar deneyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <PublicListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
