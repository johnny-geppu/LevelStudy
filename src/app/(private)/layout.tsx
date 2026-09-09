import PrivateHeader from "@/components/layout/PrivateHeader";
import { requireUser } from "@/lib/session";
export default async function PrivateLayout({ children }: {children: React.ReactNode}) {
 await requireUser();
 return <><PrivateHeader />{children}</>;
}
