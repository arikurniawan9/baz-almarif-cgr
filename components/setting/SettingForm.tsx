// components/setting/SettingForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettings } from "@/actions/setting";
import { toast } from "sonner";

export function SettingForm({ initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hargaBeras: initialData?.hargaBeras || 15000,
    tahunZakat: initialData?.tahunZakat || new Date().getFullYear().toString(),
    identitasPanitia: initialData?.identitasPanitia || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSettings(formData);
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="hargaBeras">Harga Beras per KG (Rp)</Label>
        <Input
          id="hargaBeras"
          type="number"
          value={formData.hargaBeras}
          onChange={(e) => setFormData({ ...formData, hargaBeras: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">Digunakan untuk menghitung konversi zakat uang (jiwa * harga)</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="tahunZakat">Tahun Zakat</Label>
        <Input
          id="tahunZakat"
          value={formData.tahunZakat}
          onChange={(e) => setFormData({ ...formData, tahunZakat: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="identitasPanitia">Identitas Panitia (Nama Masjid/Lembaga)</Label>
        <Input
          id="identitasPanitia"
          value={formData.identitasPanitia}
          onChange={(e) => setFormData({ ...formData, identitasPanitia: e.target.value })}
          required
        />
      </div>

      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </form>
  );
}
