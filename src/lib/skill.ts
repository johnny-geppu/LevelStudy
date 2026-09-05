//SkillをDBから取得(スキル一覧)
import { prisma } from "@/lib/prisma"

export async function getSkills() {
    return await prisma.skill.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

//SkillをDBから取得(スキル詳細)
export async function getSkill(id: string) {
    return await prisma.skill.findUnique({
        where: {
            id
        },
        include: {
            record: true,
            user:true
        }
    })
}
