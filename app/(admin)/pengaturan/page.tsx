import { getSettings } from "@/actions/setting";
import { SettingForm } from "@/components/setting/SettingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Sliders, ShieldCheck, Sparkles } from "lucide-react";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-indigo-950 dark:text-white flex items-center gap-3 uppercase">
            Konfigurasi Sistem
            <Settings className="h-8 w-8 text-indigo-500 animate-[spin_4s_linear_infinite]" />
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Sesuaikan parameter zakat dan identitas panitia secara dinamis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- FORM SECTION --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-500/5 overflow-hidden bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border border-white/20">
            <CardHeader className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tight">Parameter Zakat</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Atur harga beras dan besaran nominal</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <SettingForm initialData={settings} />
            </CardContent>
          </Card>
        </div>

        {/* --- INFO SECTION --- */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="h-40 w-40" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Sistem Dinamis</h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed opacity-90">
                Semua perubahan yang Anda simpan akan langsung berdampak pada perhitungan di form transaksi petugas dan laporan rekapitulasi.
              </p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status Konfigurasi</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold italic">Terhubung dengan Database</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-dashed border-2 border-slate-200 dark:border-white/10 bg-transparent">
            <CardContent className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Tips Pengaturan</h4>
              <ul className="space-y-4">
                {[
                  "Gunakan format angka tanpa titik/koma untuk harga.",
                  "Tahun zakat akan muncul di kop surat laporan.",
                  "Identitas panitia digunakan sebagai tanda tangan di laporan PDF."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
