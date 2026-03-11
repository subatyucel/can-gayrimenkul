import { Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DetailedListing } from "@/types/types";

function formatDateForInput(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}

interface GeneralInfoSectionProps {
  initialData?: DetailedListing;
}

export function GeneralInfoSection({ initialData }: GeneralInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Genel Bilgiler
        </CardTitle>
        <CardDescription>İlanın temel bilgilerini girin</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">İlan Başlığı</Label>
          <Input
            id="title"
            name="title"
            placeholder="Örn: Deniz Manzaralı 3+1 Daire"
            defaultValue={initialData?.title}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="İlan detaylarını yazın..."
            rows={5}
            defaultValue={initialData?.description}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="listingType">İlan Türü</Label>
          <Select
            name="listingType"
            required
            defaultValue={initialData?.listingType}
          >
            <SelectTrigger id="listingType">
              <SelectValue placeholder="Seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Satılık</SelectItem>
              <SelectItem value="rent">Kiralık</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            defaultValue={initialData?.price}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expireDate">Son Yayın Tarihi</Label>
          <Input
            id="expireDate"
            name="expireDate"
            type="date"
            defaultValue={
              initialData?.expireDate
                ? formatDateForInput(initialData.expireDate)
                : undefined
            }
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
