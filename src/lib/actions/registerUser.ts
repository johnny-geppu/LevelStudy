"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";


const RegisterUserSchema = z.object({
    name: z.string().min(1, "名前は必須です。"),
    email: z.email("正しいメールアドレスを入力してください。"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
});

export async function registerUser(
    prevState: string | undefined,
    formData: FormData
): Promise<string | undefined> {

    // name属性を使って各入力値を取得する
    const result = RegisterUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!result.success) {
        // console.log("バリデーションエラー:", result, result.error, result.error.issues);
        return result.error.issues[0].message;
    }

    const { name, email, password } = result.data;

    //すでに登録されているメールアドレスか確認
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (existingUser) {
        console.log("このメールアドレスは既に登録されています");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    await signIn("credentials", {
        email,
        password,
        redirect: false,
    })

    redirect("/dashboard");
}