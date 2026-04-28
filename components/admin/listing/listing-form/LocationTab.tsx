import { useWatch, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ListingFormTabProps } from '@/types';
import { getDistricts, getNeighborhoods } from '@/actions/locations';
import { TabsContent } from '@/components/ui/tabs';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LocationTab({ form }: ListingFormTabProps) {
  const { control, setValue } = form;
  const currentDistrict = useWatch({ control, name: 'districtId' });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts'],

    queryFn: async () => {
      const response = await getDistricts();
      if (!response.success) {
        throw new Error(response.error || 'İlçeler yüklenemedi.');
      }

      return response.data;
    },
  });

  const { data: neighborhoods, isLoading: isLoadingNeighborhoods } = useQuery({
    queryKey: ['neighborhoods', currentDistrict],
    queryFn: async () => {
      const response = await getNeighborhoods(+currentDistrict);
      if (!response.success) {
        throw new Error(response.error || 'Mahalleler yüklenemedi.');
      }

      return response.data;
    },
    enabled: !!currentDistrict,
  });

  const handleDistrictChange = (
    val: string,
    onChangeCallback: (val: string) => void,
  ) => {
    onChangeCallback(val);
    setValue('neighborhoodId', '');
  };
  return (
    <TabsContent value="location">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* İLÇE SEÇİMİ */}
          <Controller
            name="districtId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>İlçe</FieldLabel>
                <Select
                  onValueChange={(val) =>
                    handleDistrictChange(val, field.onChange)
                  }
                  value={field.value || ''}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                  disabled={isLoadingDistricts}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue
                      placeholder={
                        isLoadingDistricts ? 'Yükleniyor...' : 'İlçe Seçiniz'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* districts undefined olabilir, güvenli map'leme (districts?.map) yapıyoruz */}
                    {districts?.map((district) => (
                      <SelectItem
                        key={district.id}
                        value={district.id.toString()}
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* MAHALLE SEÇİMİ */}
          <Controller
            name="neighborhoodId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mahalle</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                  disabled={!currentDistrict || isLoadingNeighborhoods}
                >
                  <SelectTrigger id={field.name}>
                    {isLoadingNeighborhoods ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Yükleniyor...
                      </div>
                    ) : (
                      <SelectValue
                        placeholder={
                          !currentDistrict
                            ? 'Önce ilçe seçiniz'
                            : 'Mahalle Seçiniz'
                        }
                      />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods?.map((neighborhood) => (
                      <SelectItem
                        key={neighborhood.id}
                        value={neighborhood.id.toString()}
                      >
                        {neighborhood.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </TabsContent>
  );
}
