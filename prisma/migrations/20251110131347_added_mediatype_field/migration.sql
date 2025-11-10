/*
  Warnings:

  - You are about to drop the column `file` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Story` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('FILE', 'TEXT');

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "file",
DROP COLUMN "text",
ADD COLUMN     "media" "MediaType" NOT NULL DEFAULT 'TEXT';
