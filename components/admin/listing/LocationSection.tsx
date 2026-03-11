import { MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { District, Neighborhood } from "@/types/types";

interface LocationSectionProps {
  districts: District[];
  neighborhoods: Neighborhood[];
  loadingNeighborhoods: boolean;
  selectedNeighborhoodId: string;
  setSelectedNeighborhoodId: (id: string) => void;
  handleDistrictChange: (districtId: string) => void;
  initialDistrictId?: number;
}

export function LocationSection({
  districts,
  neighborhoods,
  loadingNeighborhoods,
  selectedNeighborhoodId,
  setSelectedNeighborhoodId,
  handleDistrictChange,
  initialDistrictId,
}: LocationSectionProps) {
  return (
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
            defaultValue={initialDistrictId?.toString()}
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
  );
}
