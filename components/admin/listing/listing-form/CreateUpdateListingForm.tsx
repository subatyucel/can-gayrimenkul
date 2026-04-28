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
import { createListing } from '@/actions/listing';

interface ListingFormProps {
  initialData?: ListingFormOutput;
}

type TabType = (typeof TABS_ORDER)[number];

export default function CreateUpdateListingForm({
  initialData,
}: ListingFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [activeTab, setActiveTab] = useState<TabType>('general');

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

    try {
      const { images, ...formData } = data;
      let imageUrls: string[] = [];

      if (images && images.length > 0) {
        toast.info('Fotoğraflar yükleniyor...');
        imageUrls = await uploadImagesToCloudinary(images);
      }

      if (isEditMode) {
        console.log('edit mode verileri: ', formData, imageUrls);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        toast.success('Değişiklikler kaydedildi');
      } else {
        const response = await createListing(formData, imageUrls);
        if (!response.success) {
          toast.error(response.error, { id: toastId });
          return;
        }

        toast.success(response.message, { id: toastId });
        router.push('/admin/ilanlar');
      }
    } catch (error) {
      console.error('Submit Hatası:', error);
      toast.error('İşlem sırasında beklenmeyen bir hata oluştu.', {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
  }

  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === TABS_ORDER.length - 1;

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLastTab) {
      setActiveTab(TABS_ORDER[currentIndex + 1]);
    }
  }

  async function handlePrev(e: React.MouseEvent) {
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
        <MediaTab form={form} />
      </Tabs>

      <div className="mt-10 max-w-full flex-wrap flex justify-between items-center border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrev}
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
          onClick={handleNext}
          disabled={isLastTab || isSubmitting}
        >
          <ChevronRight className="h-4 w-4" />
          Sonraki
        </Button>
      </div>
    </form>
  );
}
