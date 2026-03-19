// components/user/PetugasForm.tsx
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
import { createUser, updateUser } from "@/actions/user";
import { getWilayahs } from "@/actions/wilayah";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";

export function PetugasForm({ editData, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [wilayahs, setWilayahs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    username: editData?.username || "",
    password: "",
    role: editData?.role || "PETUGAS",
    wilayahId: editData?.wilayahId || "none",
    active: editData?.active ?? true,
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
    setLoading(true);
    setIsLoading(true, editData ? "Memperbarui data petugas..." : "Mendaftarkan petugas baru...");

    const submitData = {
      ...formData,
      wilayahId: formData.wilayahId === "none" ? null : formData.wilayahId
    };

    try {
      if (editData) {
        await updateUser(editData.id, submitData);
        toast.success("Petugas berhasil diperbarui");
      } else {
        if (!formData.password) {
          toast.error("Password wajib diisi");
          setIsLoading(false);
          setLoading(false);
          return;
        }
        await createUser(submitData);
        toast.success("Petugas berhasil ditambahkan");
      }
      onClose();
    } catch (error) {
      toast.error("Username sudah digunakan atau terjadi kesalahan");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Lengkap</Label>
        <Input
          id="name"
          className="h-12 rounded-xl bg-slate-50 border-none font-bold"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Username</Label>
        <Input
          id="username"
          className="h-12 rounded-xl bg-slate-50 border-none font-bold"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
          Password {editData && "(Kosongkan jika tetap)"}
        </Label>
        <Input
          id="password"
          type="password"
          className="h-12 rounded-xl bg-slate-50 border-none font-bold"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editData}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="role" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger id="role" className="h-12 rounded-xl bg-slate-50 border-none font-black text-indigo-600">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl bg-white dark:bg-slate-900">
              <SelectItem value="ADMIN" className="font-bold py-2">ADMIN</SelectItem>
              <SelectItem value="PETUGAS" className="font-bold py-2">PETUGAS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="wilayahId" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wilayah Tugas</Label>
          <Select
            value={formData.wilayahId}
            onValueChange={(value) => setFormData({ ...formData, wilayahId: value })}
          >
            <SelectTrigger id="wilayahId" className="h-12 rounded-xl bg-slate-50 border-none font-black text-indigo-600">
              <SelectValue placeholder="Pilih wilayah" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl bg-white dark:bg-slate-900">
              <SelectItem value="none" className="font-bold py-2 italic text-slate-400">Tanpa Wilayah</SelectItem>
              {wilayahs.map((w) => (
                <SelectItem key={w.id} value={w.id} className="font-bold py-2">{w.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" type="button" onClick={onClose} disabled={loading} className="rounded-xl h-12 px-8 font-black uppercase text-[10px]">
          Batal
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-10 font-black uppercase text-[10px] shadow-lg shadow-indigo-500/20 transition-all active:scale-95" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Petugas"}
        </Button>
      </div>
    </form>
  );
}
