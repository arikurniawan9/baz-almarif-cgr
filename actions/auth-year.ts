"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getLoginYearOptions() {
  const [settings, availableYears] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "default" } }),
    prisma.muzakki.groupBy({
      by: ['tahun'],
      _count: { id: true },
      orderBy: { tahun: 'desc' }
    })
  ]);

  const years = (availableYears as { tahun: string }[]).map(y => y.tahun).filter(Boolean) as string[];
  const defaultYear = settings?.tahunZakat || new Date().getFullYear().toString();

  if (!years.includes(defaultYear)) {
    years.push(defaultYear);
    years.sort((a, b) => b.localeCompare(a));
  }

  // Also add next year as option
  const nextYear = (parseInt(defaultYear) + 1).toString();
  if (!years.includes(nextYear)) {
     years.push(nextYear);
     years.sort((a, b) => b.localeCompare(a));
  }

  return { years, defaultYear };
}

export async function setActiveYearCookie(year: string) {
  const cookieStore = await cookies();
  cookieStore.set("active_year", year, { 
    path: "/", 
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax"
  });
}

export async function getActiveYear() {
  const cookieStore = await cookies();
  const cookieYear = cookieStore.get("active_year")?.value;
  
  if (cookieYear) return cookieYear;

  const settings = await prisma.setting.findUnique({ where: { id: "default" } });
  return settings?.tahunZakat || new Date().getFullYear().toString();
}
