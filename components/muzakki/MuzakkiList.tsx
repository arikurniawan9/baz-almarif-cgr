// components/muzakki/MuzakkiList.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  User as UserIcon, 
  Trash,
  AlertTriangle,
  Heart,
  Eye,
  Calendar,
  UserCheck,
  Scale,
  Banknote
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MuzakkiForm } from "./MuzakkiForm";
import { deleteMuzakki, deleteMultipleMuzakki } from "@/actions/muzakki";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function MuzakkiList({
  initialData,
  total,
  pages,
  currentPage,
  limit,
  search,
  userId,
  settings,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "single" | "bulk";
    id?: string;
    count?: number;
  }>({ isOpen: false, type: "single" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("q", searchTerm); else params.delete("q");
    params.set("page", "1");
    router.push(`/muzakki?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/muzakki?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`/muzakki?${params.toString()}`);
  };

  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, type: "single", id });
  };

  const openBulkDeleteModal = () => {
    setDeleteModal({ isOpen: true, type: "bulk", count: selectedIds.length });
  };

  const executeDelete = async () => {
    setIsLoading(true, deleteModal.type === "single" ? "Menghapus data transaksi..." : `Menghapus ${deleteModal.count} transaksi...`);
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    try {
      if (deleteModal.type === "single" && deleteModal.id) {
        await deleteMuzakki(deleteModal.id);
        toast.success("Transaksi berhasil dihapus");
      } else if (deleteModal.type === "bulk") {
        await deleteMultipleMuzakki(selectedIds);
        setSelectedIds([]);
        toast.success(`${deleteModal.count} transaksi berhasil dihapus`);
      }
    } catch (error) {
      toast.error("Gagal menghapus data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-[1.5rem] border shadow-sm flex flex-wrap items-center gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
            <Heart className="h-24 w-24" />
          </div>

          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari transaksi..."
              className="pl-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border-none font-bold placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2 relative z-10">
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-10 w-10 rounded-xl shadow-lg bg-red-600 hover:bg-red-700 text-white border-none" onClick={openBulkDeleteModal}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-[10px] font-bold uppercase">Hapus Terpilih ({selectedIds.length})</p></TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 w-10 rounded-xl shadow-lg text-white" onClick={() => { setEditData(null); setIsOpen(true); }}>
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p className="text-[10px] font-bold uppercase">Tambah Transaksi</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="border rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden shadow-sm border-slate-200 dark:border-white/5">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
              <TableRow>
                <TableHead className="w-[50px] pl-6">
                  <Checkbox 
                    className="h-5 w-5 rounded-md border-indigo-400 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                    checked={selectedIds.length === initialData.length && initialData.length > 0} 
                    onCheckedChange={() => selectedIds.length === initialData.length ? setSelectedIds([]) : setSelectedIds(initialData.map((i: any) => i.id))} 
                  />
                </TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Muzakki / Lokasi</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Jiwa</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Zakat</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Infak</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5 text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-24 text-slate-400 text-xs font-bold uppercase tracking-widest">Tidak ada transaksi</TableCell></TableRow>
              ) : (
                initialData.map((item: any) => (
                  <TableRow key={item.id} className="group border-slate-50 dark:border-white/5 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-colors">
                    <TableCell className="pl-6">
                      <Checkbox 
                        className="h-5 w-5 rounded-md border-indigo-400 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                        checked={selectedIds.includes(item.id)} 
                        onCheckedChange={() => selectedIds.includes(item.id) ? setSelectedIds(selectedIds.filter(i => i !== item.id)) : setSelectedIds([...selectedIds, item.id])} 
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase tracking-tight">{item.nama}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-0.5">
                        <Home className="h-3 w-3 text-emerald-500/50" /> {item.blokRumah}
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-600">{item.jumlahJiwa}</TableCell>
                    <TableCell>
                      <Badge className={item.jenisZakat === 'BERAS' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
                        {item.jenisZakat === 'BERAS' ? `${item.jumlahBeras} KG` : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-[10px] font-bold text-slate-500">D: Rp {item.infakDesa.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] font-bold text-emerald-600">M: Rp {item.infakMasjid.toLocaleString('id-ID')}</div>
                    </TableCell>
                    <TableCell className="text-right space-x-1 pr-6">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all hover:scale-110" onClick={() => { setViewData(item); setDetailOpen(true); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-110" onClick={() => { setEditData(item); setIsOpen(true); }}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50 transition-all hover:scale-110" onClick={() => openDeleteModal(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-[1.5rem] border shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-400">Total Transaksi</span>
              <p className="font-black text-indigo-950 dark:text-white text-lg leading-tight">{total}</p>
            </div>
            <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
            <div className="flex items-center gap-2">
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-9 w-28 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-black text-[10px] text-indigo-600 shadow-inner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl bg-white dark:bg-slate-900 min-w-[8rem] p-1 z-[100] opacity-100">
                  {[10, 25, 50, 100].map(v => (
                    <SelectItem key={v} value={v.toString()} className="text-xs font-bold rounded-xl py-2 focus:bg-indigo-600 focus:text-white transition-colors cursor-pointer">
                      {v} Per Page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl font-bold text-xs" disabled={currentPage <= 1} onClick={() => handlePage(currentPage - 1)}>Prev</Button>
            <div className="h-10 px-4 flex items-center bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-xs font-black text-indigo-600">{currentPage} / {pages}</div>
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl font-bold text-xs" disabled={currentPage >= pages} onClick={() => handlePage(currentPage + 1)}>Next</Button>
          </div>
        </div>

        {/* --- VIEW DETAIL MODAL --- */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Eye className="h-24 w-24" /></div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Detail Transaksi</DialogTitle>
              <p className="text-indigo-100/70 text-[10px] font-bold uppercase tracking-widest mt-1">Bukti Penerimaan Zakat Fitrah</p>
            </div>
            
            <div className="p-8 bg-white dark:bg-gray-900 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600"><UserIcon className="h-6 w-6" /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Nama Muzakki</p>
                    <p className="font-black text-indigo-950 dark:text-white uppercase leading-tight">{viewData?.nama}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-2xl space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><Home className="h-3 w-3" /> Lokasi</p>
                    <p className="font-bold text-xs text-slate-700 dark:text-slate-200">{viewData?.blokRumah}</p>
                    <p className="text-[10px] font-medium text-indigo-500">{viewData?.wilayah?.nama}</p>
                  </div>
                  <div className="p-4 border rounded-2xl space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Tanggal</p>
                    <p className="font-bold text-xs text-slate-700 dark:text-slate-200">{viewData && new Date(viewData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[10px] font-medium text-slate-400">{viewData && new Date(viewData.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-emerald-600/60">Kewajiban Zakat ({viewData?.jumlahJiwa} Jiwa)</p>
                      <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                        {viewData?.jenisZakat === 'BERAS' ? `${viewData?.jumlahBeras} KG BERAS` : `Rp ${viewData?.jumlahUang.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20"><Scale className="h-5 w-5" /></div>
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-200/50 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Infak Wajib (Desa)</span>
                      <span>Rp {viewData?.infakDesa.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-emerald-600">
                      <span>Infak Masjid</span>
                      <span>Rp {viewData?.infakMasjid.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-black text-emerald-700 dark:text-emerald-400">
                      <span className="uppercase tracking-widest text-[10px]">Total Dibayar</span>
                      <span>Rp {( (viewData?.jenisZakat === 'UANG' ? viewData?.jumlahUang : 0) + viewData?.infakDesa + viewData?.infakMasjid ).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-dashed rounded-2xl opacity-60">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  <p className="text-[10px] font-bold uppercase text-slate-500">Diterima oleh: <span className="text-indigo-600 font-black">{viewData?.petugas?.name}</span></p>
                </div>
              </div>

              <Button onClick={() => setDetailOpen(false)} className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20">Tutup Detail</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- FORM MODAL --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-lg rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Heart className="h-24 w-24" /></div>
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase mb-1">{editData ? "Update Transaksi" : "Bayar Zakat"}</DialogTitle>
              <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest">Penerimaan Zakat Fitrah</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900">
              <MuzakkiForm editData={editData} onClose={() => setIsOpen(false)} settings={settings} />
            </div>
          </DialogContent>
        </Dialog>

        {/* --- DELETE CONFIRMATION --- */}
        <Dialog open={deleteModal.isOpen} onOpenChange={(v) => setDeleteModal(prev => ({ ...prev, isOpen: v }))}>
          <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/30 p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-red-700 dark:text-red-400 mb-2">Hapus Transaksi?</DialogTitle>
              <DialogDescription className="text-red-800/60 dark:text-red-300/60 font-medium text-sm leading-relaxed">
                {deleteModal.type === "single" ? "Data pembayaran zakat ini akan dihapus permanen dari sistem." : `Apakah Anda yakin ingin menghapus ${deleteModal.count} data transaksi zakat sekaligus?`}
              </DialogDescription>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]" onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}>Batal</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 shadow-lg shadow-red-500/30 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95" onClick={executeDelete}>Ya, Hapus</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
