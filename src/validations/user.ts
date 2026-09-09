import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "名前は必須です")
            .max(60, "名前は60文字以内にしてください"),

        email: z
            .string()
            .min(1, "メールアドレスは必須です")
            .email("不正なメールアドレスです"),

        password: z
            .string()
            .min(1, "パスワードは必須です")
            .min(8, "パスワードは最低8文字必要です")
            .max(32, "パスワードは最大32文字以内にしてください"),

        confirmPassword: z
            .string()
            .min(1, "確認用パスワードは必須です"),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "パスワードが一致しません",
            path: ["confirmPassword"],
        }
    );
