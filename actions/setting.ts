// actions/setting.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  return await prisma.setting.findUnique({
    where: { id: "default" },
  });
}

export async function updateSettings(formData: any) {
  const { hargaBeras, tahunZakat, identitasPanitia } = formData;

  await prisma.setting.upsert({
    where: { id: "default" },
    update: {
      hargaBeras: parseFloat(hargaBeras),
      tahunZakat,
      identitasPanitia,
    },
    create: {
      id: "default",
      hargaBeras: parseFloat(hargaBeras),
      tahunZakat,
      identitasPanitia,
    },
  });

  revalidatePath("/pengaturan");
  revalidatePath("/muzakki");
}
