"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="app-main"><section className="panel"><h1 className="text-xl font-bold">読み込みできませんでした</h1><p className="my-4 text-slate-500">接続状態を確認して、もう一度お試しください。</p><button className="btn-primary" onClick={reset}>再読み込み</button><Link href="/dashboard" className="ml-5 text-sm underline">ホームへ</Link></section></main>;
}
