import { LayoutDashboard, ListCheck, PlusCircle, Settings } from 'lucide-react';

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'İlanlarım', href: '/admin/ilanlar', icon: ListCheck },
  {
    label: 'Yeni İlan Ekle',
    href: '/admin/ilanlar/ilan-olustur',
    icon: PlusCircle,
  },
  { label: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
];
