import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        // フォームを画面中央付近に配置
        <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-zinc-50 px-4 py-12">
            <RegisterForm />
        </main>
    );
}