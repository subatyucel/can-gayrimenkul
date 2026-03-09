"use client";

import { useState, useTransition, useRef, useEffect } from "react";
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
import {
  Loader2,
  Home,
  MapPin,
  Info,
  Settings2,
  ImagePlus,
  X,
} from "lucide-react";
import {
  createListing,
  updateListing,
  getNeighborhoods,
} from "@/actions/listing";
import Image from "next/image";
import {
  ROOM_OPTIONS,
  KITCHEN_OPTIONS,
  PARKING_OPTIONS,
  HEATING_OPTIONS,
  FLOOR_OPTIONS,
} from "@/lib/constans";

interface District {
  id: number;
  name: string;
}

interface Neighborhood {
  id: number;
  name: string;
}

interface ListingData {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: string;
  expireDate: Date | string;
  districtId: number;
  neighborhoodId: number;
  roomCount: string;
  netSquareMeters: number;
  grossSquareMeters: number;
  buildingAge: number;
  floorAt: string;
  totalFloor: number;
  bathroomCount: number;
  kitchenType: string;
  heating: string;
  parking: string;
  balcony: boolean;
  elevator: boolean;
  furnished: boolean;
  creditworthy: boolean;
  dues: number;
  images: { id: string; url: string }[];
}

interface ListingFormProps {
  districts: District[];
  initialData?: ListingData;
}

function formatDateForInput(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}

export function ListingForm({ districts, initialData }: ListingFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(
    !!initialData?.districtId,
  );
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(
    initialData?.neighborhoodId?.toString() ?? "",
  );

  // Mevcut Cloudinary görselleri (edit modunda)
  const [existingImages, setExistingImages] = useState<
    { id: string; url: string }[]
  >(initialData?.images ?? []);

  // Yeni yüklenecek dosyalar
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modunda ilçeye ait mahalleleri yükle
  useEffect(() => {
    if (initialData?.districtId) {
      getNeighborhoods(initialData.districtId).then((data) => {
        setNeighborhoods(data);
        setLoadingNeighborhoods(false);
      });
    }
  }, [initialData?.districtId]);

  async function handleDistrictChange(districtId: string) {
    setSelectedNeighborhoodId("");
    setLoadingNeighborhoods(true);
    const data = await getNeighborhoods(parseInt(districtId));
    setNeighborhoods(data);
    setLoadingNeighborhoods(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const total = existingImages.length + newFiles.length + selected.length;

    if (total > 10) {
      setError("En fazla 10 fotoğraf yükleyebilirsiniz!");
      return;
    }

    setError("");
    setNewFiles((prev) => [...prev, ...selected]);

    const newPreviewUrls = selected.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...newPreviewUrls]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      URL.revokeObjectURL(newPreviews[newIndex]);
      setNewFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setNewPreviews((prev) => prev.filter((_, i) => i !== newIndex));
    }
  }

  function handleSubmit(formData: FormData) {
    setError("");

    // Yeni dosyaları forma ekle
    formData.delete("images");
    newFiles.forEach((file) => formData.append("images", file));

    startTransition(async () => {
      if (isEditMode) {
        // Silinen mevcut görsellerin ID'lerini ekle
        const deletedIds = (initialData.images ?? [])
          .filter((img) => !existingImages.find((e) => e.id === img.id))
          .map((img) => img.id);
        deletedIds.forEach((id) => formData.append("deletedImageId", id));

        const result = await updateListing(initialData.id, formData);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/ilanlar");
        }
      } else {
        const result = await createListing(formData);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/ilanlar");
        }
      }
    });
  }

  const allPreviews: { src: string; isExisting: boolean }[] = [
    ...existingImages.map((img) => ({ src: img.url, isExisting: true })),
    ...newPreviews.map((src) => ({ src, isExisting: false })),
  ];

  return (
    <form action={handleSubmit} className="space-y-6 max-w-4xl">
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
              defaultValue={initialData?.districtId?.toString()}
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
              value={selectedNeighborhoodId}
              onValueChange={setSelectedNeighborhoodId}
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
            <Select
              name="roomCount"
              required
              defaultValue={initialData?.roomCount}
            >
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
              defaultValue={initialData?.netSquareMeters}
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
              defaultValue={initialData?.grossSquareMeters}
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
              defaultValue={initialData?.buildingAge}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floorAt">Bulunduğu Kat</Label>
            <Select name="floorAt" required defaultValue={initialData?.floorAt}>
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
              defaultValue={initialData?.totalFloor}
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
              defaultValue={initialData?.bathroomCount}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kitchenType">Mutfak Tipi</Label>
            <Select
              name="kitchenType"
              required
              defaultValue={initialData?.kitchenType}
            >
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
            <Select name="heating" required defaultValue={initialData?.heating}>
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
            <Select name="parking" required defaultValue={initialData?.parking}>
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
              defaultValue={initialData?.dues}
            />
          </div>
        </CardContent>
      </Card>

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
              <Checkbox
                id="balcony"
                name="balcony"
                defaultChecked={initialData?.balcony}
              />
              <Label htmlFor="balcony" className="cursor-pointer">
                Balkon
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="elevator"
                name="elevator"
                defaultChecked={initialData?.elevator}
              />
              <Label htmlFor="elevator" className="cursor-pointer">
                Asansör
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="furnished"
                name="furnished"
                defaultChecked={initialData?.furnished}
              />
              <Label htmlFor="furnished" className="cursor-pointer">
                Eşyalı
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="creditworthy"
                name="creditworthy"
                defaultChecked={initialData?.creditworthy}
              />
              <Label htmlFor="creditworthy" className="cursor-pointer">
                Krediye Uygun
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Fotoğraflar
          </CardTitle>
          <CardDescription>
            En fazla 10 fotoğraf yükleyebilirsiniz (maks. 5 MB/adet)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            ref={fileInputRef}
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />

          {allPreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allPreviews.map((item, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    width={100}
                    height={100}
                    src={item.src}
                    alt={`Fotoğraf ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditMode ? "İlanı Güncelle" : "İlanı Oluştur"}
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
