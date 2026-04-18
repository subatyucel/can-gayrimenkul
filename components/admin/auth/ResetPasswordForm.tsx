'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/lib/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RotateCcw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
      token,
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    console.log('form submitted', data);
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Şifreniz başarıyla değiştirildi.', { id: toastId });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      id="resetPassword"
    >
      <FieldGroup>
        {/* Şifre */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Şifre</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="*******"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Şifre (Tekrar) */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Şifre (Tekrar)</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="*******"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Hidden input for token */}
        <Controller
          name="token"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
      </FieldGroup>
      <Button
        disabled={isSubmitting}
        type="submit"
        form="resetPassword"
        className="cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Şifreyi Sıfırla <RotateCcw />
          </>
        )}
      </Button>
    </form>
  );
}
