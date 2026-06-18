/*
  Warnings:

  - A unique constraint covering the columns `[competition_id,mode,category,gender,weight]` on the table `CompetitionDivision` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompetitionDivision_competition_id_mode_category_gender_wei_key" ON "CompetitionDivision"("competition_id", "mode", "category", "gender", "weight");
