import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />

      {/* Sağ taraftaki ana içerik alanı */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobil menü butonu ve kullanıcı profili buraya gelecek */}
          <div className="flex-1"></div>
        </header>

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
