// components/layout/AppShell.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { NavigationEvents } from "./NavigationEvents";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Muzakki", href: "/muzakki" },
  { icon: UserCheck, label: "Petugas", href: "/petugas", adminOnly: true },
  { icon: FileText, label: "Rekap", href: "/laporan" },
  { icon: Settings, label: "Pengaturan", href: "/pengaturan" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (session?.user as any)?.role === "ADMIN"
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative font-sans">
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-indigo-950 dark:bg-black border-r border-white/10 transition-all duration-500 ease-in-out z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 overflow-hidden">
          <Heart className="h-6 w-6 text-indigo-400 shrink-0 fill-current" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-black text-xl text-white truncate tracking-tighter"
              >
                Zakat Manager
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group relative",
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300", 
                  isActive ? "text-indigo-400 scale-110" : "group-hover:scale-110"
                )} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-4 font-bold text-sm flex-1 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {sidebarOpen && isActive && <ChevronRight className="h-3 w-3 opacity-30 ml-auto" />}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all",
              !sidebarOpen && "px-2"
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="ml-4 font-bold text-sm">Keluar</span>}
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Navbar */}
        <header className="h-16 md:h-20 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-indigo-950 dark:text-white hover:bg-slate-200 transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="md:block">
              <h2 className="text-xs md:text-sm font-black text-indigo-950 dark:text-white uppercase tracking-[0.2em] opacity-40 md:opacity-100">
                {pathname.split('/')[1] || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-indigo-950 dark:text-white tracking-tight leading-none">{session?.user?.name}</p>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">{(session?.user as any)?.role}</p>
            </div>
            <div className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg">
              <div className="h-full w-full rounded-[14px] bg-white dark:bg-gray-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg uppercase">
                {session?.user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* --- MOBILE BOTTOM NAVBAR --- */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-indigo-950/90 dark:bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl z-50 flex items-center justify-around px-2 shadow-2xl shadow-indigo-950/20">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300"
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active"
                    className="absolute -top-2 w-8 h-1 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                  />
                )}
                <item.icon className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isActive ? "text-indigo-400 scale-110" : "text-slate-400 opacity-60"
                )} />
                <span className={cn(
                  "text-[8px] font-bold uppercase tracking-tighter mt-1",
                  isActive ? "text-indigo-300" : "text-slate-500"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center justify-center w-12 h-12 text-slate-400 opacity-60"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-[8px] font-bold uppercase mt-1">Exit</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
