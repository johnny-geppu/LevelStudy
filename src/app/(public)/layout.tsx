import PublicHeader from "@/components/layout/PublicHeader";
import PrivateHeader from "@/components/layout/PrivateHeader";
import { auth } from "@/auth";
export default async function PublicLayout({children}: {children: React.ReactNode}) {
 return <>{(await auth())?.user ? <PrivateHeader /> : <PublicHeader />}{children}</>;
}
