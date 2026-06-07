/*
  Warnings:

  - You are about to drop the `User_info` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[person_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `person_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "States" AS ENUM ('AMAZONAS', 'ANZOATEGUI', 'APURE', 'ARAGUA', 'BARINAS', 'BOLIVAR', 'CARABOBO', 'COJEDES', 'DELTA_AMACURO', 'DISTRITO_CAPITAL', 'FALCON', 'GUARICO', 'LARA', 'LA_GUAIRA', 'MERIDA', 'MIRANDA', 'MONAGAS', 'NUEVA_ESPARTA', 'PORTUGUESA', 'SUCRE', 'TACHIRA', 'TRUJILLO', 'YARACUY', 'ZULIA');

-- DropForeignKey
ALTER TABLE "User_info" DROP CONSTRAINT "User_info_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "person_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "User_info";

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" "States" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "person_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "person_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_dni_key" ON "Person"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_person_id_key" ON "Coach"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_person_id_key" ON "Athlete"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_person_id_key" ON "User"("person_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
