// components/muzakki/MuzakkiList.tsx
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
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MuzakkiForm } from "./MuzakkiForm";
import { deleteMuzakki } from "@/actions/muzakki";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function MuzakkiList({
  initialData,
  total,
  pages,
  currentPage,
  search,
  userId,
  hargaBeras,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/muzakki?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/muzakki?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteMuzakki(id);
      toast.success("Data muzakki berhasil dihapus");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau alamat..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setEditData(null);
            setIsOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Muzakki
        </Button>
      </div>

      <div className="border rounded-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jiwa</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Petugas</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{item.alamat}</div>
                  </TableCell>
                  <TableCell>{item.jumlahJiwa}</TableCell>
                  <TableCell>
                    <Badge variant={item.jenisZakat === 'BERAS' ? 'outline' : 'secondary'}>
                      {item.jenisZakat}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.jenisZakat === 'BERAS' 
                      ? `${item.jumlahBeras} kg` 
                      : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`}
                  </TableCell>
                  <TableCell className="text-sm">{item.petugas?.name}</TableCell>
                  <TableCell className="text-sm">{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditData(item);
                        setIsOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-emerald-600" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {initialData.length} dari {total} data
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            onClick={() => handlePage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= pages}
            onClick={() => handlePage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Muzakki" : "Tambah Muzakki Baru"}</DialogTitle>
          </DialogHeader>
          <MuzakkiForm
            editData={editData}
            onClose={() => setIsOpen(false)}
            userId={userId}
            hargaBeras={hargaBeras}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
