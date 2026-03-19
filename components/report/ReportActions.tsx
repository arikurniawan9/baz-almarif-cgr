// components/report/ReportActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Printer, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function ReportActions({ data, settings }: any) {
  const exportPDF = () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

        // Pre-calculate table data to avoid issues inside image load
        const tableData = data.map((item: any, index: number) => {
          const infakDesa = Number(item.infakDesa || 0);
          const infakMasjid = Number(item.infakMasjid || 0);
          const zakatUang = item.jenisZakat === "UANG" ? Number(item.jumlahUang || 0) : 0;
          const totalBayar = zakatUang + infakDesa + infakMasjid;

          return [
            index + 1,
            item.nama,
            item.blokRumah,
            item.wilayah?.nama || "-",
            item.jumlahJiwa,
            item.jenisZakat === "BERAS" ? `${item.jumlahBeras} kg` : `Rp ${Number(item.jumlahUang || 0).toLocaleString('id-ID')}`,
            `Rp ${infakDesa.toLocaleString('id-ID')}`,
            `Rp ${infakMasjid.toLocaleString('id-ID')}`,
            `Rp ${totalBayar.toLocaleString('id-ID')}`,
            item.petugas?.name || "-",
          ];
        });

        const img = new Image();
        img.src = "/kopDKM.png";

        const generateTable = (startY: number) => {
          autoTable(doc, {
            head: [["No", "Muzakki", "Blok", "Wilayah", "Jiwa", "Zakat", "Infak Desa", "Infak Masjid", "Total Bayar", "Petugas"]],
            body: tableData,
            startY: startY,
            styles: { fontSize: 8, cellPadding: 2, font: "helvetica" },
            headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 255] },
            margin: { left: 10, right: 10 },
          });
          doc.save(`Laporan_Zakat_Fitrah_${settings?.tahunZakat || "2026"}.pdf`);
          resolve(true);
        };

        img.onload = () => {
          const imgWidth = 260;
          const imgHeight = (img.height * imgWidth) / img.width;
          const xPos = (297 - imgWidth) / 2;
          
          doc.addImage(img, 'PNG', xPos, 10, imgWidth, imgHeight);

          const titleY = 15 + imgHeight;
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(`LAPORAN PENERIMAAN ZAKAT & INFAK TAHUN ${settings?.tahunZakat || ""}`, 148.5, titleY, { align: "center" });
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 148.5, titleY + 7, { align: "center" });

          generateTable(titleY + 15);
        };

        img.onerror = () => {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text(`LAPORAN PENERIMAAN ZAKAT & INFAK TAHUN ${settings?.tahunZakat || ""}`, 148.5, 20, { align: "center" });
          generateTable(30);
        };
      } catch (error) {
        console.error("PDF Export Error:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Sedang menyiapkan PDF...',
      success: 'Laporan PDF berhasil diunduh',
      error: 'Gagal mengunduh laporan PDF',
    });
  };

  const exportExcel = async () => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Zakat Fitrah");

        worksheet.columns = [
          { header: "No", key: "no", width: 5 },
          { header: "Nama Muzakki", key: "nama", width: 25 },
          { header: "Blok Rumah", key: "blok", width: 15 },
          { header: "Wilayah", key: "wilayah", width: 20 },
          { header: "Jiwa", key: "jiwa", width: 8 },
          { header: "Jenis", key: "jenis", width: 10 },
          { header: "Beras (kg)", key: "beras", width: 12 },
          { header: "Uang (Rp)", key: "uang", width: 15 },
          { header: "Infak Desa", key: "infakDesa", width: 15 },
          { header: "Infak Masjid", key: "infakMasjid", width: 15 },
          { header: "Total Uang", key: "total", width: 18 },
          { header: "Petugas", key: "petugas", width: 20 },
          { header: "Tanggal", key: "tanggal", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
        worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };

        data.forEach((item: any, index: number) => {
          const infakDesa = Number(item.infakDesa || 0);
          const infakMasjid = Number(item.infakMasjid || 0);
          const zakatUang = item.jenisZakat === 'UANG' ? Number(item.jumlahUang || 0) : 0;
          
          worksheet.addRow({
            no: index + 1,
            nama: item.nama,
            blok: item.blokRumah,
            wilayah: item.wilayah?.nama || "-",
            jiwa: item.jumlahJiwa,
            jenis: item.jenisZakat,
            beras: item.jumlahBeras,
            uang: item.jumlahUang,
            infakDesa: infakDesa,
            infakMasjid: infakMasjid,
            total: zakatUang + infakDesa + infakMasjid,
            petugas: item.petugas?.name,
            tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `Laporan_Zakat_${settings?.tahunZakat || "2026"}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        resolve(true);
      } catch (error) {
        console.error("Excel Export Error:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Sedang menyiapkan Excel...',
      success: 'Laporan Excel berhasil diunduh',
      error: 'Gagal mengunduh laporan Excel',
    });
  };

  const printReport = () => window.print();

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={printReport} className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Printer className="h-5 w-5 text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Cetak Laporan (Print)</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={exportExcel} className="h-12 w-12 rounded-2xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Download Excel</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={exportPDF} className="h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
              <FileText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-[10px] font-bold uppercase">Download PDF (Landscape)</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
