import ChangeEmailForm from '@/components/admin/settings/ChangeEmailForm';
import ChangePasswordForm from '@/components/admin/settings/ChangePasswordForm';
import InviteUser from '@/components/admin/settings/InviteUser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/auth';
import { UserLock, UserPlus, UserSearch } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/giris-yap');
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Tabs className="w-full" defaultValue="security">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
            <TabsTrigger value="security">
              <UserLock /> Güvenlik
            </TabsTrigger>

            <TabsTrigger value="contact">
              <UserSearch /> İletişim Bilgileri
            </TabsTrigger>

            <TabsTrigger value="invite">
              <UserPlus /> Davet Et
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="contact">
            <ChangeEmailForm email={user.email} />
          </TabsContent>

          <TabsContent value="invite">
            <InviteUser />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
