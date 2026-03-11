"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useListingForm } from "../../../hooks/useListingForm";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LocationSection } from "./LocationSection";
import { FeaturesSection } from "./FeaturesSection";
import { ExtraFeaturesSection } from "./ExtraFeaturesSection";
import { ImageUploadSection } from "./ImageUploadSection";
import type { District, DetailedListing } from "@/types/types";

interface ListingFormProps {
  districts: District[];
  initialData?: DetailedListing;
}

export function ListingForm({ districts, initialData }: ListingFormProps) {
  const router = useRouter();
  const {
    isEditMode,
    isPending,
    error,
    neighborhoods,
    loadingNeighborhoods,
    selectedNeighborhoodId,
    setSelectedNeighborhoodId,
    allPreviews,
    fileInputRef,
    handleDistrictChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  } = useListingForm(initialData);

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl">
      <GeneralInfoSection initialData={initialData} />

      <LocationSection
        districts={districts}
        neighborhoods={neighborhoods}
        loadingNeighborhoods={loadingNeighborhoods}
        selectedNeighborhoodId={selectedNeighborhoodId}
        setSelectedNeighborhoodId={setSelectedNeighborhoodId}
        handleDistrictChange={handleDistrictChange}
        initialDistrictId={initialData?.districtId}
      />

      <FeaturesSection initialData={initialData} />

      <ExtraFeaturesSection initialData={initialData} />

      <ImageUploadSection
        allPreviews={allPreviews}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        removeImage={removeImage}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditMode ? "İlanı Güncelle" : "İlanı Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="cursor-pointer"
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
