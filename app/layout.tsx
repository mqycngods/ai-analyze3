import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreativeHit AI 可见性分析平台",
  description: "面向品牌、Prompt、引用来源、竞品 Gap 与 Agent 工作台的中文 AI 可见性分析平台"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
