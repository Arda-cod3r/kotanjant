import { redirect } from "next/navigation";
import PreferencesForm from "@/components/account/PreferencesForm";
import { getSessionUser } from "@/lib/auth";
import { getUserProfile } from "@/server/account";

export const dynamic = "force-dynamic";

export default async function AccountPreferencesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const profile = await getUserProfile(session.id);
  if (!profile) redirect("/giris");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">İletişim Tercihlerim</h1>
        <p className="mt-1 text-sm text-ink-500">
          Hangi kanallardan bilgilendirilmek istediğinizi seçin.
        </p>
      </div>
      <div className="border border-ink-100 bg-white p-6">
        <PreferencesForm profile={profile} />
      </div>
    </div>
  );
}
