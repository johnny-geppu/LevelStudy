import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Progress } from "@/components/Progress";
export default async function Home() {
 if ((await auth())?.user) redirect("/dashboard");
 return <main className="app-main"><section className="landing-hero"><div><p className="eyebrow">A LITTLE LEARNING. A NEW LEVEL.</p><h1>毎日の学びを、<br /><span className="text-teal-700">冒険にしよう。</span></h1><p className="my-7 leading-8 text-slate-500">英語も、プログラミングも、あなたのスキルに。<br />学習を記録してXPをため、昨日より少し成長した自分に出会おう。</p><Link className="btn-primary" href="/register">無料で学習をはじめる →</Link><Link className="ml-5 text-sm text-slate-500" href="/login">ログイン</Link></div><div className="hero-card"><p className="eyebrow">YOUR NEXT LEVEL</p><div className="my-6 flex items-center gap-4"><span className="skill-icon tone-0">Py</span><div><p className="text-xl font-bold">Python</p><p className="text-sm text-slate-500">未来につながる、今日の30分。</p></div></div><Progress xp={230} /><div className="mt-6 rounded-xl bg-teal-50 p-4 text-sm text-teal-800">✦ 学習を記録しました　＋30 XP</div><p className="mt-4 text-xs text-slate-400">画面イメージ · サンプルデータ</p></div></section><section className="grid gap-5 md:grid-cols-3">{[["01","スキルを見つける","学びたい分野を自由に登録。あなた専用の冒険を始めよう。"],["02","学びを積み重ねる","学習時間と内容を記録。1分ごとに1XP、成長が見える。"],["03","成長を実感する","レベル、ストリーク、実績。続けた分だけ、できる自分に。"]].map(([n,t,d]) => <div key={n} className="panel"><p className="eyebrow">{n}</p><h2 className="my-3 text-lg font-bold">{t}</h2><p className="text-sm leading-7 text-slate-500">{d}</p></div>)}</section></main>;
}
