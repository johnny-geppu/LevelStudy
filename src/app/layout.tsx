import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Level Study — 毎日の学びを、冒険に。", description: "学習を記録してXPをため、スキルを育てる学習アプリ。" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
