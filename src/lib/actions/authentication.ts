//ログイン
"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
): Promise<string | undefined> {
    try {
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo: "/dashboard",
        });
//認証成功->undefinedを返す(redirect)
        return undefined;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "メールアドレスまたはパスワードが正しくありません。";

                default:
                    return "ログインに失敗しました。";
            }
        }
//認証失敗->エラーを返し、アクションステイトのstateに格納される
        throw error;
    }
}