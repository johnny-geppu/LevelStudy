//Auth.js本体設定
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

import { authConfig } from "@/auth.config";

import bcrypt from "bcryptjs";

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,

    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.email(),
                        password: z.string().min(8),
                    })
                    .safeParse(credentials);
                if (!parsedCredentials.success) {
                    return null;
                }
                const { email, password } = parsedCredentials.data; //
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (!user) {
                    return null;
                }
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );
                console.log("④ passwordMatch:", passwordMatch);
                if (!passwordMatch) {
                    return null;
                }
                return user;
                console.log("③ user:", user);
            },
        }),
    ],
})



// export const { auth, signIn, signOut } = NextAuth({
//     ...authConfig,

//     callbacks: {
//         ...authConfig.callbacks,

//         async session({ session, token }) {
//             if (session.user && token.sub) {
//                 session.user.id = token.sub;
//             }

//             return session;
//         },
//     },

//     providers: [
//         Credentials({
//             // 今までのauthorize処理
//         }),
//     ],
// });