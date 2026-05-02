'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { VerifyOtpFormValues, verifyOtpSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound, Loader2, Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface OtpVerificationFormProps {
  email: string;
  isVerifying: boolean;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
}

export default function OtpVerificationForm({
  email,
  isVerifying,
  onVerify,
  onBack,
}: OtpVerificationFormProps) {
  const { handleSubmit, control } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    mode: 'onTouched',
    defaultValues: { code: '' },
  });

  return (
    <form onSubmit={handleSubmit((data) => onVerify(data.code))}>
      <p className="bg-blue-50/50 text-blue-800 p-3 rounded-md text-sm mb-4 border border-blue-100">
        <span className="font-semibold">{email}</span> adresine gönderilen 6
        haneli doğrulama kodunu girin.
      </p>

      <FieldGroup>
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Doğrulama Kodu</FieldLabel>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="123456"
                  maxLength={6}
                  className="pl-9 text-center tracking-widest text-lg font-mono"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-3 mt-4 min-w-0 w-fit">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isVerifying}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Kaydet
        </Button>
      </div>
    </form>
  );
}
