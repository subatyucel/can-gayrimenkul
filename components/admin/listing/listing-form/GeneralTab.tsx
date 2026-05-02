import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ListingFormTabProps } from '@/types';
import { Controller } from 'react-hook-form';

export default function GeneralTab({ form }: ListingFormTabProps) {
  const { control } = form;

  return (
    <TabsContent value="general">
      <FieldGroup>
        {/* İlan Başlığı */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>İlan Başlığı</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Örn: Karşıyaka'da Deniz Manzaralı 3+1"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* İlan Açıklaması */}
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>İlan Açıklaması</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="İlan detaylarını buraya yazınız..."
                className="min-h-30"
                aria-invalid={fieldState.invalid}
                rows={5}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* İlan Türü (Select) */}
          <Controller
            name="listingType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>İlan Türü</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  onOpenChange={(open) => {
                    if (!open) {
                      field.onBlur();
                    }
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Satılık</SelectItem>
                    <SelectItem value="rent">Kiralık</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Fiyat Bilgisi */}
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Fiyat (TL)</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  placeholder="5.000.000"
                  aria-invalid={fieldState.invalid}
                />
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
