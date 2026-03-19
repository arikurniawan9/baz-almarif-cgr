// actions/wilayah.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getWilayahs() {
  return await prisma.wilayah.findMany({
    orderBy: { nama: "asc" },
  });
}
