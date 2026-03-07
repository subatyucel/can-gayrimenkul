import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/settings";
import { SettingsPage } from "@/components/admin/SettingsPage";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

  return <SettingsPage currentEmail={user.email} role={user.role} />;
}
