"use client";

import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a1010 0%, #0a0a0a 70%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#c5a059 1px, transparent 1px), linear-gradient(90deg, #c5a059 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        {/* 500 */}
        <p className="text-[120px] md:text-[180px] font-serif font-bold leading-none text-gold opacity-10 select-none">
          500
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 -mt-4 mb-8">
          <div className="h-px w-16 bg-gold opacity-30" />
          <span className="text-gold text-xs tracking-[0.5em] uppercase opacity-60">
            Sunucu Hatası
          </span>
          <div className="h-px w-16 bg-gold opacity-30" />
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-white/90 mb-4 tracking-wide">
          Beklenmeyen bir hata oluştu
        </h1>

        <p className="text-white/40 text-sm tracking-widest max-w-xs mb-12">
          Sorun bizim tarafımızda, lütfen tekrar deneyiniz.
        </p>

        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-10 py-3.5 bg-gold text-black text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:tracking-[0.4em]"
          >
            Tekrar Dene
          </button>
          <Link
            href="/ilanlar"
            className="px-10 py-3.5 border border-gold/30 text-gold text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:border-gold/60 hover:bg-gold/5"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
