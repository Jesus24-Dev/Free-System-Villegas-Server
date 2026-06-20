-- CreateTable
CREATE TABLE "PagoMovilFields" (
    "id" TEXT NOT NULL,
    "bank_to_pay" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,

    CONSTRAINT "PagoMovilFields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PagoMovilFields_bank_to_pay_dni_phone_key" ON "PagoMovilFields"("bank_to_pay", "dni", "phone");

-- AddForeignKey
ALTER TABLE "PagoMovilFields" ADD CONSTRAINT "PagoMovilFields_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
