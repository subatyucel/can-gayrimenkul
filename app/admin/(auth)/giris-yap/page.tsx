'use client';

import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/admin/auth/LoginForm';
import { Field } from '@/components/ui/field';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginFormInside />
    </Suspense>
  );
}

function LoginFormInside() {
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const isReset = searchParams.get('reset') === 'success';
  const isRegistered = searchParams.get('register') === 'true';

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <Card className="grid grid-cols-1 md:grid-cols-2 overflow-hidden w-full max-w-sm md:max-w-3xl mx-auto border-none md:border sm:rounded-xl">
      <div className="p-6 md:p-10 flex flex-col justify-center">
        <CardHeader className="p-0 mb-6 space-y-1">
          <CardTitle className="text-2xl font-bold">
            Tekrar Hoş Geldiniz
          </CardTitle>
          <CardDescription>
            Can Gayrimenkul Admin Paneline giriş yapın
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <LoginForm />
        </CardContent>
      </div>

      <div className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
          alt="Modern Real Estate"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <div className="absolute inset-0 bg-slate-900/40  flex flex-col items-center justify-center text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">CAN GAYRİMENKUL</h2>
          <p className="italic text-sm">
            &quot;Karşıyaka&apos;nın en prestijli portföy yönetimi&quot;
          </p>
        </div>
      </div>
    </Card>
  );

  // return (
  //   <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
  //     <Card className="overflow-hidden w-full max-w-sm md:max-w-3xl">
  //       <CardContent className="grid p-0 md:grid-cols-2">
  //         <form action={handleSubmit} className="p-6 md:p-8">
  //           <div className="flex flex-col gap-6">
  //             <div className="flex flex-col items-center text-center">
  //               <CardTitle className="text-2xl font-bold">
  //                 Tekrar Hoş Geldiniz
  //               </CardTitle>
  //               <CardDescription>
  //                 Can Gayrimenkul Admin Paneline giriş yapın
  //               </CardDescription>
  //             </div>

  //             {isReset && (
  //               <div className="bg-green-500/15 text-green-700 text-sm p-3 rounded-md text-center">
  //                 Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş
  //                 yapabilirsiniz.
  //               </div>
  //             )}

  //             {isRegistered && (
  //               <div className="bg-green-500/15 text-green-700 text-sm p-3 rounded-md text-center">
  //                 Başarıyla kayıt oldunuz. Bilgilerinizi doldurarak giriş
  //                 yapabilirsiniz.
  //               </div>
  //             )}

  //             {error && (
  //               <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
  //                 {error}
  //               </div>
  //             )}

  //             <div className="grid gap-2">
  //               <Label htmlFor="email">E-posta</Label>
  //               <Input
  //                 id="email"
  //                 name="email"
  //                 type="email"
  //                 placeholder="example@example.com"
  //                 required
  //               />
  //             </div>
  //             <div className="grid gap-2">
  //               <div className="flex items-center justify-between">
  //                 <Label htmlFor="password">Şifre</Label>
  //                 <Link
  //                   href="/admin/sifremi-unuttum"
  //                   className="text-sm text-muted-foreground underline-offset-4 hover:underline"
  //                 >
  //                   Şifremi Unuttum
  //                 </Link>
  //               </div>
  //               <Input
  //                 id="password"
  //                 name="password"
  //                 type="password"
  //                 placeholder="*******"
  //                 required
  //               />
  //             </div>

  //             <SubmitButton />
  //           </div>
  //         </form>

  //         <div className="relative hidden bg-muted md:block h-full w-full">
  //           <Image
  //             src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
  //             alt="Modern Real Estate"
  //             fill
  //             className="object-cover dark:brightness-[0.2] dark:grayscale"
  //             priority
  //             sizes="(max-width: 768px) 100vw, 50vw"
  //           />
  //           <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center p-8 text-white">
  //             <div className="text-center">
  //               <h3 className="text-2xl font-bold uppercase tracking-widest">
  //                 Can Gayrimenkul
  //               </h3>
  //               <p className="mt-2 text-sm opacity-90 italic text-white font-medium">
  //                 &quot;Karşıyaka&apos;nın en prestijli portföy yönetimi&quot;
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
    </Button>
  );
}
