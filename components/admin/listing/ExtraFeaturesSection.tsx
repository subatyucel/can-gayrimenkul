import { Settings2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DetailedListing } from "@/types/types";

interface ExtraFeaturesSectionProps {
  initialData?: DetailedListing;
}

const EXTRA_FEATURES = [
  { id: "balcony", label: "Balkon" },
  { id: "elevator", label: "Asansör" },
  { id: "furnished", label: "Eşyalı" },
  { id: "creditworthy", label: "Krediye Uygun" },
] as const;

export function ExtraFeaturesSection({
  initialData,
}: ExtraFeaturesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Ek Özellikler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXTRA_FEATURES.map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <Checkbox id={id} name={id} defaultChecked={initialData?.[id]} />
              <Label htmlFor={id} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
