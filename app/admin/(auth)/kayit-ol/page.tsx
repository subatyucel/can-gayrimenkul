import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import RegisterForm from '@/components/admin/auth/RegisterForm';
import InvalidTokenCard from '@/components/admin/auth/InvalidTokenCard';
import { NextPageProps } from '@/types';
import { verifyToken } from '@/lib/auth';

export default async function RegisterPage({
  searchParams,
}: NextPageProps<{ t?: string }>) {
  const { t: token } = await searchParams;
  const isTokenValid = token && (await verifyToken(token));

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      {!isTokenValid ? (
        <InvalidTokenCard />
      ) : (
        <Card className="overflow-hidden w-full max-w-sm gap-0">
          <CardHeader className="text-center justify-items-center">
            <Image src="/logo.svg" width={80} height={80} alt="logo" />

            <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
            <CardDescription>
              Can Gayrimenkul yönetim paneline davet edildiniz
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <RegisterForm token={token} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
