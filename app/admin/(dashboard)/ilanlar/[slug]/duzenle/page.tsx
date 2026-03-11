import { redirect, notFound } from "next/navigation";
import { getDistricts, getListingBySlug } from "@/actions/listing";
import { ListingForm } from "@/components/admin/listing/ListingForm";
import { getCurrentUser } from "@/actions/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

  const { slug } = await params;

  const [listing, districts] = await Promise.all([
    getListingBySlug(slug),
    getDistricts(),
  ]);

  if (!listing) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-6">İlanı Düzenle</h1>
      <ListingForm districts={districts} initialData={listing} />
    </>
  );
}
