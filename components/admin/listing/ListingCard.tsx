'use client';

import { useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ListingCardData } from '@/types';
import { Pencil, Power } from 'lucide-react';
import Image from 'next/image';
import { deleteListing, toggleListingState } from '@/actions/listing';
import { toast } from 'sonner';

import DeleteListingButtonWithAlert from './DeleteListingButtonWithAlert';
import Link from 'next/link';

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const toastId = toast.loading('İlan durumu değiştiriliyor...');
      const response = await toggleListingState(listing.slug);

      if (!response.success) {
        toast.error(response.error, { id: toastId });
        return;
      }

      toast.success(response.message, { id: toastId });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const toastId = toast.loading('İlan siliniyor...');
      const response = await deleteListing(listing.slug);

      if (!response.success) {
        toast.error(response.error, { id: toastId });
        return;
      }

      toast.success(response.message, { id: toastId });
    });
  }

  return (
    <Card className="relative mx-auto max-w-50 pt-0">
      <Image
        width={100}
        height={100}
        src={
          listing.images[0]?.url ||
          'https://placehold.co/400.png?text=İlan+Fotoğrafı+Bulunamadı'
        }
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover  "
      />
      <CardHeader>
        <CardTitle className="truncate font-bold">
          #{listing.listingNumber} - {listing.title}
        </CardTitle>
        <CardDescription>
          <Badge variant="secondary">
            {listing.listingType == 'sale' ? 'Satılık' : 'Kiralık'}
          </Badge>
          <Badge variant={listing.isActive ? 'active' : 'passive'}>
            {listing.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="font-bold">
          Fiyat: ₺{listing.price.toLocaleString('tr-TR')}
        </p>
        <p className="text-muted-foreground">
          {listing.district.name} / {listing.neighborhood.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Oluşturan: {listing.user.fullName}
        </p>
        <p className="text-xs text-muted-foreground">
          Oluşturma tarihi:{' '}
          {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 justify-center">
        <Button
          variant={listing.isActive ? 'destructive' : 'success'}
          size="icon"
          title={listing.isActive ? 'Pasife Al' : 'Aktif Et'}
          onClick={handleToggle}
          disabled={isPending}
        >
          <Power />
        </Button>
        <Link href={`/admin/ilanlar/${listing.slug}/duzenle`}>
          <Button
            variant="outline"
            size="icon"
            title="Düzenle"
            className="cursor-pointer"
            disabled={isPending}
          >
            <Pencil />
          </Button>
        </Link>
        <DeleteListingButtonWithAlert
          title={listing.title}
          slug={listing.slug}
          isPending={isPending}
          handleDelete={handleDelete}
        />
      </CardFooter>
    </Card>
  );
}
