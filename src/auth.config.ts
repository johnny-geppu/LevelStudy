// ログイン状態に応じて、各ページへのアクセスを制御する設定

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    // Auth.jsが使用するログインページを指定
    pages: {
        signIn: "/login",
    },

    callbacks: {
        // ページにアクセスするたびに実行され、
        // 「このユーザーをこのページに通していいか」を判定する
        authorized({ auth, request: { nextUrl } }) {

            const isLoggedIn = !!auth?.user;  // auth.user が存在する → ログイン済み

            const isOnDashboard =
                nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/manage");

            if (isOnDashboard) {

                // ログイン済みならアクセス許可
                if (isLoggedIn) {
                    return true;
                }

                // 未ログインなら /login にリダイレクト
                return Response.redirect(
                    new URL("/login", nextUrl)
                );

            // ログイン済みなのに /login にアクセスした場合
            } else if (
                isLoggedIn &&
                nextUrl.pathname === "/login"
            ) {

                // /dashboard にリダイレクト
                return Response.redirect(
                    new URL("/dashboard", nextUrl)
                );
            }

            // それ以外はアクセス許可
            return true;
        },
    },

    // 実際の認証方法は auth.ts 側で設定
    providers: [],

} satisfies NextAuthConfig;