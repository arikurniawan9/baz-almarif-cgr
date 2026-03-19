// components/warga/WargaForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrUpdateWarga, updateWarga, checkWargaExist } from "@/actions/warga";
import { getWilayahs } from "@/actions/wilayah";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/ui";

export function WargaForm({ editData, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [wilayahs, setWilayahs] = useState<any[]>([]);
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);
  const [existingWarga, setExistingWarga] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nama: editData?.nama === "namawarga" ? "" : (editData?.nama || ""),
    blokRumah: editData?.blokRumah || "",
    wilayahId: editData?.wilayahId || "none",
  });

  useEffect(() => {
    async function fetchWilayah() {
      const data = await getWilayahs();
      setWilayahs(data);
    }
    fetchWilayah();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.wilayahId === "none") {
      toast.error("Wilayah wajib dipilih");
      return;
    }

    setLoading(true);

    try {
      // Jika ini adalah penambahan data baru (bukan edit)
      if (!editData) {
        // Cek apakah blok sudah ada
        const exist = await checkWargaExist(formData.blokRumah);
        if (exist) {
          setExistingWarga(exist);
          setShowConfirmOverwrite(true);
          setLoading(false);
          return;
        }
      }

      await executeSave();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data.");
      setLoading(false);
    }
  };

  const executeSave = async () => {
    setLoading(true);
    setIsLoading(true, editData ? "Mengupdate data warga..." : "Menyimpan data warga baru...");
    try {
      if (editData) {
        await updateWarga(editData.id, formData);
        toast.success("Data warga berhasil diperbarui");
      } else {
        await createOrUpdateWarga(formData);
        toast.success("Data warga berhasil disimpan");
      }
      onClose();
    } catch (error) {
      toast.error("Gagal menyimpan data.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  if (showConfirmOverwrite) {
    return (
      <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-900">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="font-black text-lg uppercase tracking-tight">Blok Sudah Terdaftar!</h3>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            Data warga dengan nomor blok <span className="font-black">"{formData.blokRumah}"</span> sudah ada di sistem:
          </p>
          <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl space-y-1">
            <p className="text-xs font-bold uppercase text-slate-400">Nama Saat Ini:</p>
            <p className="font-black text-indigo-950 dark:text-white uppercase">{existingWarga?.nama}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase mt-2">{existingWarga?.wilayah?.nama}</p>
          </div>
          <p className="mt-6 text-xs font-bold text-amber-700 dark:text-amber-400">
            Apakah Anda yakin ingin <span className="underline underline-offset-4">MENIMPA (Overwrite)</span> data lama dengan data baru ini?
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]"
            onClick={() => setShowConfirmOverwrite(false)}
          >
            Batal & Ubah Blok
          </Button>
          <Button 
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-12 shadow-lg shadow-amber-500/20 font-black uppercase tracking-widest text-[10px]"
            onClick={executeSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "YA, TIMPA DATA"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="blokRumah" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Blok / No Rumah <span className="text-red-500">*</span></Label>
        <Input
          id="blokRumah"
          placeholder="Contoh: A2 No.6"
          className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-black text-indigo-600 focus-visible:ring-indigo-500"
          value={formData.blokRumah}
          onChange={(e) => setFormData({ ...formData, blokRumah: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nama" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Nama Kepala Keluarga (Opsional)</Label>
        <Input
          id="nama"
          placeholder="Boleh kosong, default: namawarga"
          className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-indigo-500"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="wilayahId" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Wilayah <span className="text-red-500">*</span></Label>
        <Select
          value={formData.wilayahId}
          onValueChange={(value) => setFormData({ ...formData, wilayahId: value })}
        >
          <SelectTrigger id="wilayahId" className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold">
            <SelectValue placeholder="Pilih wilayah" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-2xl">
            <SelectItem value="none">-- Pilih Wilayah --</SelectItem>
            {wilayahs.map((w) => (
              <SelectItem key={w.id} value={w.id}>{w.nama}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="ghost" type="button" onClick={onClose} disabled={loading} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
          Batal
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 shadow-lg shadow-indigo-500/30 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95" type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Data"}
        </Button>
      </div>
    </form>
  );
}
