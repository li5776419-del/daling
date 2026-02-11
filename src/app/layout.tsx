import type { Metadata } from "next";
import { GlobalNav } from "@/components/GlobalNav";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "搭灵Darling - AI 陪伴",
  description: "与你的 AI 灵魂伴侣，建立有温度的陪伴关系",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <UserProvider>
          <GlobalNav />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
