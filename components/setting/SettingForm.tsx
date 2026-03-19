// components/setting/SettingForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/actions/setting";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SettingForm({ initialData }: any) {
  const [loading, setLoading] = useState(false);
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [formData, setFormData] = useState({
    hargaBeras: initialData?.hargaBeras || 15000,
    besaranBeras: initialData?.besaranBeras || 2.5,
    besaranUang: initialData?.besaranUang || 37500,
    besaranUang2: initialData?.besaranUang2 || 50000,
    infakDesaDefault: initialData?.infakDesaDefault || 2000,
    tahunZakat: initialData?.tahunZakat || new Date().getFullYear().toString(),
    identitasPanitia: initialData?.identitasPanitia || "",
  });

  // Generate years list (e.g., 2024 to 2035)
  const years = Array.from({ length: 12 }, (_, i) => (2024 + i).toString());

  const handleHargaOrBesaranBerasChange = (field: 'hargaBeras' | 'besaranBeras', value: string) => {
    const val = parseFloat(value) || 0;
    setFormData(prev => {
      const newHarga = field === 'hargaBeras' ? val : prev.hargaBeras;
      const newBesaran = field === 'besaranBeras' ? val : prev.besaranBeras;
      return {
        ...prev,
        [field]: value,
        besaranUang: newHarga * newBesaran
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true, "Menyimpan pengaturan...");

    try {
      await updateSettings(formData);
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... previous grid ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
        <div className="grid gap-2">
          <Label htmlFor="hargaBeras" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Harga Beras per KG (Rp)</Label>
          <Input id="hargaBeras" type="number" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold" value={formData.hargaBeras} onChange={(e) => handleHargaOrBesaranBerasChange('hargaBeras', e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="besaranBeras" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Besaran Beras (KG per jiwa)</Label>
          <Input id="besaranBeras" type="number" step="0.1" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold" value={formData.besaranBeras} onChange={(e) => handleHargaOrBesaranBerasChange('besaranBeras', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 dark:bg-indigo-950/10 p-6 rounded-3xl border border-indigo-100 dark:border-white/5">
        <div className="grid gap-2">
          <Label htmlFor="besaranUang" className="font-bold text-[10px] uppercase tracking-widest text-indigo-400">Zakat Uang Opsi 1 (Rp/jiwa)</Label>
          <Input id="besaranUang" type="number" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold text-indigo-600" value={formData.besaranUang} onChange={(e) => setFormData({ ...formData, besaranUang: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="besaranUang2" className="font-bold text-[10px] uppercase tracking-widest text-indigo-400">Zakat Uang Opsi 2 (Rp/jiwa)</Label>
          <Input id="besaranUang2" type="number" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold text-indigo-600" value={formData.besaranUang2} onChange={(e) => setFormData({ ...formData, besaranUang2: e.target.value })} required />
        </div>
      </div>

      <div className="grid gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
        <div className="grid gap-2">
          <Label htmlFor="infakDesaDefault" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Infak Wajib Desa Default (Rp per KK)</Label>
          <Input id="infakDesaDefault" type="number" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold" value={formData.infakDesaDefault} onChange={(e) => setFormData({ ...formData, infakDesaDefault: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tahunZakat" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Tahun Zakat</Label>
          <Select
            value={formData.tahunZakat}
            onValueChange={(val) => setFormData({ ...formData, tahunZakat: val })}
          >
            <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold text-indigo-600 shadow-sm">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
              {years.map((year) => (
                <SelectItem key={year} value={year} className="font-bold">📅 {year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="identitasPanitia" className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Identitas Panitia (BAZ/Masjid)</Label>
          <Input id="identitasPanitia" className="h-12 rounded-xl bg-white dark:bg-black/20 border-none font-bold" value={formData.identitasPanitia} onChange={(e) => setFormData({ ...formData, identitasPanitia: e.target.value })} required />
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 h-14 rounded-2xl shadow-xl shadow-indigo-500/20 font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95" type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Semua Perubahan"}
      </Button>
    </form>
  );
}
