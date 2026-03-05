// components/report/ReportActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

export function ReportActions({ data, settings }: any) {
  const exportPDF = () => {
    const doc = new jsPDF() as any;
    const title = `LAPORAN PENERIMAAN ZAKAT FITRAH ${settings?.tahunZakat || ""}`;
    const subtitle = settings?.identitasPanitia || "Panitia Zakat Fitrah";

    doc.setFontSize(14);
    doc.text(title, 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(subtitle, 105, 22, { align: "center" });
    doc.line(20, 25, 190, 25);

    const tableData = data.map((item: any, index: number) => [
      index + 1,
      item.nama,
      item.jumlahJiwa,
      item.jenisZakat === "BERAS" ? `${item.jumlahBeras} kg` : `Rp ${item.jumlahUang.toLocaleString('id-ID')}`,
      item.petugas?.name,
      new Date(item.tanggal).toLocaleDateString("id-ID"),
    ]);

    doc.autoTable({
      head: [["No", "Nama Muzakki", "Jiwa", "Zakat", "Petugas", "Tanggal"]],
      body: tableData,
      startY: 30,
    });

    doc.save(`Laporan_Zakat_${settings?.tahunZakat || "2025"}.pdf`);
  };

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Zakat Fitrah");

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Muzakki", key: "nama", width: 30 },
      { header: "Alamat", key: "alamat", width: 40 },
      { header: "Jiwa", key: "jiwa", width: 10 },
      { header: "Jenis", key: "jenis", width: 10 },
      { header: "Beras (kg)", key: "beras", width: 15 },
      { header: "Uang (Rp)", key: "uang", width: 20 },
      { header: "Petugas", key: "petugas", width: 20 },
      { header: "Tanggal", key: "tanggal", width: 20 },
    ];

    data.forEach((item: any, index: number) => {
      worksheet.addRow({
        no: index + 1,
        nama: item.nama,
        alamat: item.alamat,
        jiwa: item.jumlahJiwa,
        jenis: item.jenisZakat,
        beras: item.jumlahBeras,
        uang: item.jumlahUang,
        petugas: item.petugas?.name,
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Laporan_Zakat_${settings?.tahunZakat || "2025"}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={printReport} className="hidden sm:flex">
        <Printer className="h-4 w-4 mr-2" /> Print
      </Button>
      <Button variant="outline" size="sm" onClick={exportExcel} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
      </Button>
      <Button size="sm" onClick={exportPDF} className="bg-red-600 hover:bg-red-700">
        <Download className="h-4 w-4 mr-2" /> PDF
      </Button>
    </div>
  );
}
