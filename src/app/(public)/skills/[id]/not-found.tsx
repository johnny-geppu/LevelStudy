import Link from "next/link";
export default function NotFound() {
    return (
        <main className="app-main"><section className="panel"><h1 className="text-xl font-bold">スキルが見つかりません</h1><p className="my-4 text-slate-500">スキルが存在しないか、閲覧する権限がありません。</p><Link href="/dashboard" className="btn-primary">ホームへ戻る</Link></section></main>
    )
}
