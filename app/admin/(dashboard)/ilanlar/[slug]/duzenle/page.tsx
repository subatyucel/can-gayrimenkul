import { notFound } from 'next/navigation';
import CreateUpdateListingForm from '@/components/admin/listing/listing-form/CreateUpdateListingForm';
import { NextPageProps } from '@/types';
import { getListingBySlug } from '@/actions/listing';

export default async function EditListingPage({ params }: NextPageProps) {
  const { slug } = await params;
  const response = await getListingBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        İlanı Düzenle ({response.data.title})
      </h1>
      <CreateUpdateListingForm initialData={response.data} />
    </>
  );
}
