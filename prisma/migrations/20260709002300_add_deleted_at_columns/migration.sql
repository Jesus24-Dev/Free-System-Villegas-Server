-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CompetitionDivision" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CompetitionRegistration" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GymPayment" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PagoMovilFields" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Athlete_gym_id_idx" ON "Athlete"("gym_id");

-- CreateIndex
CREATE INDEX "Athlete_deleted_at_idx" ON "Athlete"("deleted_at");

-- CreateIndex
CREATE INDEX "Coach_gym_id_idx" ON "Coach"("gym_id");

-- CreateIndex
CREATE INDEX "Coach_deleted_at_idx" ON "Coach"("deleted_at");

-- CreateIndex
CREATE INDEX "Competition_status_idx" ON "Competition"("status");

-- CreateIndex
CREATE INDEX "Competition_deleted_at_idx" ON "Competition"("deleted_at");

-- CreateIndex
CREATE INDEX "CompetitionDivision_deleted_at_idx" ON "CompetitionDivision"("deleted_at");

-- CreateIndex
CREATE INDEX "CompetitionRegistration_division_id_idx" ON "CompetitionRegistration"("division_id");

-- CreateIndex
CREATE INDEX "CompetitionRegistration_deleted_at_idx" ON "CompetitionRegistration"("deleted_at");

-- CreateIndex
CREATE INDEX "FightingWeights_mode_category_gender_weight_idx" ON "FightingWeights"("mode", "category", "gender", "weight");

-- CreateIndex
CREATE INDEX "Gym_deleted_at_idx" ON "Gym"("deleted_at");

-- CreateIndex
CREATE INDEX "GymPayment_athlete_id_idx" ON "GymPayment"("athlete_id");

-- CreateIndex
CREATE INDEX "GymPayment_gym_id_idx" ON "GymPayment"("gym_id");

-- CreateIndex
CREATE INDEX "GymPayment_deleted_at_idx" ON "GymPayment"("deleted_at");

-- CreateIndex
CREATE INDEX "PagoMovilFields_gym_id_idx" ON "PagoMovilFields"("gym_id");

-- CreateIndex
CREATE INDEX "PagoMovilFields_deleted_at_idx" ON "PagoMovilFields"("deleted_at");

-- CreateIndex
CREATE INDEX "Person_deleted_at_idx" ON "Person"("deleted_at");

-- CreateIndex
CREATE INDEX "User_deleted_at_idx" ON "User"("deleted_at");
