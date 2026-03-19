// components/warga/WargaImportExport.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import ExcelJS from "exceljs";
import { importWarga, getAllWargas } from "@/actions/warga";
import { getWilayahs } from "@/actions/wilayah";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function WargaImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = async () => {
    setLoading(true);
    try {
      const wargas = await getAllWargas();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data Warga");
      worksheet.columns = [
        { header: "No", key: "no", width: 5 },
        { header: "Blok / No Rumah", key: "blokRumah", width: 20 },
        { header: "Nama Kepala Keluarga", key: "nama", width: 30 },
        { header: "Wilayah", key: "wilayah", width: 20 },
      ];
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };

      wargas.forEach((w: any, index: number) => {
        worksheet.addRow({ no: index + 1, blokRumah: w.blokRumah, nama: w.nama, wilayah: w.wilayah?.nama || "-" });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `Data_Warga_BAZ.xlsx`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Data warga berhasil diekspor");
    } catch (error) {
      toast.error("Gagal mengekspor data");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template Warga");
    worksheet.columns = [
      { header: "Blok / No Rumah", key: "blokRumah", width: 20 },
      { header: "Nama Kepala Keluarga", key: "nama", width: 30 },
      { header: "Nama Wilayah (Sesuai Master)", key: "wilayah", width: 25 },
    ];
    worksheet.addRow({ blokRumah: "A2 No.6", nama: "Nama Contoh", wilayah: "Wilayah 1" });
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF10B981" } };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Template_Import_Warga.xlsx"; a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.worksheets[0];
      const wilayahs = await getWilayahs();
      const existingWargas = await getAllWargas();
      const importedData: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const blokRumah = row.getCell(1).text?.trim();
        let nama = row.getCell(2).text?.trim();
        const wilayahNama = row.getCell(3).text?.trim();
        if (!blokRumah || !wilayahNama) return;
        const matchedWilayah = wilayahs.find(w => w.nama.toLowerCase() === wilayahNama?.toLowerCase());
        if (!matchedWilayah) return;
        const isUpdate = existingWargas.some(ew => ew.blokRumah === blokRumah);
        importedData.push({ blokRumah, nama: nama || "", wilayahNama, wilayahId: matchedWilayah.id, isUpdate });
      });
      if (importedData.length === 0) toast.error("Format file tidak sesuai.");
      else { setPreviewData(importedData); setIsPreviewOpen(true); }
    } catch (error) { toast.error("Gagal membaca file."); } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmImport = async () => {
    const setIsLoading = useUIStore.getState().setIsLoading;
    setLoading(true);
    setIsLoading(true, `Mengimport ${previewData.length} data warga...`);
    try {
      await importWarga(previewData);
      toast.success(`${previewData.length} data berhasil diproses`);
      setIsPreviewOpen(false);
      setPreviewData([]);
    } catch (error) { toast.error("Gagal menyimpan data."); } finally { 
      setLoading(false); 
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={downloadTemplate} className="h-10 w-10 rounded-xl text-emerald-600 border-emerald-100 hover:bg-emerald-50 active:scale-90 transition-all">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Download Template</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="h-10 w-10 rounded-xl text-indigo-600 border-indigo-100 hover:bg-indigo-50 active:scale-90 transition-all">
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Import Excel</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={exportData} disabled={loading} className="h-10 w-10 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-90 transition-all">
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Export Excel</p></TooltipContent>
        </Tooltip>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-6 pb-4 bg-indigo-600 text-white">
              <DialogTitle className="text-xl font-black uppercase">Konfirmasi Import</DialogTitle>
              <DialogDescription className="text-indigo-100 text-xs">Blok yang sudah ada akan otomatis ditimpa.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow><TableHead className="font-black text-[10px] uppercase">Blok</TableHead><TableHead className="font-black text-[10px] uppercase">Nama</TableHead><TableHead className="font-black text-[10px] uppercase">Wilayah</TableHead><TableHead className="text-right font-black text-[10px] uppercase">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-black text-indigo-600 text-xs">{item.blokRumah}</TableCell>
                        <TableCell className="font-bold text-slate-700 text-xs">{item.nama || "namawarga"}</TableCell>
                        <TableCell className="text-[10px] font-medium text-slate-500">{item.wilayahNama}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={item.isUpdate ? "bg-amber-100 text-amber-700 text-[8px]" : "bg-emerald-100 text-emerald-700 text-[8px]"}>{item.isUpdate ? "Update" : "Baru"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter className="p-6 pt-2 bg-white border-t">
              <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="rounded-xl font-bold text-xs">Batal</Button>
              <Button onClick={confirmImport} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-black uppercase text-xs">Proses Data</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
