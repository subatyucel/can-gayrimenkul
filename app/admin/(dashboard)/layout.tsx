import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky md:hidden top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="sr-only">
                <SheetTitle>Yönetim Paneli Menüsü</SheetTitle>
                <SheetDescription>
                  Sayfalar arası hızlı geçiş paneli
                </SheetDescription>
              </div>

              <AdminSidebar isMobile />
            </SheetContent>
          </Sheet>

          <div className="flex-1"></div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
