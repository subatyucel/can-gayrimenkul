import { getListings } from "@/actions/listing";
import { getCurrentUser } from "@/actions/settings";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

  const listings = await getListings();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">İlanlar</h1>
        <Link href="/admin/ilanlar/ilan-olustur">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni İlan
          </Button>
        </Link>
      </div>

      <ListingsTable data={listings} isOwner={user.role === "owner"} />
    </>
  );
}
