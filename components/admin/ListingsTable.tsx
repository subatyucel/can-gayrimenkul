"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteListing, toggleListingStatus } from "@/actions/listing";
import { ListingCard } from "./listing/ListingCard";
import type { AdminListing } from "@/types/types";

interface ListingsTableProps {
  data: AdminListing[];
  isOwner: boolean;
}

type DialogState =
  | { type: "delete"; listingId: string; title: string }
  | { type: "toggle"; listingId: string; title: string; isActive: boolean }
  | null;

export function ListingsTable({ data, isOwner }: ListingsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);

  function handleConfirm() {
    if (!dialog) return;

    setActionId(dialog.listingId);

    if (dialog.type === "delete") {
      startTransition(async () => {
        const result = await deleteListing(dialog.listingId);
        setActionId(null);
        setDialog(null);
        if (result.error) {
          alert(result.error);
        } else {
          router.refresh();
        }
      });
    } else {
      startTransition(async () => {
        const result = await toggleListingStatus(dialog.listingId);
        setActionId(null);
        setDialog(null);
        if (result.error) {
          alert(result.error);
        } else {
          router.refresh();
        }
      });
    }
  }

  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isOwner={isOwner}
              isDisabled={isPending && actionId === listing.id}
              onToggle={() =>
                setDialog({
                  type: "toggle",
                  listingId: listing.id,
                  title: listing.title,
                  isActive: listing.isActive,
                })
              }
              onDelete={() =>
                setDialog({
                  type: "delete",
                  listingId: listing.id,
                  title: listing.title,
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          Henüz ilan eklenmemiş.
        </div>
      )}

      <AlertDialog
        open={!!dialog}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialog?.type === "delete"
                ? "İlanı Sil"
                : dialog?.isActive
                  ? "İlanı Pasife Al"
                  : "İlanı Aktif Et"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">&quot;{dialog?.title}&quot;</span>{" "}
              başlıklı ilanı{" "}
              {dialog?.type === "delete"
                ? "kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                : dialog?.isActive
                  ? "pasife almak istediğinize emin misiniz? İlan sitede görünmeyecektir."
                  : "tekrar aktif etmek istediğinize emin misiniz? İlan sitede görünür olacaktır."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className={
                dialog?.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isPending
                ? "İşleniyor..."
                : dialog?.type === "delete"
                  ? "Evet, Sil"
                  : dialog?.isActive
                    ? "Evet, Pasife Al"
                    : "Evet, Aktif Et"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
