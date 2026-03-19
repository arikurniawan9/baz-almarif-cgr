// components/muzakki/MuzakkiForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMuzakki, updateMuzakki } from "@/actions/muzakki";
import { getAllWargas, updateWarga } from "@/actions/warga";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, User as UserIcon, Home, Banknote, Scale, Lock, RefreshCcw, CheckCircle2, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MuzakkiForm({ editData, onClose, settings }: any) {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [wargas, setWargas] = useState<any[]>([]);
  const [filteredWargas, setFilteredWargas] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  
  const defaultBesaranBeras = settings?.besaranBeras || 2.5;
  const besaranUang1 = settings?.besaranUang || 37500;
  const besaranUang2 = settings?.besaranUang2 || 50000;
  const defaultInfakDesa = settings?.infakDesaDefault || 2000;

  const [formData, setFormData] = useState({
    nama: editData?.nama || "",
    blokRumah: editData?.blokRumah || "",
    wargaId: editData?.wargaId || "",
    jumlahJiwa: editData?.jumlahJiwa || 1,
    jenisZakat: editData?.jenisZakat || "BERAS",
    selectedUangNominal: editData?.jumlahUang > 0 ? (editData.jumlahUang / editData.jumlahJiwa) : besaranUang1,
    jumlahBeras: editData?.jumlahBeras || 0,
    jumlahUang: editData?.jumlahUang || 0,
    infakDesa: editData?.infakDesa ?? defaultInfakDesa,
    infakMasjid: editData?.infakMasjid || 0,
  });

  const [originalWargaNama, setOriginalWargaNama] = useState("");

  useEffect(() => {
    async function fetchWarga() {
      const data = await getAllWargas();
      setWargas(data);
    }
    fetchWarga();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0 && !formData.wargaId) {
      const filtered = wargas.filter(w => 
        w.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
        w.blokRumah.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setFilteredWargas(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, wargas, formData.wargaId]);

  useEffect(() => {
    const jiwa = parseInt(formData.jumlahJiwa as any) || 0;
    if (formData.jenisZakat === "BERAS") {
      setFormData((prev) => ({
        ...prev,
        jumlahBeras: jiwa * defaultBesaranBeras,
        jumlahUang: 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        jumlahBeras: 0,
        jumlahUang: jiwa * formData.selectedUangNominal,
      }));
    }
  }, [formData.jumlahJiwa, formData.jenisZakat, formData.selectedUangNominal, defaultBesaranBeras]);

  const selectWarga = (warga: any) => {
    setFormData({ 
      ...formData, 
      wargaId: warga.id, 
      nama: warga.nama === "namawarga" ? "" : warga.nama, 
      blokRumah: warga.blokRumah 
    });
    setOriginalWargaNama(warga.nama);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const clearWarga = () => {
    setFormData({ ...formData, wargaId: "", nama: "", blokRumah: "" });
    setOriginalWargaNama("");
    setSearchQuery("");
  };

  const handleSyncToMaster = async () => {
    if (!formData.wargaId || !formData.nama) return;
    setSyncing(true);
    try {
      const selectedWarga = wargas.find(w => w.id === formData.wargaId);
      await updateWarga(formData.wargaId, {
        nama: formData.nama,
        blokRumah: formData.blokRumah,
        wilayahId: selectedWarga?.wilayahId
      });
      setOriginalWargaNama(formData.nama);
      toast.success("Nama diperbarui di master");
    } catch (error) {
      toast.error("Gagal update master");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.blokRumah) {
      toast.error("Lengkapi data warga");
      return;
    }
    setLoading(true);
    setIsLoading(true, editData ? "Mengupdate data..." : "Menyimpan transaksi zakat...");
    try {
      if (editData) {
        await updateMuzakki(editData.id, formData);
        toast.success("Berhasil diperbarui");
      } else {
        await createMuzakki(formData);
        toast.success("Zakat berhasil dibayarkan");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const totalBayar = formData.jenisZakat === "UANG" 
    ? formData.jumlahUang + Number(formData.infakDesa) + Number(formData.infakMasjid)
    : Number(formData.infakDesa) + Number(formData.infakMasjid);

  const isNameChanged = formData.wargaId && formData.nama !== originalWargaNama && formData.nama.trim() !== "";

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        {!editData && (
          <div className="grid gap-2 relative">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cari Data Warga</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
              <Input
                placeholder={formData.wargaId ? "Warga sudah terpilih" : "Ketik Nomor Blok atau Nama..."}
                className="pl-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!!formData.wargaId}
              />
              {formData.wargaId && (
                <button type="button" onClick={clearWarga} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black uppercase hover:bg-red-100">Ganti</button>
              )}
            </div>
            {showSuggestions && filteredWargas.length > 0 && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white dark:bg-slate-900 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                {filteredWargas.map((w) => (
                  <div key={w.id} className="p-4 hover:bg-emerald-50 cursor-pointer border-b last:border-0" onClick={() => selectWarga(w)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Home className="h-4 w-4" /></div>
                      <div><p className="font-black text-sm uppercase">{w.blokRumah}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{w.nama}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">Blok / No Rumah</Label>
            <div className="relative">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-12 h-12 rounded-2xl bg-slate-100/50 dark:bg-black/20 border-none font-black text-indigo-600" value={formData.blokRumah} readOnly placeholder="Blok..." />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">Nama Muzakki</Label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-12 h-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-indigo-500" 
                value={formData.nama} 
                onChange={(e) => setFormData({...formData, nama: e.target.value})} 
                placeholder="Nama..." 
                disabled={!formData.wargaId && !editData} 
              />
              {isNameChanged && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" onClick={handleSyncToMaster} disabled={syncing} className="absolute -top-2 -right-2 h-7 w-7 p-0 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg border-2 border-white">
                      {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p className="text-[10px] font-bold">Sync Master</p></TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Jenis Zakat</Label>
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setFormData({...formData, jenisZakat: "BERAS"})} className={cn("relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2", formData.jenisZakat === "BERAS" ? "border-amber-500 bg-amber-50 shadow-lg scale-105" : "border-slate-100 hover:border-amber-200")}>
              <div className={cn("p-2 rounded-xl", formData.jenisZakat === "BERAS" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400")}>🌾</div>
              <span className="font-black text-[10px] uppercase">Beras</span>
              {formData.jenisZakat === "BERAS" && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-amber-500" />}
            </div>
            <div onClick={() => setFormData({...formData, jenisZakat: "UANG"})} className={cn("relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2", formData.jenisZakat === "UANG" ? "border-indigo-500 bg-indigo-50 shadow-lg scale-105" : "border-slate-100 hover:border-indigo-200")}>
              <div className={cn("p-2 rounded-xl", formData.jenisZakat === "UANG" ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400")}>💰</div>
              <span className="font-black text-[10px] uppercase">Uang</span>
              {formData.jenisZakat === "UANG" && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-indigo-500" />}
            </div>
          </div>
        </div>

        {formData.jenisZakat === "UANG" && (
          <div className="space-y-3 animate-in slide-in-from-top-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Pilih Nominal (per jiwa)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[besaranUang1, besaranUang2].map((nominal) => (
                <div key={nominal} onClick={() => setFormData({...formData, selectedUangNominal: nominal})} className={cn("p-3 rounded-xl border cursor-pointer transition-all text-center text-xs font-black uppercase", formData.selectedUangNominal === nominal ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white border-slate-100 text-slate-500 hover:bg-indigo-50")}>Rp {nominal.toLocaleString('id-ID')}</div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">Jiwa</Label>
            <Input type="number" min="1" className="h-12 rounded-2xl bg-slate-50 border-none font-black" value={formData.jumlahJiwa} onChange={(e) => setFormData({ ...formData, jumlahJiwa: parseInt(e.target.value) || 1 })} required />
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">Infak Desa</Label>
            <Input type="number" className="h-12 rounded-2xl bg-slate-50 border-none font-bold" value={formData.infakDesa} onChange={(e) => setFormData({ ...formData, infakDesa: parseFloat(e.target.value) || 0 })} required />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Infak Masjid</Label>
          <Input type="number" placeholder="0" className="h-12 rounded-2xl bg-slate-50 border-none font-bold" value={formData.infakMasjid || ""} onChange={(e) => setFormData({ ...formData, infakMasjid: parseFloat(e.target.value) || 0 })} />
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Scale className="h-20 w-24" /></div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div><p className="text-[10px] font-bold uppercase opacity-70">Zakat</p><h4 className="text-xl font-black">{formData.jenisZakat === "BERAS" ? `${formData.jumlahBeras} KG BERAS` : `Rp ${formData.jumlahUang.toLocaleString('id-ID')}`}</h4></div>
              <Badge className="bg-white/20 text-white border-none font-bold text-[8px]">{formData.jenisZakat === "BERAS" ? `${defaultBesaranBeras}kg/jiwa` : `Rp ${formData.selectedUangNominal.toLocaleString('id-ID')}/jiwa`}</Badge>
            </div>
            <div className="pt-4 border-t border-white/20 flex justify-between items-center">
              <div><p className="text-[10px] font-bold uppercase opacity-70">Total Bayar</p><h4 className="text-2xl font-black">Rp {totalBayar.toLocaleString('id-ID')}</h4></div>
              <Banknote className="h-6 w-6 opacity-50" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px]">Batal</Button>
          <Button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 shadow-lg font-black uppercase text-[10px] transition-all active:scale-95" type="submit" disabled={loading}>Simpan Transaksi</Button>
        </div>
      </form>
    </TooltipProvider>
  );
}
