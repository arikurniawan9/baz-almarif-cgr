import { getAuditLogs } from "@/actions/audit";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Activity, ShieldAlert } from "lucide-react";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "20");

  const { data, total, pages } = await getAuditLogs(q, page, limit);

  const getActionColor = (action: string) => {
    switch(action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      case 'LOGIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EXPORT': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tighter text-indigo-950 dark:text-white flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-indigo-500" />
          Sistem Audit Log
        </h1>
        <p className="text-sm text-slate-500 font-medium">Rekam jejak aktivitas penting yang terjadi di dalam aplikasi.</p>
      </div>

      <div className="border rounded-[2.5rem] bg-white dark:bg-gray-950 overflow-hidden shadow-2xl shadow-indigo-500/5 border-slate-200 dark:border-white/5">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-500" />
          <h3 className="font-black uppercase text-[10px] tracking-widest text-indigo-950/50 dark:text-white/50">Riwayat Aktivitas</h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="border-none">
                <TableHead className="w-[180px] pl-8 font-black uppercase text-[9px] tracking-widest">Waktu</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Aktor</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Aksi</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Entitas</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500 font-medium">Belum ada log yang terekam.</TableCell>
                </TableRow>
              ) : (
                data.map((log) => (
                  <TableRow key={log.id} className="border-slate-50 dark:border-white/5 hover:bg-slate-50/50">
                    <TableCell className="pl-8 text-xs font-semibold text-slate-500">
                      {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-700">
                          {log.user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{log.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${getActionColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {log.entity}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {log.details ? log.details : "-"}
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
