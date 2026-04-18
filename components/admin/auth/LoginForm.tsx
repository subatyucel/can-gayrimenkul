'use client';

import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoginFormValues, loginSchema } from '@/lib/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await login(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success('Hoşgeldiniz', { id: toastId });
    router.push('/admin');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="loginForm">
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

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name}>Şifre</FieldLabel>
                <Link
                  href="/admin/sifremi-unuttum"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Şifremi Unuttum
                </Link>
              </div>
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

        <Button
          disabled={isSubmitting}
          className="cursor-pointer"
          type="submit"
          form="loginForm"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Giriş Yap
              <LogIn />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
