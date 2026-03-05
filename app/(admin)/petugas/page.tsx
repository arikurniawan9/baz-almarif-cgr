// app/petugas/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions/user";
import { PetugasList } from "@/components/user/PetugasList";

export default async function PetugasPage() {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Petugas</h1>
      <PetugasList initialData={users} />
    </div>
  );
}
