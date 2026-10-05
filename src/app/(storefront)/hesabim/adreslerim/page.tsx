import { redirect } from "next/navigation";
import AddressManager from "@/components/account/AddressManager";
import { getSessionUser } from "@/lib/auth";
import { getAddresses } from "@/server/account";

export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const addresses = await getAddresses(session.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">Adreslerim</h1>
        <p className="mt-1 text-sm text-ink-500">
          Teslimat adreslerinizi ekleyin, düzenleyin veya varsayılan olarak belirleyin.
        </p>
      </div>
      <AddressManager addresses={addresses} />
    </div>
  );
}
