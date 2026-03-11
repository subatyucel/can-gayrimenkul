"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { getNeighborhoods } from "@/actions/listing";
import { featureOptions } from "@/lib/constans";
import type { District, Neighborhood } from "@/types/types";

type ListingsFilterProps = {
  districts: District[];
};

const SORT_OPTIONS = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price_asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
];

export default function ListingsFilter({ districts }: ListingsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [listingType, setListingType] = useState(searchParams.get("tur") ?? "");
  const [districtId, setDistrictId] = useState(searchParams.get("ilce") ?? "");
  const [neighborhoodId, setNeighborhoodId] = useState(
    searchParams.get("mahalle") ?? "",
  );
  const [roomCount, setRoomCount] = useState(searchParams.get("oda") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minFiyat") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxFiyat") ?? "");
  const [sort, setSort] = useState(searchParams.get("sirala") ?? "newest");
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    if (!districtId) return;
    getNeighborhoods(Number(districtId)).then((data) => {
      setNeighborhoods(data);
    });
  }, [districtId]);

  function applyFilters(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams();

    const values: Record<string, string> = {
      tur: listingType,
      ilce: districtId,
      mahalle: neighborhoodId,
      oda: roomCount,
      minFiyat: minPrice,
      maxFiyat: maxPrice,
      sirala: sort,
      ...overrides,
    };

    for (const [key, value] of Object.entries(values)) {
      if (value && value !== "newest") params.set(key, value);
    }

    startTransition(() => {
      router.push(`/ilanlar?${params.toString()}`);
    });

    if (window.innerWidth < 1024) setIsOpen(false);
  }

  function clearFilters() {
    setListingType("");
    setDistrictId("");
    setNeighborhoodId("");
    setRoomCount("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    startTransition(() => {
      router.push("/ilanlar");
    });
  }

  const hasActiveFilters =
    listingType ||
    districtId ||
    neighborhoodId ||
    roomCount ||
    minPrice ||
    maxPrice;

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[#c5a059] border border-[#c5a059]/40 px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#c5a059]/5 transition-colors rounded-sm"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtrele
          {hasActiveFilters && (
            <span className="bg-[#c5a059] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              !
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Sort on mobile */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters({ sirala: e.target.value });
          }}
          className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2 focus:outline-none focus:border-[#c5a059]/50 rounded-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter panel */}
      <aside
        className={`${isOpen ? "block" : "hidden"} lg:block w-full lg:w-64 xl:w-72 shrink-0`}
      >
        <div className="border border-gray-200 bg-white p-5 space-y-5 sticky top-24 rounded-sm shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[#c5a059] text-xs tracking-[0.4em] uppercase font-medium">
              Filtrele
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-[10px] tracking-wider uppercase transition-colors"
              >
                <X className="h-3 w-3" />
                Temizle
              </button>
            )}
          </div>

          {/* İlan Türü */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              İlan Türü
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: "", label: "Tümü" },
                { value: "sale", label: "Satılık" },
                { value: "rent", label: "Kiralık" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setListingType(opt.value)}
                  className={`py-2 text-[11px] tracking-wider uppercase transition-all border rounded-sm ${
                    listingType === opt.value
                      ? "bg-[#c5a059] text-white border-[#c5a059] font-medium"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#c5a059]/50 hover:text-[#c5a059]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* İlçe */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              İlçe
            </label>
            <select
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setNeighborhoodId("");
                setNeighborhoods([]);
              }}
              className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm"
            >
              <option value="">Tüm İlçeler</option>
              {districts.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mahalle */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              Mahalle
            </label>
            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              disabled={!districtId || neighborhoods.length === 0}
              className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Tüm Mahalleler</option>
              {neighborhoods.map((n) => (
                <option key={n.id} value={String(n.id)}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Oda Sayısı */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              Oda Sayısı
            </label>
            <select
              value={roomCount}
              onChange={(e) => setRoomCount(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm"
            >
              <option value="">Tümü</option>
              {featureOptions.ROOM.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Fiyat Aralığı */}
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              Fiyat Aralığı (₺)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm placeholder:text-gray-300"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Sort (desktop only) */}
          <div className="space-y-2 hidden lg:block">
            <label className="text-gray-400 text-[10px] tracking-[0.3em] uppercase block">
              Sıralama
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2.5 focus:outline-none focus:border-[#c5a059]/50 transition-colors rounded-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply button */}
          <button
            onClick={() => applyFilters()}
            disabled={isPending}
            className="w-full bg-[#c5a059] hover:bg-[#b08d4a] text-white text-xs tracking-[0.3em] uppercase py-3 font-medium transition-all duration-300 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Aranıyor..." : "Filtrele"}
          </button>
        </div>
      </aside>
    </>
  );
}
