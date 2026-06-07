-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_person_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "person_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
