import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

export const metadata = {
  title: {
    default: "Can Gayrimenkul",
    template: "%s | Can Gayrimenkul",
  },
  description:
    "Can Gayrimenkul portföyündeki satılık ve kiralık gayrimenkul ilanlarını inceleyin.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col selection:bg-[#c5a059]/20">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              width={36}
              height={36}
              alt="Can Gayrimenkul"
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-[#c5a059] font-serif tracking-wider text-sm uppercase hidden sm:block">
              Can Gayrimenkul
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/ilanlar"
              className="text-xs tracking-[0.3em] uppercase text-gray-500 hover:text-[#c5a059] transition-colors"
            >
              İlanlar
            </Link>
            <Link
              href="/#iletisim"
              className="text-xs tracking-[0.3em] uppercase text-gray-500 hover:text-[#c5a059] transition-colors"
            >
              İletişim
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                width={28}
                height={28}
                alt="Can Gayrimenkul"
                className="opacity-70"
              />
              <span className="text-[#c5a059] font-serif tracking-wider text-xs uppercase">
                Can Gayrimenkul
              </span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#c5a059]/60" />
                <Link
                  href="tel:+902323812381"
                  className="hover:text-[#c5a059] transition-colors tracking-wider"
                >
                  +90 232 381 23 81
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#c5a059]/60" />
                <span className="tracking-wide">
                  Nergiz Mah. Karşıyaka / İZMİR
                </span>
              </div>
            </div>

            <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 text-center">
              © 2026 CAN GAYRİMENKUL
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
