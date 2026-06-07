/*
  Warnings:

  - You are about to drop the column `weight` on the `User_info` table. All the data in the column will be lost.
  - Added the required column `status` to the `User_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_info" DROP COLUMN "weight",
ADD COLUMN     "status" BOOLEAN NOT NULL;
