// app/(admin)/muzakki/page.tsx
import { getMuzakkis } from "@/actions/muzakki";
import { MuzakkiList } from "@/components/muzakki/MuzakkiList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MuzakkiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const q = params.q || "";
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");

  const { data, total, pages } = await getMuzakkis(q, page, limit);
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaksi Zakat Fitrah</h1>
      </div>

      <MuzakkiList 
        initialData={data} 
        total={total} 
        pages={pages} 
        currentPage={page} 
        limit={limit}
        search={q}
        userId={(session?.user as any)?.id || ""}
        settings={settings}
      />
    </div>
  );
}
