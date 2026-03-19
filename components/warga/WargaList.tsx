// components/warga/WargaList.tsx
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
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WargaForm } from "./WargaForm";
import { WargaImportExport } from "./WargaImportExport";
import { deleteWarga, deleteMultipleWarga } from "@/actions/warga";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useUIStore } from "@/store/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WargaList({ initialData, total, pages, currentPage, limit, search }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Confirmation State
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
    router.push(`/warga?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/warga?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`/warga?${params.toString()}`);
  };

  // Trigger modal for single delete
  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, type: "single", id });
  };

  // Trigger modal for bulk delete
  const openBulkDeleteModal = () => {
    setDeleteModal({ isOpen: true, type: "bulk", count: selectedIds.length });
  };

  const executeDelete = async () => {
    setIsLoading(true, deleteModal.type === "single" ? "Menghapus data warga..." : `Menghapus ${deleteModal.count} data warga...`);
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    try {
      if (deleteModal.type === "single" && deleteModal.id) {
        await deleteWarga(deleteModal.id);
        toast.success("Data warga berhasil dihapus");
      } else if (deleteModal.type === "bulk") {
        await deleteMultipleWarga(selectedIds);
        setSelectedIds([]);
        toast.success(`${deleteModal.count} data warga berhasil dihapus`);
      }
    } catch (error) {
      toast.error("Gagal menghapus data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-[1.5rem] border shadow-sm flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari..."
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <WargaImportExport />

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
              <TooltipContent><p className="text-[10px] font-bold uppercase">Tambah Warga</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="border rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow>
                <TableHead className="w-[50px] pl-6">
                  <Checkbox 
                    className="h-5 w-5 rounded-md border-indigo-400 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                    checked={selectedIds.length === initialData.length && initialData.length > 0} 
                    onCheckedChange={() => selectedIds.length === initialData.length ? setSelectedIds([]) : setSelectedIds(initialData.map((i: any) => i.id))} 
                  />
                </TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Blok</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Nama</TableHead>
                <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Wilayah</TableHead>
                <TableHead className="text-right font-black uppercase text-[9px] tracking-widest text-slate-400 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">Kosong</TableCell></TableRow>
              ) : (
                initialData.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-indigo-50/20">
                    <TableCell className="pl-6">
                      <Checkbox 
                        className="h-5 w-5 rounded-md border-indigo-400 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                        checked={selectedIds.includes(item.id)} 
                        onCheckedChange={() => selectedIds.includes(item.id) ? setSelectedIds(selectedIds.filter(i => i !== item.id)) : setSelectedIds([...selectedIds, item.id])} 
                      />
                    </TableCell>
                    <TableCell className="font-black text-indigo-600 text-xs">{item.blokRumah}</TableCell>
                    <TableCell className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase">{item.nama}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[8px] font-bold uppercase tracking-tighter rounded-full">{item.wilayah?.nama}</Badge></TableCell>
                    <TableCell className="text-right space-x-1 pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-indigo-600" onClick={() => { setEditData(item); setIsOpen(true); }}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-600" onClick={() => openDeleteModal(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-2xl border shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-slate-400">Rows:</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-10 w-32 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-black text-xs text-indigo-600 px-4 shadow-inner">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl bg-white dark:bg-slate-900 min-w-[8rem] p-1 z-[100] opacity-100 fill-mode-forwards">
                {[10, 25, 50, 100].map(v => (
                  <SelectItem key={v} value={v.toString()} className="text-xs font-bold rounded-xl py-2 focus:bg-indigo-600 focus:text-white transition-colors cursor-pointer">
                    {v} Per Page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl font-bold text-xs" disabled={currentPage <= 1} onClick={() => handlePage(currentPage - 1)}>Prev</Button>
            <div className="h-10 px-4 flex items-center bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-xs font-black text-indigo-600">{currentPage} / {pages}</div>
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl font-bold text-xs" disabled={currentPage >= pages} onClick={() => handlePage(currentPage + 1)}>Next</Button>
          </div>
        </div>

        {/* --- FORM MODAL --- */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white"><DialogTitle className="text-xl font-black uppercase">Data Warga</DialogTitle></div>
            <div className="p-6 bg-white dark:bg-gray-900"><WargaForm editData={editData} onClose={() => setIsOpen(false)} /></div>
          </DialogContent>
        </Dialog>

        {/* --- DELETE CONFIRMATION MODAL --- */}
        <Dialog open={deleteModal.isOpen} onOpenChange={(v) => setDeleteModal(prev => ({ ...prev, isOpen: v }))}>
          <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/30 p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-red-700 dark:text-red-400 mb-2">
                Hapus Data?
              </DialogTitle>
              <DialogDescription className="text-red-800/60 dark:text-red-300/60 font-medium text-sm leading-relaxed">
                {deleteModal.type === "single" 
                  ? "Apakah Anda yakin ingin menghapus warga ini? Tindakan ini tidak dapat dibatalkan."
                  : `Apakah Anda yakin ingin menghapus ${deleteModal.count} data warga terpilih sekaligus?`}
              </DialogDescription>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-900 flex gap-3">
              <Button 
                variant="ghost" 
                className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]" 
                onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 shadow-lg shadow-red-500/30 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                onClick={executeDelete}
              >
                Ya, Hapus
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
