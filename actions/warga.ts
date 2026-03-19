// actions/warga.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWargas(search?: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { nama: { contains: search, mode: "insensitive" as any } },
          { blokRumah: { contains: search, mode: "insensitive" as any } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.warga.findMany({
      where,
      skip,
      take: limit,
      orderBy: { blokRumah: "asc" },
      include: { wilayah: true },
    }),
    prisma.warga.count({ where }),
  ]);

  return {
    data,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function getAllWargas() {
  return await prisma.warga.findMany({
    orderBy: [{ blokRumah: "asc" }, { nama: "asc" }],
    include: { wilayah: true },
  });
}

export async function checkWargaExist(blokRumah: string) {
  const exist = await prisma.warga.findUnique({
    where: { blokRumah },
    include: { wilayah: true }
  });
  return exist;
}

export async function createOrUpdateWarga(formData: any) {
  const { nama, blokRumah, wilayahId } = formData;
  const finalNama = nama?.trim() === "" ? "namawarga" : nama;

  if (!blokRumah || !wilayahId) {
    throw new Error("Blok dan Wilayah wajib diisi");
  }

  await prisma.warga.upsert({
    where: { blokRumah },
    update: {
      nama: finalNama,
      wilayahId: wilayahId
    },
    create: {
      nama: finalNama,
      blokRumah,
      wilayahId: wilayahId
    }
  });

  revalidatePath("/warga");
}

export async function importWarga(data: any[]) {
  await prisma.$transaction(
    data.map((item) => {
      const finalNama = item.nama?.trim() === "" || !item.nama ? "namawarga" : item.nama;
      
      return prisma.warga.upsert({
        where: { blokRumah: item.blokRumah },
        update: {
          nama: finalNama,
          wilayahId: item.wilayahId
        },
        create: {
          nama: finalNama,
          blokRumah: item.blokRumah,
          wilayahId: item.wilayahId
        }
      });
    })
  );

  revalidatePath("/warga");
  return { success: true, count: data.length };
}

export async function updateWarga(id: string, formData: any) {
  const { nama, blokRumah, wilayahId } = formData;
  const finalNama = nama?.trim() === "" ? "namawarga" : nama;

  await prisma.warga.update({
    where: { id },
    data: {
      nama: finalNama,
      blokRumah,
      wilayahId: wilayahId,
    },
  });

  revalidatePath("/warga");
}

export async function deleteWarga(id: string) {
  await prisma.warga.delete({
    where: { id },
  });

  revalidatePath("/warga");
}

export async function deleteMultipleWarga(ids: string[]) {
  await prisma.warga.deleteMany({
    where: {
      id: { in: ids }
    }
  });

  revalidatePath("/warga");
}
