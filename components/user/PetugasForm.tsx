// components/user/PetugasForm.tsx
"use client";

import { useState } from "react";
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
import { toast } from "sonner";

export function PetugasForm({ editData, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    username: editData?.username || "",
    password: "",
    role: editData?.role || "PETUGAS",
    active: editData?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await updateUser(editData.id, formData);
        toast.success("Petugas berhasil diperbarui");
      } else {
        if (!formData.password) {
          toast.error("Password wajib diisi");
          return;
        }
        await createUser(formData);
        toast.success("Petugas berhasil ditambahkan");
      }
      onClose();
    } catch (error) {
      toast.error("Username sudah digunakan atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">
          Password {editData && "(Kosongkan jika tidak ingin mengubah)"}
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editData}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="PETUGAS">PETUGAS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Petugas"}
        </Button>
      </div>
    </form>
  );
}
