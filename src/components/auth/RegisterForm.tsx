"use client";

import { registerUser } from "@/lib/actions/registerUser";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
    const [state, formAction, pending] = useActionState(registerUser, {
        success: false,
        errors: {},
    });

    return (
        <div className="relative w-full max-w-md">

            {/* 背景のぼかし装飾 */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-zinc-300/40 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-zinc-400/30 blur-3xl" />

            {/* メインカード */}
            <div className="relative rounded-3xl border border-zinc-200/70 bg-white/80 p-8 shadow-xl backdrop-blur">

                {/* タイトル */}
                <div className="mb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
                        Level Study
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Create account
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        アカウントを作成して、学習を始めましょう。
                    </p>
                </div>

                <form action={formAction} className="space-y-5">

                    {/* 名前 */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            名前
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="ジョニー・ゲップ"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                        />

                        {state.errors.name && (
                            <p className="text-sm text-red-500">
                                {state.errors.name.join(",")}
                            </p>
                        )}
                    </div>

                    {/* メールアドレス */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium"
                        >
                            メールアドレス
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                        />

                        {state.errors.email && (
                            <p className="text-sm text-red-500">
                                {state.errors.email.join(",")}
                            </p>
                        )}
                    </div>

                    {/* パスワード */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            パスワード
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="8文字以上"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                        />

                        {state.errors.password && (
                            <p className="text-sm text-red-500">
                                {state.errors.password.join(",")}
                            </p>
                        )}
                    </div>

                    {/* パスワード確認 */}
                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium"
                        >
                            パスワード（確認）
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="もう一度入力"
                            required
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                        />

                        {state.errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {state.errors.confirmPassword.join(",")}
                            </p>
                        )}
                    </div>

                    {/* 登録ボタン */}
                    {state.errors.form && <p role="alert" className="text-sm text-red-600">{state.errors.form.join(" ")}</p>}
                    <Button
                        disabled={pending}
                        type="submit"
                        className="w-full"
                    >
                        {pending ? "作成中…" : "アカウントを作成"}
                    </Button>
                </form>

                {/* 区切り */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-zinc-200" />
                    <span className="text-xs text-zinc-400">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* ログインへのリンク */}
                <p className="text-center text-sm text-zinc-500">
                    すでにアカウントをお持ちですか？{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-zinc-950 hover:underline"
                    >
                        ログイン
                    </Link>
                </p>
            </div>
        </div>
    );
}
