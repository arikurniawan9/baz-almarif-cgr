// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Scale, Banknote, History, TrendingUp, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const stats = await prisma.muzakki.aggregate({
    _count: { id: true },
    _sum: { jumlahJiwa: true, jumlahBeras: true, jumlahUang: true },
  });

  const recentActivities = await prisma.muzakki.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { petugas: { select: { name: true } } },
  });

  const chartDataRaw = (await prisma.$queryRaw`
    SELECT DATE_TRUNC('day', "tanggal") as date, COUNT(id) as count
    FROM "Muzakki"
    GROUP BY date
    ORDER BY date ASC
    LIMIT 7
  `) as any[];

  // Asumsi target tahunan (bisa disesuaikan atau diambil dari Setting nanti)
  const targetJiwa = 1000;
  const progressJiwa = Math.min(((stats._sum.jumlahJiwa || 0) / targetJiwa) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-950 dark:text-white flex items-center gap-3">
            Dashboard Overview
            <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Ringkasan penerimaan zakat fitrah real-time</p>
        </div>
        <Badge variant="outline" className="w-fit bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-200 px-3 py-1 text-xs font-bold uppercase tracking-widest">
          Tahun Zakat 2026
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass group hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 border-white/40 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <Users className="h-32 w-32 -mr-10 -mt-10" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Keluarga</CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-indigo-950 dark:text-white">{stats._count.id}</div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Muzakki Terdaftar
            </p>
          </CardContent>
        </Card>

        <Card className="glass group hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 border-white/40 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Jiwa</CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-indigo-950 dark:text-white">{stats._sum.jumlahJiwa || 0}</div>
            <div className="mt-3 h-1.5 w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" 
                style={{ width: `${progressJiwa}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-1.5 text-right">{progressJiwa.toFixed(1)}% dari target</p>
          </CardContent>
        </Card>

        <Card className="glass group hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 border-white/40 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Beras Terkumpul</CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:rotate-12 transition-transform duration-300">
              <Scale className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-emerald-950 dark:text-emerald-50">{(stats._sum.jumlahBeras || 0).toFixed(1)}</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">Kilogram (kg)</p>
          </CardContent>
        </Card>

        <Card className="glass group hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-500 border-white/40 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Uang Terkumpul</CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-300">
              <Banknote className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl lg:text-4xl font-black text-blue-950 dark:text-blue-50 tracking-tight">
              <span className="text-lg mr-1 text-blue-950/50">Rp</span>
              {(stats._sum.jumlahUang || 0).toLocaleString('id-ID')}
            </div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2">Rupiah (IDR)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="glass col-span-4 border-white/40 shadow-xl shadow-indigo-100/10">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800/50 bg-white/40 dark:bg-black/20 rounded-t-xl">
            <CardTitle className="text-lg font-black text-indigo-950 dark:text-white">Tren Penerimaan Harian</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DashboardCharts data={chartDataRaw} />
          </CardContent>
        </Card>

        <Card className="glass col-span-3 border-white/40 shadow-xl shadow-indigo-100/10 flex flex-col">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800/50 bg-white/40 dark:bg-black/20 rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black text-indigo-950 dark:text-white flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-500" />
                Aktivitas Terbaru
              </CardTitle>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {recentActivities.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 font-medium">Belum ada aktivitas tercatat</div>
              ) : (
                recentActivities.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-white/40 dark:hover:bg-black/20 transition-colors flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      {item.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{item.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={
                          item.jenisZakat === 'BERAS' 
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-[9px] px-1.5 py-0" 
                            : "border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 text-[9px] px-1.5 py-0"
                        }>
                          {item.jenisZakat}
                        </Badge>
                        <span className="text-xs font-semibold text-gray-500">
                          {item.jenisZakat === 'BERAS' ? `${item.jumlahBeras} kg` : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate max-w-[80px]">by {item.petugas?.name.split(' ')[0]}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
