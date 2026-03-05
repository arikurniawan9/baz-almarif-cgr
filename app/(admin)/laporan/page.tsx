// app/laporan/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportActions } from "@/components/report/ReportActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReportPage() {
  const stats = await prisma.muzakki.aggregate({
    _count: { id: true },
    _sum: { jumlahJiwa: true, jumlahBeras: true, jumlahUang: true },
  });

  const muzakkis = await prisma.muzakki.findMany({
    orderBy: { createdAt: "desc" },
    include: { petugas: { select: { name: true } } },
  });

  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rekap & Laporan</h1>
        <ReportActions data={muzakkis} settings={settings} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Muzakki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats._count.id}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jiwa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats._sum.jumlahJiwa || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beras (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats._sum.jumlahBeras || 0).toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uang (Rp)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats._sum.jumlahUang || 0).toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jiwa</TableHead>
              <TableHead>Zakat</TableHead>
              <TableHead>Petugas</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {muzakkis.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.jumlahJiwa}</TableCell>
                <TableCell>
                  {item.jenisZakat === 'BERAS' 
                    ? `${item.jumlahBeras} kg` 
                    : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`}
                </TableCell>
                <TableCell>{item.petugas?.name}</TableCell>
                <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
