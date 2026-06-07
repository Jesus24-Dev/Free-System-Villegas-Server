-- CreateEnum
CREATE TYPE "Fighting_Mode" AS ENUM ('POINT_FIGHTING', 'KICK_LIGHT', 'LIGHT_CONTACT', 'FULL_CONTACT', 'LOW_KICK', 'K1', 'BOXING');

-- CreateEnum
CREATE TYPE "Fighting_Category" AS ENUM ('CH', 'YC', 'OC', 'J', 'S', 'M');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Fighting_Weights" (
    "id" TEXT NOT NULL,
    "mode" "Fighting_Mode" NOT NULL,
    "category" "Fighting_Category" NOT NULL,
    "gender" "Gender" NOT NULL,
    "weights" INTEGER[],

    CONSTRAINT "Fighting_Weights_pkey" PRIMARY KEY ("id")
);
