// components/layout/NavigationEvents.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUIStore } from "@/store/ui";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setIsLoading = useUIStore((state) => state.setIsLoading);

  useEffect(() => {
    // Sembunyikan loader setelah navigasi selesai
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}
