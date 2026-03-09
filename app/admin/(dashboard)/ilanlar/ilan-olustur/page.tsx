import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/settings";
import { getDistricts } from "@/actions/listing";
import { ListingForm } from "@/components/admin/ListingForm";

export default async function CreateListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

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
