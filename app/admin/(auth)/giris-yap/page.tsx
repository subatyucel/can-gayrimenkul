import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import LoginForm from '@/components/admin/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center bg-muted">
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
    </main>
  );
}
