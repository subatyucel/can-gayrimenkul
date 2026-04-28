import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import CreateUpdateListingForm from '@/components/admin/listing/listing-form/CreateUpdateListingForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/giris-yap');

  const { slug } = await params;

  const listing = await getListingBySlug(slug);

  if (!listing) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">İlanı Düzenle</h1>
      <CreateUpdateListingForm />
    </>
  );
}
