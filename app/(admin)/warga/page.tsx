// app/(admin)/warga/page.tsx
import { getWargas } from "@/actions/warga";
import { WargaList } from "@/components/warga/WargaList";

export default async function WargaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");

  const { data, total, pages } = await getWargas(q, page, limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Master Warga</h1>
      </div>

      <WargaList 
        initialData={data} 
        total={total} 
        pages={pages} 
        currentPage={page} 
        limit={limit}
        search={q}
      />
    </div>
  );
}
