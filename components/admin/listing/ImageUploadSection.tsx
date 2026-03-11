import { ImagePlus, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { RefObject } from "react";

interface ImageUploadSectionProps {
  allPreviews: { src: string; isExisting: boolean }[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function ImageUploadSection({
  allPreviews,
  fileInputRef,
  handleImageChange,
  removeImage,
}: ImageUploadSectionProps) {
  return (
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
  );
}
