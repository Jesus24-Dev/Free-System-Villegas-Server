/*
  Warnings:

  - You are about to drop the column `id_competition` on the `Fight_Mode` table. All the data in the column will be lost.
  - Added the required column `competition_id` to the `Fight_Mode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fight_Mode" DROP COLUMN "id_competition",
ADD COLUMN     "competition_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fight_Mode" ADD CONSTRAINT "Fight_Mode_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
