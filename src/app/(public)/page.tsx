import Link from "next/link";
import { getSkills } from "@/lib/skill";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const skills = await getSkills();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Skills</h1>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Link key={skill.id} href={`/skills/${skill.id}`}>
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p>XP: {skill.xp}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}