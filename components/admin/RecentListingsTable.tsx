"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface RecentListingsTableProps {
  data: {
    id: string;
    title: string;
    price: number;
    listingType: string;
    createdAt: Date;
    slug: string;
  }[];
}

export function RecentListingsTable({ data }: RecentListingsTableProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Son Eklenen İlanlar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead className="text-right">Fiyat</TableHead>
              <TableHead className="text-right">Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((listing) => (
                <TableRow
                  key={listing.id}
                  onClick={() => router.push(`/ilan/${listing.slug}`)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium max-w-50 truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        listing.listingType === "sale"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                      }`}
                    >
                      {listing.listingType === "sale" ? "Satılık" : "Kiralık"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ₺{listing.price.toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs italic">
                    {new Date(listing.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  Henüz ilan eklenmemiş.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
