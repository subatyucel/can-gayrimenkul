'use client';

import { requestPasswordReset } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/lib/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await requestPasswordReset(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="sendResetLink">
      <FieldGroup>
        {/* E Posta */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>E-Posta</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="example@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="cursor-pointer"
          type="submit"
          form="sendResetLink"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Sıfırlama Linki Gönder
              <Send />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
