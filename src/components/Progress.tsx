import { levelProgress } from "@/lib/progress";
export function Progress({ xp }: { xp: number }) {
 const p = levelProgress(xp);
 return <div className="space-y-2"><div className="flex justify-between"><span className="level">Lv. {p.level}</span><span className="text-sm text-slate-500">{xp.toLocaleString()} XP</span></div><div role="progressbar" aria-label="次のレベルまでの進捗" aria-valuenow={p.current} aria-valuemin={0} aria-valuemax={p.needed} className="progress-track"><div style={{width: p.percent + "%"}} /></div><p className="text-xs text-slate-500">次のレベルまで {p.needed - p.current} XP</p></div>;
}
