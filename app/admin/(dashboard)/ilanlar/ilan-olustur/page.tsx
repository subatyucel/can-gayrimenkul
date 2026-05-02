import CreateUpdateListingForm from '@/components/admin/listing/listing-form/CreateUpdateListingForm';

export default async function CreateListingPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Yeni İlan Oluştur
      </h1>
      <CreateUpdateListingForm />
    </>
  );
}
