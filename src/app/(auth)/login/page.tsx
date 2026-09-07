import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        // 登録ページと同じ位置・背景にする
        <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-zinc-50 px-4 py-12">
            <LoginForm />
        </main>
    );
}