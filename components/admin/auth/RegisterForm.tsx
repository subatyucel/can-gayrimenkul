'use client';

import { confirmRegister, requestRegister } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RegisterFormValues, registerSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import OtpVerificationForm from './OtpVerificationForm';

export default function RegisterForm({ token }: { token: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [pendingData, setPendingData] = useState<RegisterFormValues | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const requestForm = useForm({
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

  async function onRequestSubmit(data: RegisterFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await requestRegister(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    setPendingData(data);
    setStep('verify');
  }

  async function handleVerifySubmit(code: string) {
    if (!pendingData) return;
    setIsVerifying(true);
    const toastId = toast.loading(
      'Kod doğrulanıyor ve kaydınız tamamlanıyor...',
    );

    const response = await confirmRegister(pendingData, code);
    setIsVerifying(false);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    router.replace('/admin/giris-yap');
  }

  return (
    <>
      {step === 'request' && (
        <form
          onSubmit={requestForm.handleSubmit(onRequestSubmit)}
          className="flex flex-col gap-6"
          id="registerForm"
        >
          <FieldGroup>
            {/* Ad Soyad */}
            <Controller
              name="fullName"
              control={requestForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Ad Soyad</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* E-posta */}
            <Controller
              name="email"
              control={requestForm.control}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Şifre */}
            <Controller
              name="password"
              control={requestForm.control}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Şifre (Tekrar) */}
            <Controller
              name="confirmPassword"
              control={requestForm.control}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Hidden input for token */}
            <Controller
              name="token"
              control={requestForm.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </FieldGroup>
          <Button
            disabled={requestForm.formState.isSubmitting}
            type="submit"
            form="registerForm"
          >
            {requestForm.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Kayıt Ol'
            )}
          </Button>
        </form>
      )}
      {step === 'verify' && pendingData && (
        <OtpVerificationForm
          email={pendingData.email}
          isVerifying={isVerifying}
          onVerify={handleVerifySubmit}
          onBack={() => setStep('request')}
        />
      )}
    </>
  );
}
