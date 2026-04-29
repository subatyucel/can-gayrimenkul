'use client';

import ErrorDot from '@/components/ui/error-dot';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ListingFormInput,
  ListingFormOutput,
  listingSchema,
} from '@/lib/validations/listing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import GeneralTab from './GeneralTab';
import LocationTab from './LocationTab';
import FeaturesTab from './FeaturesTab';
import MediaTab from './MediaTab';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import {
  prepareFormValues,
  TAB_FIELDS,
  TABS_ORDER,
} from '@/constants/listing-form';
import { useRouter } from 'next/navigation';
import { uploadImagesToCloudinary } from '@/lib/cloudinary/cloudinary-client';
import {
  cleanupOrphanImages,
  createListing,
  updateListing,
} from '@/actions/listing';
import type { Listing, Image as PrismaImage } from '@prisma/client';

export type ListingWithImages = Listing & {
  images: PrismaImage[];
};
interface ListingFormProps {
  initialData?: ListingWithImages | null;
}

type TabType = (typeof TABS_ORDER)[number];

export default function CreateUpdateListingForm({
  initialData,
}: ListingFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [existingImages, setExistingImages] = useState<PrismaImage[]>(
    initialData?.images || [],
  );

  function handleRemoveExistingImage(imageIdToRemove: string) {
    setExistingImages((prev) =>
      prev.filter((img) => img.id !== imageIdToRemove),
    );
  }

  const form = useForm<ListingFormInput, unknown, ListingFormOutput>({
    resolver: zodResolver(listingSchema),
    mode: 'onTouched',
    defaultValues: prepareFormValues(initialData),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(data: ListingFormOutput) {
    const toastId = toast.loading(
      `${isEditMode ? 'Değişiklikler kaydediliyor...' : 'İlan oluşturuluyor...'}`,
    );

    let newImageUrls: string[] = [];

    try {
      const { images, ...formData } = data;

      if (images && images.length > 0) {
        toast.info('Fotoğraflar yükleniyor...', { id: toastId });
        newImageUrls = await uploadImagesToCloudinary(images);
      }

      const existingUrls = existingImages.map((img) => img.url);
      const finalImageUrls = [...existingUrls, ...newImageUrls];

      if (isEditMode) {
        //Edit mode
        const response = await updateListing(
          initialData.id,
          formData,
          finalImageUrls,
        );

        if (!response.success) {
          if (newImageUrls.length > 0) await cleanupOrphanImages(newImageUrls);
          toast.error(response.error, { id: toastId });
          return;
        }

        toast.success(response.message, { id: toastId });
      } else {
        //Edit mode = false create mode
        const response = await createListing(formData, finalImageUrls);
        if (!response.success) {
          if (newImageUrls.length > 0) await cleanupOrphanImages(newImageUrls);
          toast.error(response.error, { id: toastId });
          return;
        }

        toast.success(response.message, { id: toastId });
      }

      router.push('/admin/ilanlar');
    } catch (_) {
      if (newImageUrls.length > 0) await cleanupOrphanImages(newImageUrls);
      toast.error('İşlem sırasında beklenmeyen bir hata oluştu.', {
        id: toastId,
      });
    }
  }

  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === TABS_ORDER.length - 1;

  function handleNextTab(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLastTab) {
      setActiveTab(TABS_ORDER[currentIndex + 1]);
    }
  }

  async function handlePrevTab(e: React.MouseEvent) {
    e.preventDefault();
    if (!isFirstTab) {
      setActiveTab(TABS_ORDER[currentIndex - 1]);
    }
  }

  function hasErrorInTab(tabName: keyof typeof TAB_FIELDS) {
    return TAB_FIELDS[tabName].some((fieldName) => errors[fieldName]);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto py-8 px-4"
      id="createUpdateListingForm"
    >
      <Tabs
        defaultValue="general"
        className="w-full"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabType)}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
          <TabsTrigger value="general">
            Genel Bilgiler
            {hasErrorInTab('general') && (
              <ErrorDot className="-top-1 -right-1" />
            )}
          </TabsTrigger>

          <TabsTrigger value="location">
            Konum Bilgileri
            {hasErrorInTab('location') && (
              <ErrorDot className="-top-1 -right-1" />
            )}
          </TabsTrigger>

          <TabsTrigger value="features">
            Özellikler
            {hasErrorInTab('features') && (
              <ErrorDot className="-top-1 -right-1" />
            )}
          </TabsTrigger>

          <TabsTrigger value="media">
            Medya
            {hasErrorInTab('media') && <ErrorDot className="-top-1 -right-1" />}
          </TabsTrigger>
        </TabsList>

        <GeneralTab form={form} />
        <LocationTab form={form} />
        <FeaturesTab form={form} />
        <MediaTab
          form={form}
          existingImages={existingImages}
          onRemoveExisting={handleRemoveExistingImage}
        />
      </Tabs>

      <div className="mt-10 max-w-full flex-wrap flex justify-between items-center border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevTab}
          disabled={isFirstTab || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Önceki
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="success"
          form="createUpdateListingForm"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Kaydet
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleNextTab}
          disabled={isLastTab || isSubmitting}
        >
          <ChevronRight className="h-4 w-4" />
          Sonraki
        </Button>
      </div>
    </form>
  );
}
