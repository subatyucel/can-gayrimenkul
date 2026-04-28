import { Controller } from 'react-hook-form';
import { UploadCloud } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ListingFormTabProps } from '@/types';
import { TabsContent } from '@/components/ui/tabs';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { toast } from 'sonner';
import { ImagePreview } from './ImagePreview';

const compressOptions = {
  maxSizeMB: 5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
};

export default function MediaTab({ form }: ListingFormTabProps) {
  const { control } = form;

  return (
    <TabsContent value="media">
      <FieldGroup>
        <Controller
          name="images"
          control={control}
          render={({ field, fieldState }) => {
            const handleFileChange = async (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;

              toast.loading('Fotoğraflar optimize ediliyor...');

              const compressedFiles: File[] = [];

              for (const file of files) {
                try {
                  const compressedBlob = await imageCompression(
                    file,
                    compressOptions,
                  );

                  const compressedFile = new File([compressedBlob], file.name, {
                    type: compressedBlob.type,
                    lastModified: Date.now(),
                  });

                  compressedFiles.push(compressedFile);
                } catch (error) {
                  console.error(`${file.name} sıkıştırılamadı:`, error);
                  compressedFiles.push(file);
                }
              }

              const newImages = [...(field.value || []), ...compressedFiles];
              field.onChange(newImages);
              e.target.value = '';
              toast.dismiss();
            };

            const removeImage = (index: number) => {
              const updatedImages = [...field.value];
              updatedImages.splice(index, 1);
              field.onChange(updatedImages);
            };

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>İlan Fotoğrafları</FieldLabel>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-secondary/10 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-secondary rounded-full">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">
                      Tıklayın veya fotoğrafları sürükleyin
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG veya WEBP (Maks. 5MB / Medya)
                    </p>
                  </div>
                </div>

                {/* Önizleme Alanı */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                  {field.value?.map((file: File, index: number) => (
                    <ImagePreview
                      key={`${file.name}-${index}`}
                      file={file}
                      onRemove={() => removeImage(index)}
                    />
                  ))}
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </TabsContent>
  );
}
