"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Home, MapPin, Info, Settings2 } from "lucide-react";
import { createListing, getNeighborhoods } from "@/actions/listing";

interface District {
  id: number;
  name: string;
}

interface Neighborhood {
  id: number;
  name: string;
}

interface CreateListingFormProps {
  districts: District[];
}

const ROOM_OPTIONS = [
  "1+0",
  "1+1",
  "2+1",
  "2+2",
  "3+1",
  "3+2",
  "4+1",
  "4+2",
  "5+1",
  "5+2",
  "6+",
];
const KITCHEN_OPTIONS = ["Açık Mutfak", "Kapalı Mutfak", "Amerikan Mutfak"];
const PARKING_OPTIONS = ["Açık Otopark", "Kapalı Otopark", "Yok"];
const HEATING_OPTIONS = [
  "Doğalgaz (Kombi)",
  "Merkezi",
  "Yerden Isıtma",
  "Klima",
  "Soba",
  "Yok",
];
const FLOOR_OPTIONS = [
  "Bodrum",
  "Zemin",
  "Giriş Kat",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "20+",
];

export function CreateListingForm({ districts }: CreateListingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

  async function handleDistrictChange(districtId: string) {
    setLoadingNeighborhoods(true);
    const data = await getNeighborhoods(parseInt(districtId));
    setNeighborhoods(data);
    setLoadingNeighborhoods(false);
  }

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createListing(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/ilanlar");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Genel Bilgiler */}
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingType">İlan Türü</Label>
            <Select name="listingType" required>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expireDate">Son Yayın Tarihi</Label>
            <Input id="expireDate" name="expireDate" type="date" required />
          </div>
        </CardContent>
      </Card>

      {/* Konum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Konum
          </CardTitle>
          <CardDescription>İlanın konumunu seçin</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="districtId">İlçe</Label>
            <Select
              name="districtId"
              required
              onValueChange={handleDistrictChange}
            >
              <SelectTrigger id="districtId">
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhoodId">Mahalle</Label>
            <Select
              name="neighborhoodId"
              required
              disabled={loadingNeighborhoods || neighborhoods.length === 0}
            >
              <SelectTrigger id="neighborhoodId">
                <SelectValue
                  placeholder={
                    loadingNeighborhoods ? "Yükleniyor..." : "Mahalle seçin"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((n) => (
                  <SelectItem key={n.id} value={n.id.toString()}>
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Özellikler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Özellikler
          </CardTitle>
          <CardDescription>Mülk özelliklerini belirtin</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="roomCount">Oda Sayısı</Label>
            <Select name="roomCount" required>
              <SelectTrigger id="roomCount">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="netSquareMeters">Net m²</Label>
            <Input
              id="netSquareMeters"
              name="netSquareMeters"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grossSquareMeters">Brüt m²</Label>
            <Input
              id="grossSquareMeters"
              name="grossSquareMeters"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingAge">Bina Yaşı</Label>
            <Input
              id="buildingAge"
              name="buildingAge"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floorAt">Bulunduğu Kat</Label>
            <Select name="floorAt" required>
              <SelectTrigger id="floorAt">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {FLOOR_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalFloor">Toplam Kat</Label>
            <Input
              id="totalFloor"
              name="totalFloor"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathroomCount">Banyo Sayısı</Label>
            <Input
              id="bathroomCount"
              name="bathroomCount"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kitchenType">Mutfak Tipi</Label>
            <Select name="kitchenType" required>
              <SelectTrigger id="kitchenType">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {KITCHEN_OPTIONS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heating">Isıtma</Label>
            <Select name="heating" required>
              <SelectTrigger id="heating">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {HEATING_OPTIONS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parking">Otopark</Label>
            <Select name="parking" required>
              <SelectTrigger id="parking">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {PARKING_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dues">Aidat (₺)</Label>
            <Input
              id="dues"
              name="dues"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ek Özellikler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Ek Özellikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="balcony" name="balcony" />
              <Label htmlFor="balcony" className="cursor-pointer">
                Balkon
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="elevator" name="elevator" />
              <Label htmlFor="elevator" className="cursor-pointer">
                Asansör
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="furnished" name="furnished" />
              <Label htmlFor="furnished" className="cursor-pointer">
                Eşyalı
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="creditworthy" name="creditworthy" />
              <Label htmlFor="creditworthy" className="cursor-pointer">
                Krediye Uygun
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hata mesajı & Gönder */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          İlanı Oluştur
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="cursor-pointer"
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
