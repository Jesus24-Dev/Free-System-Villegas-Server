/*
  Warnings:

  - Made the column `owner_id` on table `Gym` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Gym" ALTER COLUMN "owner_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
