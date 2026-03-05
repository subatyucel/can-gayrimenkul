import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentListingsTableProps {
  data: {
    id: string;
    title: string;
    price: number;
    listingType: string;
    createdAt: Date;
  }[];
}

export function RecentListingsTable({ data }: RecentListingsTableProps) {
  return (
    <Card className="h-full">
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
                <TableRow key={listing.id}>
                  <TableCell className="font-medium max-w-50 truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell>
                    {listing.listingType === "sale" ? "Satılık" : "Kiralık"}
                  </TableCell>
                  <TableCell className="text-right">
                    ₺{listing.price.toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
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
