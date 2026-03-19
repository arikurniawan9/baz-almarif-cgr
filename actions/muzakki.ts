// actions/muzakki.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ZakatType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getActiveYear } from "./auth-year";

export async function getMuzakkis(search?: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const activeYear = await getActiveYear();

  const where: any = {
    tahun: activeYear,
  };

  if (search) {
    where.OR = [
      { nama: { contains: search, mode: "insensitive" as any } },
      { blokRumah: { contains: search, mode: "insensitive" as any } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.muzakki.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { 
        petugas: { select: { name: true } },
        wilayah: true,
      },
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
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw new Error("Sesi tidak valid. Silakan Logout dan Login kembali.");
  }

  const { nama, blokRumah, wargaId, jumlahJiwa, jenisZakat, jumlahBeras, jumlahUang, infakDesa, infakMasjid } = formData;

  // Ambil data petugas dan setting terbaru
  const [petugas, activeYear] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, wilayahId: true }
    }),
    getActiveYear()
  ]);

  if (!petugas) {
    throw new Error("Akun petugas tidak ditemukan. Silakan Logout dan Login kembali.");
  }

  await prisma.muzakki.create({
    data: {
      nama,
      blokRumah,
      wargaId: wargaId || null,
      jumlahJiwa: parseInt(jumlahJiwa),
      jenisZakat: jenisZakat as ZakatType,
      jumlahBeras: parseFloat(jumlahBeras || 0),
      jumlahUang: parseFloat(jumlahUang || 0),
      infakDesa: parseFloat(infakDesa || 0),
      infakMasjid: parseFloat(infakMasjid || 0),
      petugasId: petugas.id,
      wilayahId: petugas.wilayahId || null,
      tahun: activeYear,
    },
  });

  revalidatePath("/muzakki");
  revalidatePath("/dashboard");
}

export async function updateMuzakki(id: string, formData: any) {
  const { nama, blokRumah, wargaId, jumlahJiwa, jenisZakat, jumlahBeras, jumlahUang, infakDesa, infakMasjid } = formData;

  await prisma.muzakki.update({
    where: { id },
    data: {
      nama,
      blokRumah,
      wargaId: wargaId || null,
      jumlahJiwa: parseInt(jumlahJiwa),
      jenisZakat: jenisZakat as ZakatType,
      jumlahBeras: parseFloat(jumlahBeras || 0),
      jumlahUang: parseFloat(jumlahUang || 0),
      infakDesa: parseFloat(infakDesa || 0),
      infakMasjid: parseFloat(infakMasjid || 0),
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

export async function deleteMultipleMuzakki(ids: string[]) {
  await prisma.muzakki.deleteMany({
    where: {
      id: { in: ids }
    }
  });

  revalidatePath("/muzakki");
  revalidatePath("/dashboard");
}
