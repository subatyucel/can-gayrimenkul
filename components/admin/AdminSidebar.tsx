"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "İlanlarım", href: "/admin/ilanlar", icon: Home },
  { name: "Yeni İlan Ekle", href: "/admin/ilanlar/yeni", icon: PlusCircle },
  { name: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];
interface AdminSidebarProps {
  isMobile?: boolean;
}

export function AdminSidebar({ isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname();

  const containerClasses = isMobile
    ? "flex flex-col h-full w-full bg-card max-h-screen overflow-hidden"
    : "hidden w-64 flex-col border-r bg-card md:flex h-screen sticky top-0";

  return (
    <div className={containerClasses}>
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-primary"
        >
          <Building2 className="h-6 w-6" />
          <span>Can Gayrimenkul</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 min-h-0 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 ">
        <form action={logout}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </Button>
        </form>
      </div>
    </div>
  );
}
