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
import { Pencil, Power, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toggleListingState } from '@/actions/listing';
import { toast } from 'sonner';

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const [isPending, startTransition] = useTransition();
  function handleToggle() {
    startTransition(async () => {
      const response = await toggleListingState(listing.slug);

      if (!response.success) {
        toast(response.error);
      }
    });
  }

  return (
    <Card className="relative mx-auto max-w-50 pt-0">
      <Image
        width={100}
        height={100}
        src={listing.images[0].url}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover  "
      />
      <CardHeader>
        <CardTitle className="truncate font-bold">
          #{listing.listingNumber} - {listing.title}
        </CardTitle>
        <CardDescription>
          <Badge>{listing.listingType == 'sale' ? 'Satılık' : 'Kiralık'}</Badge>
          <Badge
            className={
              listing.isActive
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            }
          >
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
          variant={listing.isActive ? 'destructive' : 'default'}
          size="icon"
          title={listing.isActive ? 'Pasife Al' : 'Aktif Et'}
          className="cursor-pointer"
          onClick={handleToggle}
        >
          <Power />
        </Button>
        <Button variant="outline" size="icon" title="Düzenle">
          <Pencil />
        </Button>

        <Button variant="destructive" size="icon" title="Sil">
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}
