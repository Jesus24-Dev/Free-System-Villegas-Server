/*
  Warnings:

  - You are about to drop the `Athlete_Registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fight_Mode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fighting_Weights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Gym_Payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Competition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FightingMode" AS ENUM ('POINT_FIGHTING', 'KICK_LIGHT', 'LIGHT_CONTACT', 'FULL_CONTACT', 'LOW_KICK', 'K1', 'BOXING');

-- CreateEnum
CREATE TYPE "FightingCategory" AS ENUM ('CH', 'YC', 'OC', 'J', 'S', 'M');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'FINISHED');

-- DropForeignKey
ALTER TABLE "Athlete_Registration" DROP CONSTRAINT "Athlete_Registration_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "Athlete_Registration" DROP CONSTRAINT "Athlete_Registration_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "Fight_Mode" DROP CONSTRAINT "Fight_Mode_athlete_registration_id_fkey";

-- DropForeignKey
ALTER TABLE "Fight_Mode" DROP CONSTRAINT "Fight_Mode_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "Gym_Payment" DROP CONSTRAINT "Gym_Payment_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "Gym_Payment" DROP CONSTRAINT "Gym_Payment_gym_id_fkey";

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "status" "CompetitionStatus" NOT NULL;

-- DropTable
DROP TABLE "Athlete_Registration";

-- DropTable
DROP TABLE "Fight_Mode";

-- DropTable
DROP TABLE "Fighting_Weights";

-- DropTable
DROP TABLE "Gym_Payment";

-- DropEnum
DROP TYPE "Fighting_Category";

-- DropEnum
DROP TYPE "Fighting_Mode";

-- CreateTable
CREATE TABLE "FightingWeights" (
    "id" TEXT NOT NULL,
    "mode" "FightingMode" NOT NULL,
    "category" "FightingCategory" NOT NULL,
    "gender" "Gender" NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "FightingWeights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionRegistration" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,

    CONSTRAINT "CompetitionRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionDivision" (
    "id" TEXT NOT NULL,
    "mode" "FightingMode" NOT NULL,
    "category" "FightingCategory" NOT NULL,
    "gender" "Gender" NOT NULL,
    "weight" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "competition_id" TEXT NOT NULL,
    "athlete_registration_id" TEXT NOT NULL,

    CONSTRAINT "CompetitionDivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymPayment" (
    "id" TEXT NOT NULL,
    "day_payed" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "evidence_url" TEXT,
    "payment_reference" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,

    CONSTRAINT "GymPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionRegistration_athlete_id_competition_id_key" ON "CompetitionRegistration"("athlete_id", "competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "GymPayment_payment_reference_key" ON "GymPayment"("payment_reference");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");

-- AddForeignKey
ALTER TABLE "CompetitionRegistration" ADD CONSTRAINT "CompetitionRegistration_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRegistration" ADD CONSTRAINT "CompetitionRegistration_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionDivision" ADD CONSTRAINT "CompetitionDivision_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionDivision" ADD CONSTRAINT "CompetitionDivision_athlete_registration_id_fkey" FOREIGN KEY ("athlete_registration_id") REFERENCES "CompetitionRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPayment" ADD CONSTRAINT "GymPayment_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPayment" ADD CONSTRAINT "GymPayment_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
