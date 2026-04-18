import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ForgotPasswordForm from '@/components/admin/auth/ForgotPasswordForm';
import Link from 'next/link';
import { type NextPageProps } from '@/types';
import { verifyToken } from '@/lib/auth';
import ResetPasswordForm from '@/components/admin/auth/ResetPasswordForm';

export default async function ForgotPasswordPage({
  searchParams,
}: NextPageProps<{ t?: string }>) {
  const { t: token } = await searchParams;
  const isTokenValid = token && (await verifyToken(token));

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Card className="overflow-hidden w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isTokenValid ? 'Şifre Sıfırla' : 'Şifremi Unuttum'}
          </CardTitle>

          <CardDescription>
            {isTokenValid
              ? 'Yeni şifrenizi belirleyin'
              : 'E-posta adresinize şifre sıfırlama linki göndereceğiz'}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 md:px-8 text-center">
          {isTokenValid ? (
            <ResetPasswordForm token={token} />
          ) : (
            <ForgotPasswordForm />
          )}
          <Link
            href="/admin/giris-yap"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Giriş sayfasına dön
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
