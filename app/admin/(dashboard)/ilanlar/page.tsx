import { getDashboardListings } from '@/actions/listing';
import ListingCardContainer from '@/components/admin/listing/ListingCardContainer';
import { Button } from '@/components/ui/button';
import { ListingCardData } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default async function ListingsPage() {
  const response = await getDashboardListings();
  let data: ListingCardData[];

  if (!response.success) {
    data = [];
    toast.error(response.error);
  } else {
    data = response.data || [];
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">İlanlar</h1>
        <Link href="/admin/ilanlar/ilan-olustur">
          <Button variant="success">
            <Plus className="w-4 mr-2" />
            Yeni İlan
          </Button>
        </Link>
      </div>
      <ListingCardContainer data={data} />
    </>
  );
}
