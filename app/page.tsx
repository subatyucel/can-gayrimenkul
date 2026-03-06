import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  MapPin,
  Phone,
  ShieldCheck,
  Gem,
  Compass,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] text-[#c5a059] selection:bg-[#c5a059]/30 min-h-screen">
      <section className="relative h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#c5a059]/10 via-transparent to-transparent opacity-40" />

        <div className="relative z-10 space-y-10 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center ">
            <Image
              src="/logo.svg"
              width={600}
              height={600}
              alt="logo"
              className="w-150"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-serif tracking-tighter text-white uppercase">
              CAN <span className="text-[#c5a059]">GAYRİMENKUL</span>
            </h1>
            <p className="text-[#c5a059] text-sm md:text-base tracking-[0.6em] uppercase font-light">
              Gayrimenkul ve Yatırım Danışmanlığı
            </p>
          </div>

          <h2 className="text-white text-xl md:text-4xl font-serif italic font-light opacity-90">
            &quot;Gayrimenkulde Güvenin Altın Adresi&quot;
          </h2>

          <div className="pt-12">
            <Button
              asChild
              size="lg"
              className="bg-[#c5a059] hover:bg-[#b08d4a] text-black font-bold px-16 py-8 text-xl rounded-none border-none transition-all duration-500 hover:tracking-[0.2em] shadow-[0_0_30px_rgba(197,160,89,0.3)]"
            >
              <Link href="/ilanlar">İLANLARIMIZI GÖRÜN</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce opacity-30">
          <ChevronDown className="h-10 w-10 text-white" />
        </div>
      </section>

      <section className="py-32 md:py-48 bg-[#0f0f0f] border-y border-[#c5a059]/10 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h3 className="text-[#c5a059] tracking-[0.4em] uppercase text-xs">
                Kurumsal Profil
              </h3>
              <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                Seçkin Portföy, <br /> Profesyonel{" "}
                <span className="text-[#c5a059]">Hizmet</span>
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed italic">
                Can Gayrimenkul, Karşıyaka merkezli butik danışmanlık
                anlayışıyla, yatırımcılarına en prestijli ve yüksek getirili
                fırsatları sunmak üzere kurulmuştur.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 border border-[#c5a059]/10 bg-black/50 space-y-4">
                <ShieldCheck className="h-8 w-8 text-[#c5a059]" />
                <h4 className="text-white font-serif text-xl">Güven</h4>
                <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-tighter">
                  Şeffaf ve yasal süreç yönetimi.
                </p>
              </div>
              <div className="p-8 border border-[#c5a059]/10 bg-black/50 space-y-4">
                <Compass className="h-8 w-8 text-[#c5a059]" />
                <h4 className="text-white font-serif text-xl">Rehberlik</h4>
                <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-tighter">
                  Doğru zamanda doğru yatırım.
                </p>
              </div>
              <div className="p-8 border border-[#c5a059]/10 bg-black/50 space-y-4 sm:col-span-2">
                <Gem className="h-8 w-8 text-[#c5a059]" />
                <h4 className="text-white font-serif text-xl">
                  Butik Yaklaşım
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-tighter">
                  Sadece sizin için seçilmiş özel ilanlar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="space-y-6">
              <p className="text-white text-2xl font-serif italic tracking-wide">
                Bize Ulaşın
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
                <div className="flex flex-col items-center gap-3">
                  <Phone className="h-6 w-6 text-[#c5a059]" />
                  <Link
                    href="tel:+902323812381"
                    className="text-white tracking-[0.2em] font-light text-lg"
                  >
                    +90 232 381 23 81
                  </Link>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <MapPin className="h-6 w-6 text-[#c5a059]" />
                  <span className="text-gray-400 font-light text-sm text-center">
                    Nergiz Mah. 1775/3 Sok. No:17/A <br /> Karşıyaka / İZMİR
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px w-32 bg-[#c5a059]/30 mx-auto" />

            <footer className="text-[9px] tracking-[0.8em] uppercase opacity-30 text-white">
              © 2026 CAN GAYRİMENKUL - EST. İZMİR <br /> Developed by{" "}
              <Link
                href="https://github.com/subatyucel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Şubat Yücel
              </Link>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}
