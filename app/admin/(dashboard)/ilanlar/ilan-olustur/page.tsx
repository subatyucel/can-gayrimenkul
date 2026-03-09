import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/settings";
import { getDistricts } from "@/actions/listing";
import { CreateListingForm } from "@/components/admin/CreateListingForm";

export default async function CreateListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

  const districts = await getDistricts();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Yeni İlan Oluştur
      </h1>
      <CreateListingForm districts={districts} />
    </>
  );
}
