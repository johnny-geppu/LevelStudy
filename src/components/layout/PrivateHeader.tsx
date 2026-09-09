import Link from "next/link";
import { signOut } from "@/auth";
export default function PrivateHeader() {
 return <header className="app-header"><div className="header-inner"><Link href="/dashboard" className="brand"><span className="brand-mark">L</span> Level Study<span className="brand-tag">学びを、力に。</span></Link><nav className="flex items-center gap-5 text-sm"><Link href="/dashboard">冒険のホーム</Link><form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}><button className="text-slate-500">ログアウト</button></form></nav></div></header>;
}
