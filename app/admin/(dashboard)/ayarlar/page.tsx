import { redirect } from "next/navigation";
import { SettingsPage } from "@/components/admin/SettingsPage";
import { getCurrentUser } from "@/actions/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/giris-yap");

  return <SettingsPage currentEmail={user.email} role={user.role} />;
}
