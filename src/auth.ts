// authenticate = 実際にログインする
// auth = ログイン情報が正しいか確認
// proxy = ログイン状態を確認するミドルウェア的なもの
// auth.config = ログイン状態に応じたアクセスルール

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// メールアドレスからDB内のユーザーを取得する
async function getUser(email: string) {
    return await prisma.user.findUnique({
        where: { email: email },
    });
}

// Auth.jsの設定
export const { auth, signIn, signOut, handlers } = NextAuth({
    // auth.config.tsで定義した基本設定を読み込む
    ...authConfig,

    // 使用するログイン方法
    providers: [
        // メールアドレス・パスワードによるログイン
        Credentials({
            // 入力された情報でログイン可能か判定する
            async authorize(credentials) {
                // emailとpasswordの入力形式をZodでチェック
                const parsedCredentials = z
                    .object({
                        email: z.email(),
                        password: z.string().min(8),
                    })
                    .safeParse(credentials);

                // 入力形式が正しい場合
                if (parsedCredentials.success) {
                    // 入力されたemailとpasswordを取り出す
                    const { email, password } = parsedCredentials.data;

                    // emailからユーザーをDBで検索
                    const user = await getUser(email);

                    // ユーザーが存在しなければログイン失敗
                    if (!user) return null;

                    // 入力されたpasswordとDBのハッシュ化済みpasswordを比較
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    // パスワードが一致すればログイン成功
                    if (passwordMatch) return user;
                }

                // 入力不正・パスワード不一致ならログイン失敗
                return null;
            },
        }),
    ],

    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id || token.sub || "") as string;
                session.user.name = token.name ?? "";
                session.user.email = token.email ?? "";
            }

            return session;
        },
    },
});
// //Auth.js本体設定
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import { prisma } from "@/lib/prisma";

// import { authConfig } from "@/auth.config";

// import bcrypt from "bcryptjs";

// export const { auth, signIn, signOut } = NextAuth({
//     ...authConfig,

//     callbacks: {
//         ...authConfig.callbacks,
//         async session({ session, token }) {
//             if (session.user && token.sub) {
//                 session.user.id = token.sub;
//             }
//             //async session(data) {
//             //     const session = data.session;
//             //     const token = data.token;
//             // }
//             return session;
//         }
//     },

//     providers: [
//         Credentials({
//             async authorize(credentials) {
//                 const parsedCredentials = z
//                     .object({
//                         email: z.email(),
//                         password: z.string().min(8),
//                     })
//                     .safeParse(credentials);
//                 if (!parsedCredentials.success) {
//                     return null;
//                 }
//                 const { email, password } = parsedCredentials.data; //
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email,
//                     },
//                 });
//                 if (!user) {
//                     return null;
//                 }
//                 const passwordMatch = await bcrypt.compare(
//                     password,
//                     user.password
//                 );
//                 console.log("④ passwordMatch:", passwordMatch);
//                 if (!passwordMatch) {
//                     return null;
//                 }
//                 return user;
//                 console.log("③ user:", user);
//             },
//         }),
//     ],
// })

