ALTER TABLE "Skill" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "StudyRecord" ADD COLUMN "studiedAt" TIMESTAMP(3);
UPDATE "StudyRecord" SET "studiedAt" = "createdAt";
CREATE INDEX "Skill_userId_idx" ON "Skill"("userId");
CREATE INDEX "StudyRecord_skillId_studiedAt_idx" ON "StudyRecord"("skillId", "studiedAt");
