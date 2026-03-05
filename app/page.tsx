// app/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Coins, Calculator, ArrowRight, CheckCircle2, ShieldCheck, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getLandingStats } from '@/actions/landing';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getLandingStats().then(setStats);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-white/20 dark:border-white/5"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link className="flex items-center group" href="/">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20"
            >
              <Heart className="h-6 w-6 text-white fill-current" />
            </motion.div>
            <span className="ml-3 text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              Zakat<span className="text-indigo-600">Manager</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#features">Fitur</Link>
            <Link className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors" href="#stats">Statistik</Link>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">
              <Link href="/auth/login">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-8 shadow-inner"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Aman • Cepat • Akurat</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6 leading-[1.1]"
          >
            Kelola Zakat Fitrah dengan <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-pulse">Teknologi Terpadu</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium"
          >
            Transformasi administrasi zakat masjid Anda. Dari pencatatan muzakki hingga pelaporan otomatis, semua dalam satu platform yang elegan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-indigo-500/30 group">
              <Link href="/auth/login" className="flex items-center gap-2">
                Mulai Kelola Sekarang <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/50 backdrop-blur-sm dark:bg-white/5 font-bold hover:bg-indigo-50 transition-all">
              <Link href="#features">Pelajari Fitur</Link>
            </Button>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 bg-indigo-600/5 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { label: 'Total Muzakki', value: stats?._count.id || 0, icon: Users, desc: 'Keluarga Terdaftar' },
                { label: 'Total Jiwa', value: stats?._sum.jumlahJiwa || 0, icon: CheckCircle2, desc: 'Wajib Zakat' },
                { label: 'Total Beras', value: `${(stats?._sum.jumlahBeras || 0).toFixed(1)} kg`, icon: BarChart3, desc: 'Penerimaan Beras' },
                { label: 'Total Uang', value: `Rp ${(stats?._sum.jumlahUang || 0).toLocaleString('id-ID')}`, icon: Coins, desc: 'Penerimaan Uang' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="glass group hover:bg-white transition-all duration-500 hover:-translate-y-2 border-white/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <item.icon className="h-24 w-24 -mr-8 -mt-8" />
                    </div>
                    <CardContent className="pt-6">
                      <div className="p-3 bg-indigo-600/10 w-fit rounded-xl mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                        <item.icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                        {typeof item.value === 'number' && i < 2 ? (
                          <Counter value={item.value} />
                        ) : item.value}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-2">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight underline decoration-indigo-500/30 decoration-8 underline-offset-8">Solusi Lengkap Amil Zakat</h2>
            <p className="text-slate-500 font-medium">Dirancang untuk memudahkan panitia dalam setiap tahap operasional.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-10 md:grid-cols-3"
          >
            {[
              { title: 'Dashboard Modern', desc: 'Pantau statistik penerimaan secara real-time dengan grafik harian yang informatif.', icon: BarChart3 },
              { title: 'Hitung Otomatis', desc: 'Sistem otomatis menghitung kewajiban zakat berdasarkan jumlah jiwa dan harga beras.', icon: Calculator },
              { title: 'Laporan Instan', desc: 'Generate laporan harian atau tahunan dalam format PDF dan Excel hanya dengan satu klik.', icon: Coins }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
              >
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:rotate-12 transition-all duration-500">
                  <feature.icon className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 mt-auto overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-500 p-2 rounded-xl">
                  <Heart className="h-6 w-6 text-white fill-current" />
                </div>
                <span className="ml-3 text-2xl font-black tracking-tighter">Zakat<span className="text-indigo-400">Manager</span></span>
              </div>
              <p className="text-slate-400 text-center md:text-left max-w-sm font-medium">
                Membantu amil zakat dalam mengelola amanah dengan transparansi dan akurasi tinggi.
              </p>
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">Navigasi</h4>
                <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Fitur</Link>
                <Link href="#stats" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Statistik</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">Akses</h4>
                <Link href="/auth/login" className="text-sm font-medium text-slate-400 hover:text-white font-bold underline underline-offset-4 hover:text-indigo-400 transition-colors">Login Petugas</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-16 pt-8 text-center text-slate-500 text-sm font-medium">
            © 2026 Digital Zakat Solution. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMilisecondDuraton = 2000;
    let incrementTime = (totalMilisecondDuraton / end) > 10 ? (totalMilisecondDuraton / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / (2000 / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}
