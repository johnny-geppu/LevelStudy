"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { validStudyDate } from "@/lib/progress";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type StudyState = { error?: string; success?: string };
const recordSchema = z.object({
  minutes: z.coerce.number().int().min(1).max(1440),
  content: z.string().trim().min(1).max(1000),
  date: z.string().refine(value => validStudyDate(value)),
});

export async function saveStudy(_: StudyState, form: FormData): Promise<StudyState> {
  const user = await requireUser();
  const skillId = String(form.get("skillId") ?? "");
  const operation = String(form.get("operation") ?? "");
  try {
    if (operation === "createSkill") {
      const title = z.string().trim().min(1).max(60).safeParse(form.get("title"));
      if (!title.success) return { error: "スキル名は1〜60文字で入力してください。" };
      await prisma.skill.create({ data: { title: title.data, userId: user.id } });
    } else {
      const skill = await prisma.skill.findFirst({ where: { id: skillId, userId: user.id } });
      if (!skill) return { error: "スキルが見つかりません。" };
      if (operation === "rename") {
        const title = z.string().trim().min(1).max(60).safeParse(form.get("title"));
        if (!title.success) return { error: "スキル名は1〜60文字で入力してください。" };
        await prisma.skill.update({ where: { id: skillId }, data: { title: title.data } });
      } else if (operation === "archive" || operation === "restore") {
        await prisma.skill.update({ where: { id: skillId }, data: { archivedAt: operation === "archive" ? new Date() : null } });
      } else if (operation === "deleteRecord") {
        const result = await prisma.studyRecord.deleteMany({ where: { id: String(form.get("recordId")), skillId, skill: { userId: user.id } } });
        if (!result.count) return { error: "記録が見つかりません。" };
      } else if (operation === "createRecord" || operation === "editRecord") {
        if (skill.archivedAt) return { error: "スキルを復元してから記録してください。" };
        const parsed = recordSchema.safeParse(Object.fromEntries(form));
        if (!parsed.success) return { error: "内容は1〜1000文字、時間は1〜1440分、学習日は2000年以降の今日以前で入力してください。" };
        const { minutes, content, date } = parsed.data;
        const data = { minutes, content, studiedAt: new Date(`${date}T00:00:00+09:00`) };
        if (operation === "createRecord") await prisma.studyRecord.create({ data: { ...data, skillId } });
        else {
          const result = await prisma.studyRecord.updateMany({ where: { id: String(form.get("recordId")), skillId, skill: { userId: user.id } }, data });
          if (!result.count) return { error: "記録が見つかりません。" };
        }
      } else return { error: "操作を確認してください。" };
    }
  } catch (error) {
    console.error("Study operation failed", error instanceof Error ? error.name : "Unknown error");
    return { error: "保存できませんでした。時間をおいて再度お試しください。" };
  }
  revalidatePath("/dashboard");
  if (skillId) revalidatePath(`/skills/${skillId}`);
  return { success: operation === "deleteRecord" ? "記録を削除しました。" : "保存しました。" };
}
