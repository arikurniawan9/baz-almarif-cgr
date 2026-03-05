// actions/landing.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getLandingStats() {
  const stats = await prisma.muzakki.aggregate({
    _count: { id: true },
    _sum: { jumlahJiwa: true, jumlahBeras: true, jumlahUang: true },
  });
  return stats;
}
