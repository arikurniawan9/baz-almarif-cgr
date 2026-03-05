-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PETUGAS');

-- CreateEnum
CREATE TYPE "ZakatType" AS ENUM ('BERAS', 'UANG');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PETUGAS',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muzakki" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jumlahJiwa" INTEGER NOT NULL,
    "jenisZakat" "ZakatType" NOT NULL,
    "jumlahBeras" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jumlahUang" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "petugasId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Muzakki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "hargaBeras" DOUBLE PRECISION NOT NULL,
    "tahunZakat" TEXT NOT NULL,
    "identitasPanitia" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Muzakki" ADD CONSTRAINT "Muzakki_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
