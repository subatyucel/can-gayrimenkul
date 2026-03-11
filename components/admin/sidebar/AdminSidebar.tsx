"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { menuItems } from "@/lib/constans";
import NavLinkItem from "./NavLinkItem";

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
            <NavLinkItem
              key={item.href}
              href={item.href}
              name={item.name}
              isActive={isActive}
              Icon={item.icon}
            />
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
