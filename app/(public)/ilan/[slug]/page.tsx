import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Maximize2,
  Building2,
  Layers,
  Droplets,
  Flame,
  Car,
  ChefHat,
  CalendarDays,
  Phone,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Hash,
} from "lucide-react";
import { getPublicListingBySlug } from "@/actions/listing";
import ListingGallery from "@/components/public/ListingGallery";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);
  if (!listing) return { title: "İlan Bulunamadı | Can Gayrimenkul" };
  return {
    title: `${listing.title} | Can Gayrimenkul`,
    description: listing.description.slice(0, 155),
  };
}

export default async function IlanDetayPage({ params }: { params: Params }) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);

  if (!listing) notFound();

  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(listing.price);

  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(listing.createdAt));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 tracking-wide">
            <Link href="/" className="hover:text-[#c5a059] transition-colors">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/ilanlar"
              className="hover:text-[#c5a059] transition-colors"
            >
              İlanlar
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-600 truncate max-w-50">
              {listing.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Title row */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] tracking-[0.3em] uppercase px-3 py-1 font-medium text-white ${
                listing.listingType === "sale" ? "bg-orange-500" : "bg-teal-500"
              }`}
            >
              {listing.listingType === "sale" ? "Satılık" : "Kiralık"}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-[11px]">
              <Hash className="h-3 w-3" />
              {listing.listingNumber}
            </span>
          </div>
          <h1 className="text-gray-900 font-serif text-2xl md:text-3xl leading-snug">
            {listing.title}
          </h1>
          <div className="flex items-center gap-1.5 text-[#c5a059] text-sm">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {listing.district.name} / {listing.neighborhood.name}
            </span>
          </div>
        </div>

        {/* Main content: gallery + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <ListingGallery images={listing.images} title={listing.title} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Price card */}
            <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
              <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-1">
                {listing.listingType === "sale" ? "Satış Fiyatı" : "Aylık Kira"}
              </p>
              <p className="text-[#c5a059] font-serif text-3xl font-semibold">
                {formattedPrice}
              </p>
              {listing.dues > 0 && (
                <p className="text-gray-400 text-xs mt-1.5">
                  Aidat:{" "}
                  <span className="text-gray-600 font-medium">
                    {listing.dues.toLocaleString("tr-TR")} ₺
                  </span>
                </p>
              )}
            </div>

            {/* Key stats */}
            <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
              <h2 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-4">
                Temel Bilgiler
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <StatItem
                  icon={<BedDouble className="h-4 w-4" />}
                  label="Oda Sayısı"
                  value={listing.roomCount}
                />
                <StatItem
                  icon={<Maximize2 className="h-4 w-4" />}
                  label="Net / Brüt m²"
                  value={`${listing.netSquareMeters} / ${listing.grossSquareMeters}`}
                />
                <StatItem
                  icon={<Layers className="h-4 w-4" />}
                  label="Bulunduğu Kat"
                  value={`${listing.floorAt}. Kat / ${listing.totalFloor}`}
                />
                <StatItem
                  icon={<Building2 className="h-4 w-4" />}
                  label="Bina Yaşı"
                  value={
                    listing.buildingAge === 0
                      ? "Sıfır Bina"
                      : `${listing.buildingAge} Yıl`
                  }
                />
                <StatItem
                  icon={<Droplets className="h-4 w-4" />}
                  label="Banyo"
                  value={`${listing.bathroomCount} Adet`}
                />
                <StatItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="İlan Tarihi"
                  value={formattedDate}
                />
              </div>
            </div>

            {/* Feature badges */}
            <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
              <h2 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-4">
                Özellikler
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <FeatureItem label="Balkon" value={listing.balcony} />
                <FeatureItem label="Asansör" value={listing.elevator} />
                <FeatureItem label="Eşyalı" value={listing.furnished} />
                <FeatureItem
                  label="Krediye Uygun"
                  value={listing.creditworthy}
                />
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-[#c5a059] rounded-sm p-5 space-y-3">
              <p className="text-white/70 text-[10px] tracking-[0.4em] uppercase">
                Danışman
              </p>
              <p className="text-white font-serif text-lg">Can Gayrimenkul</p>
              <a
                href="tel:+902323812381"
                className="flex items-center gap-2 bg-white text-[#c5a059] font-medium text-sm px-4 py-3 rounded-sm hover:bg-white/90 transition-colors justify-center"
              >
                <Phone className="h-4 w-4" />
                +90 232 381 23 81
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="mt-8 bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
            <h2 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-4">
              İlan Açıklaması
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        )}

        {/* Full details */}
        <div className="mt-6 bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h2 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-6">
            Detaylı Bilgiler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 divide-gray-100">
            <DetailRow
              icon={<ChefHat className="h-4 w-4" />}
              label="Mutfak"
              value={listing.kitchenType}
            />
            <DetailRow
              icon={<Flame className="h-4 w-4" />}
              label="Isıtma"
              value={listing.heating}
            />
            <DetailRow
              icon={<Car className="h-4 w-4" />}
              label="Otopark"
              value={listing.parking}
            />
            <DetailRow
              icon={<BedDouble className="h-4 w-4" />}
              label="Oda Sayısı"
              value={listing.roomCount}
            />
            <DetailRow
              icon={<Maximize2 className="h-4 w-4" />}
              label="Net m²"
              value={`${listing.netSquareMeters} m²`}
            />
            <DetailRow
              icon={<Maximize2 className="h-4 w-4" />}
              label="Brüt m²"
              value={`${listing.grossSquareMeters} m²`}
            />
            <DetailRow
              icon={<Layers className="h-4 w-4" />}
              label="Toplam Kat"
              value={String(listing.totalFloor)}
            />
            <DetailRow
              icon={<Building2 className="h-4 w-4" />}
              label="Bina Yaşı"
              value={
                listing.buildingAge === 0
                  ? "Sıfır Bina"
                  : `${listing.buildingAge} Yıl`
              }
            />
            <DetailRow
              icon={<Droplets className="h-4 w-4" />}
              label="Banyo Sayısı"
              value={String(listing.bathroomCount)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[#c5a059] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-gray-800 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-sm ${
        value ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
      }`}
    >
      {value ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      <span className="text-xs">{label}</span>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0">
      <span className="text-[#c5a059] shrink-0">{icon}</span>
      <span className="text-gray-400 text-xs w-24 shrink-0">{label}</span>
      <span className="text-gray-800 text-sm font-medium">{value}</span>
    </div>
  );
}
