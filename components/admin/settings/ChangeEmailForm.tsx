'use client';

import { confirmEmailChange, requestEmailChange } from '@/actions/auth';
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
  ChangeEmailFormValues,
  changeEmailSchema,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Save } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import OtpVerificationForm from '../auth/OtpVerificationForm';

export default function ChangeEmailForm({ email }: { email: string }) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const requestForm = useForm({
    resolver: zodResolver(changeEmailSchema),
    mode: 'onTouched',
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  async function onRequestSubmit(data: ChangeEmailFormValues) {
    const toastId = toast.loading('Bilgileriniz kontrol ediliyor...');
    const response = await requestEmailChange(data);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    setPendingEmail(data.newEmail);
    setStep('verify');
  }

  async function handleVerifySubmit(code: string) {
    setIsVerifying(true);
    const toastId = toast.loading('Kod doğrulanıyor...');
    const response = await confirmEmailChange(pendingEmail, code);
    setIsVerifying(false);

    if (!response.success) {
      toast.error(response.error, { id: toastId });
      return;
    }

    toast.success(response.message, { id: toastId });
    setStep('request');
    requestForm.reset();
    setPendingEmail('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          E-Posta Değiştir
        </CardTitle>
        <CardDescription>
          {step === 'request' ? (
            <>
              <span className="font-bold">{email}</span> olan e-posta adresinizi
              güncelleyin.
            </>
          ) : (
            'Yeni e-posta adresinizi doğrulayın.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'request' && (
          <form
            onSubmit={requestForm.handleSubmit(onRequestSubmit)}
            id="changePasswordForm"
          >
            <FieldGroup>
              {/* Yeni email */}
              <Controller
                name="newEmail"
                control={requestForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Yeni E-Posta</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="example@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* şifre */}
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
                      placeholder="Mevcut şifrenizi giriniz"
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
            email={pendingEmail}
            isVerifying={isVerifying}
            onVerify={handleVerifySubmit}
            onBack={() => setStep('request')}
          />
        )}
      </CardContent>
    </Card>
  );
}
