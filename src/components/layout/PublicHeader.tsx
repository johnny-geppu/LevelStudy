//未ログイン用ヘッダー

import Link from "next/link";

export default function PublicHeader() {
    return (
        <header className="border-b">
            <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                {/* ロゴ部分。押すとトップページへ */}
                <Link href="/" className="text-xl font-bold">
                    Level Study
                </Link>

                {/* 未ログインユーザー向けのメニュー */}
                <nav className="flex gap-4">
                    <Link href="/login">
                        ログイン
                    </Link>

                    <Link href="/register">
                        新規登録
                    </Link>
                </nav>
            </div>
        </header>
    );
}