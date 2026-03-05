// components/user/PetugasList.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Power, PowerOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PetugasForm } from "./PetugasForm";
import { deleteUser, toggleUserStatus } from "@/actions/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function PetugasList({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus petugas ini?")) {
      try {
        await deleteUser(id);
        toast.success("Petugas berhasil dihapus");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleToggle = async (id: string, status: boolean) => {
    await toggleUserStatus(id, status);
    toast.success(`Akun ${status ? "dinonaktifkan" : "diaktifkan"}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setEditData(null);
            setIsOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Petugas
        </Button>
      </div>

      <div className="border rounded-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>
                  <Badge variant={item.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.active ? 'outline' : 'destructive'} className={item.active ? 'text-emerald-600 border-emerald-600' : ''}>
                    {item.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={item.active ? "Nonaktifkan" : "Aktifkan"}
                    onClick={() => handleToggle(item.id, item.active)}
                  >
                    {item.active ? (
                      <PowerOff className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Power className="h-4 w-4 text-emerald-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditData(item);
                      setIsOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Petugas" : "Tambah Petugas"}</DialogTitle>
          </DialogHeader>
          <PetugasForm editData={editData} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
