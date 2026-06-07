-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "location" TEXT NOT NULL,
    "inscription_begin_at" TIMESTAMP(3) NOT NULL,
    "inscription_end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Athlete_Registration" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,

    CONSTRAINT "Athlete_Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight_Mode" (
    "id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "mode" "Fighting_Mode" NOT NULL,
    "category" "Fighting_Category" NOT NULL,
    "weight" INTEGER NOT NULL,
    "id_competition" TEXT NOT NULL,
    "athlete_registration_id" TEXT NOT NULL,

    CONSTRAINT "Fight_Mode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Athlete_Registration" ADD CONSTRAINT "Athlete_Registration_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete_Registration" ADD CONSTRAINT "Athlete_Registration_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight_Mode" ADD CONSTRAINT "Fight_Mode_athlete_registration_id_fkey" FOREIGN KEY ("athlete_registration_id") REFERENCES "Athlete_Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
