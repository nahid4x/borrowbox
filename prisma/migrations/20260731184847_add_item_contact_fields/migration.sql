/*
  Warnings:

  - Added the required column `phoneNumber` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "socialUrl" TEXT;