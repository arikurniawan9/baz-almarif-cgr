// actions/muzakki.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ZakatType } from "@prisma/client";

export async function getMuzakkis(search?: string, page: number = 1) {
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { nama: { contains: search, mode: "insensitive" as any } },
          { alamat: { contains: search, mode: "insensitive" as any } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.muzakki.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { petugas: { select: { name: true } } },
    }),
    prisma.muzakki.count({ where }),
  ]);

  return {
    data,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function createMuzakki(formData: any) {
  const { nama, alamat, jumlahJiwa, jenisZakat, jumlahBeras, jumlahUang, petugasId } = formData;

  await prisma.muzakki.create({
    data: {
      nama,
      alamat,
      jumlahJiwa: parseInt(jumlahJiwa),
      jenisZakat: jenisZakat as ZakatType,
      jumlahBeras: parseFloat(jumlahBeras || 0),
      jumlahUang: parseFloat(jumlahUang || 0),
      petugasId,
    },
  });

  revalidatePath("/muzakki");
  revalidatePath("/dashboard");
}

export async function updateMuzakki(id: string, formData: any) {
  const { nama, alamat, jumlahJiwa, jenisZakat, jumlahBeras, jumlahUang } = formData;

  await prisma.muzakki.update({
    where: { id },
    data: {
      nama,
      alamat,
      jumlahJiwa: parseInt(jumlahJiwa),
      jenisZakat: jenisZakat as ZakatType,
      jumlahBeras: parseFloat(jumlahBeras || 0),
      jumlahUang: parseFloat(jumlahUang || 0),
    },
  });

  revalidatePath("/muzakki");
  revalidatePath("/dashboard");
}

export async function deleteMuzakki(id: string) {
  await prisma.muzakki.delete({
    where: { id },
  });

  revalidatePath("/muzakki");
  revalidatePath("/dashboard");
}
