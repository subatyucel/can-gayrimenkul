'use client';

import { registerUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  type RegisterFormValues,
  registerSchema,
} from '@/lib/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm({ token }: { token: string }) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      token,
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await registerUser(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    router.push('/admin/giris-yap?register=true');
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      id="registerForm"
    >
      <FieldGroup>
        {/* Ad Soyad */}
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ad Soyad</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* E-posta */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>E-posta</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
        form="registerForm"
        className="cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Kayıt Ol'}
      </Button>
    </form>
  );
}
