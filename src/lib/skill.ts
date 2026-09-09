import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
export async function getSkills() {
  const user = await requireUser();
  const skills = await prisma.skill.findMany({ where: { userId: user.id }, include: { record: true }, orderBy: { createdAt: "desc" } });
  return skills.map(s => ({ ...s, xp: s.record.reduce((sum, r) => sum + r.minutes, 0) }));
}
export async function getSkill(id: string) {
  const user = await requireUser();
  const s = await prisma.skill.findFirst({ where: { id, userId: user.id }, include: { record: true } });
  if (!s) return null;
  s.record.sort((a,b) => (b.studiedAt ?? b.createdAt).getTime() - (a.studiedAt ?? a.createdAt).getTime());
  return { ...s, xp: s.record.reduce((sum,r) => sum + r.minutes,0) };
}
