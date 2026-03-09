"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Power } from "lucide-react";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  listingNumber: number;
  title: string;
  price: number;
  listingType: string;
  isActive: boolean;
  slug: string;
  createdAt: Date;
  district: { name: string };
  neighborhood: { name: string };
  user: { fullName: string };
}

interface ListingCardProps {
  listing: Listing;
  isOwner: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function ListingCard({
  listing,
  isOwner,
  isDisabled,
  onToggle,
  onDelete,
}: ListingCardProps) {
  const router = useRouter();

  return (
    <Card className="transition-colors hover:bg-accent/50 gap-4">
      <CardHeader>
        <CardTitle className="truncate text-base">{listing.title}</CardTitle>
        <CardDescription className="font-mono">
          #{listing.listingNumber}
        </CardDescription>
        <CardAction>
          <div className="flex gap-1.5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                listing.listingType === "sale"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
              }`}
            >
              {listing.listingType === "sale" ? "Satılık" : "Kiralık"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                listing.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {listing.isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {listing.district.name} / {listing.neighborhood.name}
          </span>
          <span className="font-semibold">
            ₺{listing.price.toLocaleString("tr-TR")}
          </span>
        </div>
        {isOwner && (
          <p className="text-xs text-muted-foreground">
            Ekleyen: {listing.user.fullName}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground italic">
          {new Date(listing.createdAt).toLocaleDateString("tr-TR")}
        </span>
        <div className="flex gap-2">
          <Button
            variant={listing.isActive ? "secondary" : "default"}
            size="icon"
            className="h-8 w-8"
            title={listing.isActive ? "Pasife Al" : "Aktif Et"}
            onClick={onToggle}
            disabled={isDisabled}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            title="Düzenle"
            onClick={() =>
              router.push(`/admin/ilanlar/${listing.slug}/duzenle`)
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            title="Sil"
            onClick={onDelete}
            disabled={isDisabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
