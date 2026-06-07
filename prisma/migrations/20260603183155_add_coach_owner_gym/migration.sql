/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Gym` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_id]` on the table `Gym` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "owner_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Gym_name_key" ON "Gym"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_owner_id_key" ON "Gym"("owner_id");
