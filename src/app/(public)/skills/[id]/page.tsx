import { notFound } from "next/navigation";
import { getSkill } from "@/lib/skill";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function SkillPage({ params }: PageProps) {
    const { id } = await params;
    const skill = await getSkill(id);

    if (!skill) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{skill.title}</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-lg font-semibold">
                        XP: {skill.xp}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {skill.name}分
                    </p>
                </CardContent>
            </Card>

            <h2 className="mt-8 mb-4 text-2xl font-bold">
                Study Records
            </h2>

            <div className="space-y-3">
                {skill.record.map((record) => (
                    <Card key={record.id}>
                        <CardContent className="pt-6">
                            <p className="font-medium">
                                {record.content}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {record.minutes}分
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}