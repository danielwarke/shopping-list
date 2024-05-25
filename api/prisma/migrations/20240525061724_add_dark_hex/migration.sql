/*
  Warnings:

  - Added the required column `darkHex` to the `ListColor` table without a default value. This is not possible if the table is not empty.

*/
DELETE FROM "ListColor";

-- AlterTable
ALTER TABLE "ListColor" ADD COLUMN     "darkHex" TEXT NOT NULL;
