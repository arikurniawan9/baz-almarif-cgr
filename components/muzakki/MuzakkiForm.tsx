// components/muzakki/MuzakkiForm.tsx
"use client";

import { useEffect, useState } from "react";
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
import { createMuzakki, updateMuzakki } from "@/actions/muzakki";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";

export function MuzakkiForm({ editData, onClose, userId, hargaBeras }: any) {
  const [loading, setLoading] = useState(false);
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [formData, setFormData] = useState({
    nama: editData?.nama || "",
    alamat: editData?.alamat || "",
    jumlahJiwa: editData?.jumlahJiwa || 1,
    jenisZakat: editData?.jenisZakat || "BERAS",
    jumlahBeras: editData?.jumlahBeras || 2.5,
    jumlahUang: editData?.jumlahUang || 0,
    petugasId: userId,
  });

  useEffect(() => {
    // Auto calculate when jumlahJiwa or jenisZakat changes
    const jiwa = parseInt(formData.jumlahJiwa as any) || 0;
    if (formData.jenisZakat === "BERAS") {
      setFormData((prev) => ({
        ...prev,
        jumlahBeras: jiwa * 2.5,
        jumlahUang: 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        jumlahBeras: 0,
        jumlahUang: jiwa * hargaBeras,
      }));
    }
  }, [formData.jumlahJiwa, formData.jenisZakat, hargaBeras]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);

    try {
      if (editData) {
        await updateMuzakki(editData.id, formData);
        toast.success("Data muzakki berhasil diperbarui");
      } else {
        await createMuzakki(formData);
        toast.success("Data muzakki berhasil ditambahkan");
      }
      onClose();
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="nama">Nama Kepala Keluarga / Muzakki</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Input
          id="alamat"
          value={formData.alamat}
          onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="jumlahJiwa">Jumlah Jiwa</Label>
          <Input
            id="jumlahJiwa"
            type="number"
            min="1"
            value={formData.jumlahJiwa}
            onChange={(e) => setFormData({ ...formData, jumlahJiwa: parseInt(e.target.value) })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="jenisZakat">Jenis Zakat</Label>
          <Select
            value={formData.jenisZakat}
            onValueChange={(value) => setFormData({ ...formData, jenisZakat: value })}
          >
            <SelectTrigger id="jenisZakat">
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BERAS">Beras</SelectItem>
              <SelectItem value="UANG">Uang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900">
        <Label className="text-emerald-800 dark:text-emerald-400 font-bold">Total Kewajiban:</Label>
        <div className="text-2xl font-bold text-emerald-600 mt-1">
          {formData.jenisZakat === "BERAS" 
            ? `${formData.jumlahBeras} kg Beras` 
            : `Rp ${formData.jumlahUang.toLocaleString('id-ID')}`}
        </div>
        <p className="text-xs text-emerald-600/70 mt-1">
          * {formData.jenisZakat === "BERAS" ? "2.5kg per jiwa" : `Rp ${hargaBeras.toLocaleString('id-ID')} per jiwa`}
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Data"}
        </Button>
      </div>
    </form>
  );
}
