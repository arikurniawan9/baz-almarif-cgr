// components/report/ReportFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportFilters({ wilayahs, users, years }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/laporan?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/laporan');
  };

  const hasFilters = searchParams.get("wilayah") || searchParams.get("petugas") || searchParams.get("jenis") || searchParams.get("tahun");

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5">
      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="grid gap-2 flex-1 w-full">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tahun Zakat</Label>
          <Select
            value={searchParams.get("tahun") || "all"}
            onValueChange={(val) => handleFilterChange("tahun", val)}
          >
            <SelectTrigger className="h-12 rounded-2xl bg-indigo-50 dark:bg-white/5 border-none font-bold text-indigo-600 px-5 shadow-inner">
              <SelectValue placeholder="Tahun Aktif" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
              <SelectItem value="all" className="font-bold">Default (Tahun Aktif)</SelectItem>
              {years.map((y: string) => (
                <SelectItem key={y} value={y} className="font-bold">📅 {y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 flex-1 w-full">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Wilayah</Label>
          <Select
            value={searchParams.get("wilayah") || "all"}
            onValueChange={(val) => handleFilterChange("wilayah", val)}
          >
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-indigo-600 px-5 shadow-inner">
              <SelectValue placeholder="Semua Wilayah" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
              <SelectItem value="all" className="font-bold">Semua Wilayah</SelectItem>
              {wilayahs.map((w: any) => (
                <SelectItem key={w.id} value={w.id} className="font-bold">{w.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 flex-1 w-full">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amilin / Petugas</Label>
          <Select
            value={searchParams.get("petugas") || "all"}
            onValueChange={(val) => handleFilterChange("petugas", val)}
          >
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-indigo-600 px-5 shadow-inner">
              <SelectValue placeholder="Semua Amilin" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
              <SelectItem value="all" className="font-bold">Semua Amilin</SelectItem>
              {users.map((u: any) => (
                <SelectItem key={u.id} value={u.id} className="font-bold">{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 flex-1 w-full">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Jenis Zakat</Label>
          <Select
            value={searchParams.get("jenis") || "all"}
            onValueChange={(val) => handleFilterChange("jenis", val)}
          >
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold text-indigo-600 px-5 shadow-inner">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
              <SelectItem value="all" className="font-bold">Semua Jenis</SelectItem>
              <SelectItem value="BERAS" className="font-bold">🌾 Beras</SelectItem>
              <SelectItem value="UANG" className="font-bold">💰 Uang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <X className="h-4 w-4 mr-2" /> Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}
