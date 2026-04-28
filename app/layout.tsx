import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Can Gayrimenkul',
  description:
    'Can Gayrimenkul - Emlak sektöründe güvenilir ve kaliteli hizmet sunan lider firma. Satılık ve kiralık gayrimenkul seçenekleriyle hayalinizdeki evi bulmanıza yardımcı oluyoruz. Profesyonel ekibimizle müşteri memnuniyetini ön planda tutarak, güvenilir ve hızlı çözümler sunuyoruz. Can Gayrimenkul ile hayalinizdeki evi keşfedin ve güvenle yatırım yapın.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
