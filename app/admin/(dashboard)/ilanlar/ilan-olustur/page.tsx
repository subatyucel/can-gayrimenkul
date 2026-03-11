import { getDistricts } from "@/actions/listing";
import { ListingForm } from "@/components/admin/listing/ListingForm";

export default async function CreateListingPage() {
  const districts = await getDistricts();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Yeni İlan Oluştur
      </h1>
      <ListingForm districts={districts} />
    </>
  );
}
