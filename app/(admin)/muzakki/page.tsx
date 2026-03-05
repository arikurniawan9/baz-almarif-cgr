// app/muzakki/page.tsx
import { getMuzakkis } from "@/actions/muzakki";
import { MuzakkiList } from "@/components/muzakki/MuzakkiList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MuzakkiPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const q = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");

  const { data, total, pages } = await getMuzakkis(q, page);
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Muzakki</h1>
      </div>

      <MuzakkiList 
        initialData={data} 
        total={total} 
        pages={pages} 
        currentPage={page} 
        search={q}
        userId={(session?.user as any)?.id || ""}
        hargaBeras={settings?.hargaBeras || 15000}
      />
    </div>
  );
}
