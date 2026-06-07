-- AlterTable
ALTER TABLE "Fight_Mode" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "monthly_payment" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Gym_Payment" (
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

    CONSTRAINT "Gym_Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gym_Payment" ADD CONSTRAINT "Gym_Payment_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym_Payment" ADD CONSTRAINT "Gym_Payment_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
