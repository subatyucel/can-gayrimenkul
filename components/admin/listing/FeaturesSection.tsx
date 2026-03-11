import { Home } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { featureOptions } from "@/lib/constans";
import type { DetailedListing } from "@/types/types";

interface FeaturesSectionProps {
  initialData?: DetailedListing;
}

export function FeaturesSection({ initialData }: FeaturesSectionProps) {
  return (
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
              {featureOptions.ROOM.map((r) => (
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
              {featureOptions.FLOOR.map((f) => (
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
              {featureOptions.KITCHEN.map((k) => (
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
              {featureOptions.HEATING.map((h) => (
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
              {featureOptions.PARKING.map((p) => (
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
  );
}
