//seed作成する
import { PrismaClient } from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    await prisma.studyRecord.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();
    const hashedPassword = await bcrypt.hash("password", 12);

    const user = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "user@example.com",
            password: hashedPassword
        }
    });
    const skill = await prisma.skill.create({
        data: {
            title: "プログラミング",
            userId: user.id,
        }
    })
    await prisma.studyRecord.create({
        data: {
            content: "Next.jsの勉強",
            minutes: 60,
            skillId: skill.id,
        }
    })

}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }
    )

