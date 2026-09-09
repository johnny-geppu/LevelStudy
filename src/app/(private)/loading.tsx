export default function Loading() {
 return <main className="app-main" aria-busy="true"><p role="status" className="text-slate-500">冒険の記録を読み込んでいます…</p><div className="stats-grid mt-8">{[0,1,2,3].map(n => <div key={n} className="panel h-36 animate-pulse bg-slate-100" />)}</div></main>;
}
