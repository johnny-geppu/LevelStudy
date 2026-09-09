"use server";
import { registerSchema } from "@/validations/user";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
export type ActionState = { success: boolean; errors: Record<string, string[]> };
export async function registerUser(_: ActionState, formData: FormData): Promise<ActionState> {
    const result = registerSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) return { success: false, errors: result.error.flatten().fieldErrors };
    const { name, email, password } = result.data;
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { success: false, errors: { email: ["このメールアドレスはすでに登録されています。"] } };
        await prisma.user.create({ data: { name, email, password: await bcrypt.hash(password, 12) } });
    } catch (error) {
        if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { success: false, errors: { email: ["このメールアドレスはすでに登録されています。"] } };
        return { success: false, errors: { form: ["登録できませんでした。時間をおいて再度お試しください。"] } };
    }
    try { await signIn("credentials", { email, password, redirect: false }); }
    catch (error) {
        if (error instanceof AuthError) return { success: true, errors: { form: ["アカウントは作成されました。ログイン画面からログインしてください。"] } };
        throw error;
    }
    redirect("/dashboard");
}
