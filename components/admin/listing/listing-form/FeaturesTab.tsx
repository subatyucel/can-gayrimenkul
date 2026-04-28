import { Checkbox } from '@/components/ui/checkbox';
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
import { featureOptions } from '@/lib/validations/listing';
import { ListingFormTabProps } from '@/types';
import { Controller } from 'react-hook-form';

export default function FeaturesTab({ form }: ListingFormTabProps) {
  const { control } = form;
  return (
    <TabsContent value="features">
      <FieldGroup>
        {/* SAYISAL DEĞERLER GRUBU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Net metrekare */}
          <Controller
            name="netSquareMeters"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Net m&sup2;</FieldLabel>
                <Input
                  placeholder="M&sup2; cinsinden net"
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Brüt metrekare */}
          <Controller
            name="grossSquareMeters"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Brüt m&sup2;</FieldLabel>
                <Input
                  placeholder="M&sup2; cinsinden brüt"
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Bina yaşı */}
          <Controller
            name="buildingAge"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bina Yaşı</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="Bina yaşı"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Toplam KAt */}
          <Controller
            name="totalFloor"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Binadaki Toplam Kat
                </FieldLabel>
                <Input
                  placeholder="Binada bulunan toplam kat"
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Banyo sayısı */}
          <Controller
            name="bathroomCount"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Banyo Sayısı</FieldLabel>
                <Input
                  placeholder="Banyo sayısı"
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="dues"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Aidat (₺) (Yoksa 0 giriniz)
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Aidat"
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* SELECT GRUBU */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-6 border-t">
          <Controller
            name="roomCount"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Oda Sayısı</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.ROOM.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
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

          <Controller
            name="floorAt"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bulunduğu Kat</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.FLOOR.map((floor) => (
                      <SelectItem key={floor} value={floor}>
                        {floor}
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

          <Controller
            name="kitchenType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mutfak Tipi</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.KITCHEN.map((kitchen) => (
                      <SelectItem key={kitchen} value={kitchen}>
                        {kitchen}
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

          <Controller
            name="heating"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Isıtma</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.HEATING.map((heating) => (
                      <SelectItem key={heating} value={heating}>
                        {heating}
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

          <Controller
            name="parking"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Otopark Tipi</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur();
                  }}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.PARKING.map((parking) => (
                      <SelectItem key={parking} value={parking}>
                        {parking}
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

        {/* CHECKBOX GRUBU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          <Controller
            name="balcony"
            control={control}
            render={({ field }) => (
              <div
                className={`flex items-center space-x-2 p-3 border rounded-md ${field.value ? 'border-emerald-600' : 'border-rose-300'} bg-secondary/20 transition-colors`}
              >
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer "
                >
                  Balkon Var
                </label>
              </div>
            )}
          />

          <Controller
            name="elevator"
            control={control}
            render={({ field }) => (
              <div
                className={`flex items-center space-x-2 p-3 border rounded-md ${field.value ? 'border-emerald-600' : 'border-rose-300'} bg-secondary/20 transition-colors`}
              >
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Asansör Var
                </label>
              </div>
            )}
          />

          <Controller
            name="furnished"
            control={control}
            render={({ field }) => (
              <div
                className={`flex items-center space-x-2 p-3 border rounded-md ${field.value ? 'border-emerald-600' : 'border-rose-300'} bg-secondary/20 transition-colors`}
              >
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Eşyalı
                </label>
              </div>
            )}
          />

          <Controller
            name="creditworthy"
            control={control}
            render={({ field }) => (
              <div
                className={`flex items-center space-x-2 p-3 border rounded-md ${field.value ? 'border-emerald-600' : 'border-rose-300'} bg-secondary/20 transition-colors`}
              >
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Krediye Uygun
                </label>
              </div>
            )}
          />
        </div>
      </FieldGroup>
    </TabsContent>
  );
}
