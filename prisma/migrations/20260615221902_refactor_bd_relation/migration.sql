/*
  Warnings:

  - You are about to drop the column `athlete_registration_id` on the `CompetitionDivision` table. All the data in the column will be lost.
  - You are about to drop the column `competition_id` on the `CompetitionRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[athlete_id,division_id]` on the table `CompetitionRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `division_id` to the `CompetitionRegistration` table without a default value. This is not possible if the table is not empty.
  - Made the column `person_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CompetitionDivision" DROP CONSTRAINT "CompetitionDivision_athlete_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionRegistration" DROP CONSTRAINT "CompetitionRegistration_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_person_id_fkey";

-- DropIndex
DROP INDEX "CompetitionRegistration_athlete_id_competition_id_key";

-- AlterTable
ALTER TABLE "CompetitionDivision" DROP COLUMN "athlete_registration_id";

-- AlterTable
ALTER TABLE "CompetitionRegistration" DROP COLUMN "competition_id",
ADD COLUMN     "division_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "person_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionRegistration_athlete_id_division_id_key" ON "CompetitionRegistration"("athlete_id", "division_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRegistration" ADD CONSTRAINT "CompetitionRegistration_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "CompetitionDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
