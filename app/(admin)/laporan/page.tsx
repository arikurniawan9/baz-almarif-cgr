// app/(admin)/laporan/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportActions } from "@/components/report/ReportActions";
import { ReportFilters } from "@/components/report/ReportFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ZakatType } from "@prisma/client";
import { Users, UserCheck, Scale, Banknote, Landmark, Heart, FileText, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { getActiveYear } from "@/actions/auth-year";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ wilayah?: string; petugas?: string; jenis?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const { wilayah, petugas, jenis, tahun } = params;

  const activeYear = tahun || await getActiveYear();
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  const where: any = {
    tahun: activeYear,
  };
  if (wilayah && wilayah !== "all") where.wilayahId = wilayah;
  if (petugas && petugas !== "all") where.petugasId = petugas;
  if (jenis && jenis !== "all") where.jenisZakat = jenis as ZakatType;

  const stats = await prisma.muzakki.aggregate({
    where,
    _count: { id: true },
    _sum: { jumlahJiwa: true, jumlahBeras: true, jumlahUang: true, infakDesa: true, infakMasjid: true },
  });

  const muzakkis = await prisma.muzakki.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { 
      petugas: { select: { name: true } },
      wilayah: { select: { nama: true } }
    },
  });

  const wilayahs = await prisma.wilayah.findMany({ orderBy: { nama: "asc" } });
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  // Ambil daftar tahun yang tersedia di database
  const availableYears = await prisma.muzakki.groupBy({
    by: ['tahun'],
    _count: { id: true },
    orderBy: { tahun: 'desc' }
  });

  const years = availableYears.map(y => y.tahun).filter(Boolean) as string[];
  if (settings?.tahunZakat && !years.includes(settings.tahunZakat)) {
    years.push(settings.tahunZakat);
    years.sort((a, b) => b.localeCompare(a));
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-indigo-950 dark:text-white">Rekapitulasi Zakat {activeYear}</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Laporan Real-time BAZ Al Ma'arif</p>
        </div>
        <ReportActions data={muzakkis} settings={{ ...settings, tahunZakat: activeYear }} />
      </div>

      {/* --- FILTERS --- */}
      <Suspense fallback={<div className="h-20 bg-slate-100 animate-pulse rounded-2xl" />}>
        <ReportFilters wilayahs={wilayahs} users={users} years={years} />
      </Suspense>

      {/* --- STATS GRID --- */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total KK" value={stats._count.id} icon={<Users className="h-4 w-4" />} color="indigo" />
        <StatCard title="Total Jiwa" value={stats._sum.jumlahJiwa || 0} icon={<UserCheck className="h-4 w-4" />} color="blue" />
        <StatCard title="Beras (KG)" value={(stats._sum.jumlahBeras || 0).toFixed(1)} icon={<Scale className="h-4 w-4" />} color="amber" />
        <StatCard title="Uang Zakat" value={(stats._sum.jumlahUang || 0).toLocaleString('id-ID')} icon={<Banknote className="h-4 w-4" />} color="emerald" prefix="Rp" />
        <StatCard title="Infak Desa" value={(stats._sum.infakDesa || 0).toLocaleString('id-ID')} icon={<Landmark className="h-4 w-4" />} color="slate" prefix="Rp" />
        <StatCard title="Infak Masjid" value={(stats._sum.infakMasjid || 0).toLocaleString('id-ID')} icon={<Heart className="h-4 w-4" />} color="purple" prefix="Rp" />
      </div>

      {/* --- TABLE CARD --- */}
      <div className="border rounded-[2.5rem] bg-white dark:bg-gray-950 overflow-hidden shadow-2xl shadow-indigo-500/5 border-slate-200 dark:border-white/5">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-500" />
          <h3 className="font-black uppercase text-[10px] tracking-widest text-indigo-950/50 dark:text-white/50">Rincian Data Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="border-none">
                <TableHead className="w-[60px] pl-8 font-black uppercase text-[9px] tracking-widest">No</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Muzakki / Wilayah</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Jiwa</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Kewajiban Zakat</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-center">Infak (D / M)</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-right pr-8">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {muzakkis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="h-8 w-8 opacity-10" />
                      <p className="font-black uppercase tracking-widest text-[10px]">Data tidak ditemukan</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                muzakkis.map((item, index) => (
                  <TableRow key={item.id} className="group border-slate-50 dark:border-white/5 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 font-bold text-slate-400 text-xs">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase">{item.nama}</div>
                      <div className="text-[10px] font-bold text-indigo-500">{item.wilayah?.nama || "-"}</div>
                    </TableCell>
                    <TableCell className="font-black text-slate-600">{item.jumlahJiwa}</TableCell>
                    <TableCell>
                      <Badge className={item.jenisZakat === 'BERAS' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
                        {item.jenisZakat === 'BERAS' ? `${item.jumlahBeras} KG` : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-bold">
                        <span className="text-slate-400">Rp {item.infakDesa.toLocaleString('id-ID')}</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-emerald-600">Rp {item.infakMasjid.toLocaleString('id-ID')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8 text-[10px] font-bold text-slate-400">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, prefix = "" }: any) {
  const colors: any = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200",
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
    amber: "from-amber-500 to-amber-600 shadow-amber-200",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    slate: "from-slate-600 to-slate-700 shadow-slate-200",
    purple: "from-purple-500 to-purple-600 shadow-purple-200",
  };

  return (
    <Card className="rounded-3xl border-none shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className={`bg-gradient-to-br ${colors[color]} p-4 flex flex-row items-center justify-between space-y-0 text-white`}>
        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</CardTitle>
        <div className="p-1.5 bg-white/20 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent className="p-5 bg-white dark:bg-gray-900">
        <div className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">
          {prefix && <span className="text-xs mr-1 opacity-40 font-bold">{prefix}</span>}
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
