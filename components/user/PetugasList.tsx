// components/user/PetugasList.tsx
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
  User as UserIcon, 
  Trash,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  MapPin
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
import { PetugasForm } from "./PetugasForm";
import { deleteUser, deleteMultipleUser, toggleUserStatus } from "@/actions/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PetugasList({ initialData, total, pages, currentPage, limit, search }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
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
    router.push(`/petugas?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/petugas?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`/petugas?${params.toString()}`);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true, "Mengubah status petugas...");
    try {
      await toggleUserStatus(id, currentStatus);
      toast.success("Status berhasil diubah");
    } catch (error) {
      toast.error("Gagal mengubah status");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, type: "single", id });
  };

  const openBulkDeleteModal = () => {
    setDeleteModal({ isOpen: true, type: "bulk", count: selectedIds.length });
  };

  const executeDelete = async () => {
    setIsLoading(true, deleteModal.type === "single" ? "Menghapus petugas..." : `Menghapus ${deleteModal.count} petugas...`);
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    try {
      if (deleteModal.type === "single" && deleteModal.id) {
        await deleteUser(deleteModal.id);
        toast.success("Petugas berhasil dihapus");
      } else if (deleteModal.type === "bulk") {
        await deleteMultipleUser(selectedIds);
        setSelectedIds([]);
        toast.success(`${deleteModal.count} petugas berhasil dihapus`);
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-[1.5rem] border shadow-sm flex flex-wrap items-center gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
            <UserCheck className="h-24 w-24" />
          </div>

          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari petugas..."
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
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 w-10 rounded-xl shadow-lg text-white" onClick={() => { setEditData(null); setIsOpen(true); }}>
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p className="text-[10px] font-bold uppercase">Tambah Petugas</p></TooltipContent>
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
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Nama Petugas</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Username</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Role / Wilayah</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5">Status</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400 py-5 text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-24 text-slate-400 text-xs font-bold uppercase tracking-widest">Tidak ada petugas</TableCell></TableRow>
              ) : (
                initialData.map((item: any) => (
                  <TableRow key={item.id} className="group border-slate-50 dark:border-white/5 hover:bg-indigo-50/20 transition-colors">
                    <TableCell className="pl-6">
                      <Checkbox 
                        className="h-5 w-5 rounded-md border-indigo-400 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                        checked={selectedIds.includes(item.id)} 
                        onCheckedChange={() => selectedIds.includes(item.id) ? setSelectedIds(selectedIds.filter(i => i !== item.id)) : setSelectedIds([...selectedIds, item.id])} 
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase tracking-tight">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 text-xs lowercase">@{item.username}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={item.role === 'ADMIN' ? "bg-purple-100 text-purple-700 border-purple-200 text-[8px] w-fit" : "bg-blue-100 text-blue-700 border-blue-200 text-[8px] w-fit"}>
                          {item.role}
                        </Badge>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                          <MapPin className="h-2.5 w-2.5" /> {item.wilayah?.nama || "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleStatus(item.id, item.active)}>
                        {item.active ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[8px] hover:bg-emerald-200">
                            <ShieldCheck className="h-2.5 w-2.5 mr-1" /> ACTIVE
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[8px] hover:bg-slate-200">
                            <ShieldAlert className="h-2.5 w-2.5 mr-1" /> INACTIVE
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right space-x-1 pr-6">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-indigo-600 hover:bg-indigo-50" onClick={() => { setEditData(item); setIsOpen(true); }}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(item.id)}><Trash2 className="h-4 w-4" /></Button>
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
              <span className="text-[9px] font-black uppercase text-slate-400">Total Petugas</span>
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
                      {v} Rows
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

        {/* --- FORM MODAL --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-10"><UserCheck className="h-24 w-24" /></div>
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase mb-1">{editData ? "Update Petugas" : "Tambah Petugas"}</DialogTitle>
              <p className="text-indigo-100/70 text-xs font-bold uppercase tracking-widest">Manajemen Akses Amilin</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900">
              <PetugasForm editData={editData} onClose={() => setIsOpen(false)} />
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
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-red-700 dark:text-red-400 mb-2">Hapus Akun?</DialogTitle>
              <DialogDescription className="text-red-800/60 dark:text-red-300/60 font-medium text-sm leading-relaxed">
                {deleteModal.type === "single" ? "Akun petugas akan dihapus permanen. Pastikan petugas tidak memiliki data transaksi." : `Apakah Anda yakin ingin menghapus ${deleteModal.count} akun petugas sekaligus?`}
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
