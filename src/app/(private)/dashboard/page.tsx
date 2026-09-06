import { auth } from "@/auth";

export default async function DashboardPage() {
    // 現在ログインしているユーザーのセッションを取得
    const session = await auth();

    return (
        <div>
            <h1>Dashboard</h1>

            <p>
                ログイン中：
                {session?.user?.email ?? "未ログイン"}
            </p>
        </div>
    );
}