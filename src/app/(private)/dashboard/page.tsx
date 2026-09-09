import Link from "next/link";
import { getSkills } from "@/lib/skill";
import { requireUser } from "@/lib/session";
import { dayKey, summarize } from "@/lib/progress";
import { Progress } from "@/components/Progress";
import { StudyForm, RecordFields } from "@/components/StudyForm";

export default async function DashboardPage() {
    const user = await requireUser();
    const skills = await getSkills();
    const today = dayKey();
    const records = skills.flatMap(s => s.record.map(r => ({ ...r, title: s.title, skillId: s.id })));
    const stats = summarize(records, today);
    const active = skills.filter(s => !s.archivedAt);
    const archived = skills.filter(s => s.archivedAt);
    const maximum = Math.max(60, ...stats.week.map(d => d.minutes));
    const badges = [
        { icon: "✦", title: "はじめの一歩", text: "初めての学習を記録", earned: records.length > 0 },
        { icon: "◷", title: "集中の積み重ね", text: "合計10時間を達成", earned: stats.total >= 600 },
        { icon: "♨", title: "習慣の芽", text: "7日連続で学習", earned: stats.streak >= 7 },
        { icon: "◇", title: "探究者", text: "3分野で学習を記録", earned: skills.filter(s => s.record.length).length >= 3 },
    ];
    return <main className="app-main">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">YOUR LEARNING ADVENTURE</p><h1 className="page-title">今日の一歩が、<br className="sm:hidden" />明日のレベルに。</h1><p className="mt-3 text-slate-500">{user.name}さん、おかえりなさい。あなたのペースで、学びを続けよう。</p></div><a href="#record" className="btn-primary">＋ 学習を記録</a></section>
        <section className="stats-grid" aria-label="学習サマリー">
            {[["今日の学習", stats.today, "分", "今日の努力を積み重ねよう"], ["累計XP", stats.total.toLocaleString(), "XP", "1分の学習 = 1 XP"], ["連続学習", stats.streak, "日", "日本時間・昨日までの継続も含む"], ["学習した日", stats.activeDays, "日", active.length + "個のスキルを育成中"]].map(([label, value, unit, note]) => <div className="panel stat" key={label}><p className="text-sm text-slate-500">{label}</p><p className="stat-value">{value}<span>{unit}</span></p><p className="text-xs text-slate-500">{note}</p></div>)}
        </section>
        <div className="dashboard-grid"><div className="space-y-7">
            <section><div className="section-heading"><h2>マイスキル</h2><span>{active.length} SKILLS</span></div><div className="grid gap-4 sm:grid-cols-2">{active.map((skill, index) => <Link href={"/skills/" + skill.id} key={skill.id} className="panel skill-card"><div className="mb-6 flex items-start justify-between"><span className={"skill-icon tone-" + index % 4}>{skill.title.slice(0, 1).toUpperCase()}</span><span className="text-slate-400">↗</span></div><h3 className="mb-4 text-lg font-bold break-words">{skill.title}</h3><Progress xp={skill.xp} /><p className="mt-4 text-xs text-slate-400">{skill.record.length}回の学習記録</p></Link>)}{!active.length && <div className="panel sm:col-span-2"><h3 className="font-bold">最初のスキルを育てよう</h3><p className="mt-2 text-sm text-slate-500">Python、英語、機械力学など、学びたい分野を追加してください。</p></div>}</div>
                <details className="panel mt-4"><summary className="cursor-pointer font-semibold text-teal-700">＋ 新しいスキルを追加</summary><div className="mt-4"><StudyForm operation="createSkill" label="スキルを追加" reset><label>スキル名<input name="title" maxLength={60} placeholder="例：Python" required /></label></StudyForm></div></details>
                {!!archived.length && <details className="mt-4 text-sm"><summary className="cursor-pointer text-slate-500">アーカイブ済み（{archived.length}）</summary><div className="mt-3 flex flex-wrap gap-3">{archived.map(s => <Link className="underline" key={s.id} href={"/skills/" + s.id}>{s.title}</Link>)}</div></details>}</section>
            <section className="panel"><div className="section-heading"><h2>学習のリズム</h2><span>過去7日間 · 分</span></div><div className="week-chart">{stats.week.map(d => <div className="chart-column" key={d.day}><span>{d.minutes}</span><div className="bar-space"><div className={d.day === today ? "bar today" : "bar"} style={{ height: d.minutes / maximum * 100 + "%", minHeight: d.minutes ? 4 : 2 }} /></div><span>{d.day.slice(5).replace("-", "/")}</span></div>)}</div></section>
            <section className="panel"><div className="section-heading"><h2>最近の学習</h2><span>直近10件</span></div>{records.length ? records.sort((a, b) => (b.studiedAt ?? b.createdAt).getTime() - (a.studiedAt ?? a.createdAt).getTime()).slice(0, 10).map(r => <Link href={"/skills/" + r.skillId} key={r.id} className="history-row"><div className="min-w-0"><p className="text-xs text-slate-500">{dayKey(r.studiedAt ?? r.createdAt)} · {r.title}</p><p className="mt-1 truncate font-medium">{r.content}</p></div><span className="shrink-0 text-sm font-semibold text-teal-700">＋{r.minutes} XP</span></Link>) : <p className="text-sm text-slate-500">記録した学習がここに並びます。まずは短い学習から。</p>}</section>
        </div><aside className="space-y-6">
                <section className="panel record-panel" id="record"><p className="eyebrow">LOG YOUR PROGRESS</p><h2 className="mb-2 text-xl font-bold">今日の学びを残そう</h2><p className="mb-6 text-sm text-slate-500">小さな学びも、確かな経験値に。</p>{active.length ? <StudyForm operation="createRecord" label="記録してXPを獲得" reset><label>スキル<select name="skillId" required>{active.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label><RecordFields today={today} /></StudyForm> : <p className="text-sm text-slate-500">スキルを追加すると記録できます。</p>}</section>
                <section className="panel"><h2 className="mb-5 text-lg font-bold">実績コレクション</h2><div className="space-y-5">{badges.map(b => <div key={b.title} className={"flex gap-3 " + (b.earned ? "" : "opacity-50")}><span className="badge-icon">{b.icon}</span><div><p className="text-sm font-bold">{b.title} {b.earned && <span className="text-teal-700">✓</span>}</p><p className="mt-1 text-xs text-slate-500">{b.text} · {b.earned ? "達成中" : "未達成"}</p></div></div>)}</div><p className="mt-5 text-xs text-slate-400">実績は現在の記録・連続日数に応じて表示されます。</p></section>
                <div className="rounded-2xl bg-teal-950 p-6 text-white"><span className="text-2xl">✧</span><p className="mt-3 font-semibold">昨日の自分を、少しだけ超える。</p><p className="mt-2 text-sm leading-7 text-teal-100/80">5分でも、1ページでも。今日学んだことが、あなたの力になります。</p></div>
            </aside></div><footer className="mt-12 text-center text-xs text-slate-400">LEVEL STUDY · 毎日の学びを、冒険に。</footer>
    </main>;
}
