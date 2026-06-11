-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_gym_id_fkey";

-- DropForeignKey
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_gym_id_fkey";

-- AlterTable
ALTER TABLE "Athlete" ALTER COLUMN "gym_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Coach" ALTER COLUMN "gym_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE SET NULL ON UPDATE CASCADE;
