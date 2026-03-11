"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createListing,
  updateListing,
  getNeighborhoods,
} from "@/actions/listing";
import type {
  Neighborhood,
  ListingImage,
  DetailedListing,
} from "@/types/types";

export function useListingForm(initialData?: DetailedListing) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(
    !!initialData?.districtId,
  );
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(
    initialData?.neighborhoodId?.toString() ?? "",
  );

  const [existingImages, setExistingImages] = useState<ListingImage[]>(
    initialData?.images ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.districtId) {
      getNeighborhoods(initialData.districtId).then((data) => {
        setNeighborhoods(data);
        setLoadingNeighborhoods(false);
      });
    }
  }, [initialData?.districtId]);

  async function handleDistrictChange(districtId: string) {
    setSelectedNeighborhoodId("");
    setLoadingNeighborhoods(true);
    const data = await getNeighborhoods(parseInt(districtId));
    setNeighborhoods(data);
    setLoadingNeighborhoods(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const total = existingImages.length + newFiles.length + selected.length;

    if (total > 10) {
      setError("En fazla 10 fotoğraf yükleyebilirsiniz!");
      return;
    }

    setError("");
    setNewFiles((prev) => [...prev, ...selected]);
    setNewPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      URL.revokeObjectURL(newPreviews[newIndex]);
      setNewFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setNewPreviews((prev) => prev.filter((_, i) => i !== newIndex));
    }
  }

  function handleSubmit(formData: FormData) {
    setError("");

    formData.delete("images");
    newFiles.forEach((file) => formData.append("images", file));

    startTransition(async () => {
      if (isEditMode) {
        const deletedIds = (initialData.images ?? [])
          .filter((img) => !existingImages.find((e) => e.id === img.id))
          .map((img) => img.id);
        deletedIds.forEach((id) => formData.append("deletedImageId", id));

        const result = await updateListing(initialData.id, formData);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/ilanlar");
        }
      } else {
        const result = await createListing(formData);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/ilanlar");
        }
      }
    });
  }

  const allPreviews: { src: string; isExisting: boolean }[] = [
    ...existingImages.map((img) => ({ src: img.url, isExisting: true })),
    ...newPreviews.map((src) => ({ src, isExisting: false })),
  ];

  return {
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
  };
}
