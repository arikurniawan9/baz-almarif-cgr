// components/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useUIStore } from "@/store/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  const isLoading = useUIStore((state) => state.isLoading);

  return (
    <SessionProvider>
      {children}
      <LoadingOverlay isVisible={isLoading} />
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
