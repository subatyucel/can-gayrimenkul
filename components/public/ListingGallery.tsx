"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import type { ListingImage } from "@/types/types";

type ListingGalleryProps = {
  images: ListingImage[];
  title: string;
};

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-4/3 bg-gray-100 flex items-center justify-center rounded-sm">
        <Building2 className="h-16 w-16 text-gray-300" />
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden rounded-sm group">
        <Image
          key={images[current].id}
          src={images[current].url}
          alt={`${title} - ${current + 1}`}
          fill
          priority={current === 0}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrent(i)}
              className={`relative shrink-0 w-16 h-16 overflow-hidden rounded-sm border-2 transition-all ${
                i === current
                  ? "border-gold"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
