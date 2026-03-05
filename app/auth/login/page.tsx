// app/auth/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/store/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/dashboard";
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Aktifkan loader global

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Akses Ditolak", {
          description: "Username atau password tidak valid."
        });
        setIsLoading(false); // Matikan jika gagal
      } else {
        toast.success("Otentikasi Berhasil");
        router.push(callbackUrl);
        router.refresh();
        // Loader akan otomatis dimatikan oleh NavigationEvents di layout dashboard
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[380px] animate-in fade-in zoom-in duration-700">
      <div className="flex justify-center mb-4">
        <div className="bg-indigo-600/10 backdrop-blur-xl border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-2">
          <ShieldCheck className="h-3 w-3 text-indigo-500" />
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Secure Access</span>
        </div>
      </div>

      <Card className="glass border-white/20 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <CardHeader className="space-y-1 pt-6 pb-2 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 mb-3">
            <Heart className="h-6 w-6 text-white fill-current" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            Zakat Manager
          </CardTitle>
          <CardDescription className="text-xs font-medium">
            Sistem Administrasi Zakat Fitrah
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Username</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="pl-10 h-10 bg-white/50 dark:bg-black/20 border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5 relative">
              <Label htmlFor="password" title="Password" className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10 bg-white/50 dark:bg-black/20 border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all [appearance:none] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 group text-sm relative" 
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                Masuk Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white/10 px-2 text-gray-400 font-bold backdrop-blur-sm">Atau</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-10 bg-white/50 dark:bg-black/20 border-white/20 hover:bg-white/80 dark:hover:bg-black/40 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all"
            onClick={() => {
              setIsLoading(true);
              signIn("google", { callbackUrl });
            }}
            type="button"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
        </CardContent>

        <CardFooter className="pb-4 pt-0"></CardFooter>
      </Card>
      
      <p className="mt-4 text-center text-[10px] text-gray-500 font-medium">
        © 2026 Digital Zakat Solution.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      
      <Suspense fallback={<div className="text-indigo-600 font-bold animate-pulse text-sm">Menyiapkan...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
