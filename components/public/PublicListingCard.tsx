import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Maximize2, Building2 } from "lucide-react";

type PublicListingCardProps = {
  listing: {
    id: string;
    listingNumber: number;
    title: string;
    price: number;
    listingType: string;
    slug: string;
    roomCount: string;
    netSquareMeters: number;
    floorAt: string;
    totalFloor: number;
    district: { name: string };
    neighborhood: { name: string };
    images: { url: string }[];
    createdAt: Date;
  };
};

export default function PublicListingCard({ listing }: PublicListingCardProps) {
  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(listing.price);

  const coverImage = listing.images[0]?.url;

  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="group block bg-white border border-gray-200 hover:border-gold/50 transition-all duration-300 hover:shadow-lg rounded-sm overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] tracking-[0.3em] uppercase px-3 py-1 font-medium ${
              listing.listingType === "sale"
                ? "bg-orange-500 text-white"
                : "bg-teal-500 text-white"
            }`}
          >
            {listing.listingType === "sale" ? "Satılık" : "Kiralık"}
          </span>
        </div>

        {/* Listing number */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] tracking-wider bg-white/80 text-gray-600 px-2 py-1">
            #{listing.listingNumber}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-gold">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="text-[11px] tracking-wider uppercase truncate">
            {listing.district.name} / {listing.neighborhood.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-gray-900 font-serif text-base leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {listing.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-gray-400 text-[11px]">
          <div className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            <span>{listing.roomCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            <span>{listing.netSquareMeters} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>
              {listing.floorAt}. Kat / {listing.totalFloor}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gold font-serif text-lg font-medium">
            {formattedPrice}
          </p>
          {listing.listingType === "rent" && (
            <p className="text-gray-400 text-[10px] tracking-wider mt-0.5">
              /Aylık
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
