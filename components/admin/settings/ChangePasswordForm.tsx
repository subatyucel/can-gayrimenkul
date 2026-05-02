'use client';

import { confirmPasswordChage, requestPasswordChange } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import OtpVerificationForm from '../auth/OtpVerificationForm';

export default function ChangePasswordForm() {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [userEmail, setUserEmail] = useState('');
  const [pendingNewPassword, setPendingNewPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const requestForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onRequestSubmit(data: ChangePasswordFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await requestPasswordChange(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }
    toast.success(response.message, { id: toastId });
    setUserEmail(response.data!.email);
    setPendingNewPassword(data.newPassword);
    setStep('verify');
  }

  async function handleVerifySubmit(code: string) {
    setIsVerifying(true);
    const toastId = toast.loading(
      'Kod doğrulanıyor ve şifreniz değiştiriliyor...',
    );

    const response = await confirmPasswordChage(pendingNewPassword, code);
    setIsVerifying(false);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    setStep('request');
    requestForm.reset();
    setPendingNewPassword('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Şifre Değiştir
        </CardTitle>
        <CardDescription>
          {step === 'request'
            ? 'Mevcut şifrenizi güncelleyin'
            : 'İşlemi tamamlamak için doğrulama kodunu girin'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'request' && (
          <form
            onSubmit={requestForm.handleSubmit(onRequestSubmit)}
            id="changePasswordForm"
          >
            <FieldGroup>
              {/* Mevcut Şifre */}
              <Controller
                name="password"
                control={requestForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Mevcut Şifre</FieldLabel>
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

              {/* Yeni şifre */}
              <Controller
                name="newPassword"
                control={requestForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Yeni Şifre</FieldLabel>
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

              {/* Yeni şifre tekrar */}
              <Controller
                name="confirmPassword"
                control={requestForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Yeni Şifre (Tekrar)
                    </FieldLabel>
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
            </FieldGroup>

            <Button
              type="submit"
              disabled={requestForm.formState.isSubmitting}
              className="mt-3"
            >
              {requestForm.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <Save className="h-4 w-4" />
              Kaydet
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <OtpVerificationForm
            email={userEmail}
            isVerifying={isVerifying}
            onVerify={handleVerifySubmit}
            onBack={() => setStep('request')}
          />
        )}
      </CardContent>
    </Card>
  );
}
