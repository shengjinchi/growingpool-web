import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "内部系统 - 专业交易策略回测与实时监控",
  description: "GrowingPool 内部系统 - 提供XAUUSD混合策略的实时交易监控、历史回测分析、策略配置管理。支持回测分析、实时交易、天梯排行和策略参数调优，专为外汇交易员打造的专业交易系统。",
  keywords: ["外汇交易", "内部系统", "策略回测", "实时监控", "XAUUSD策略", "交易分析", "策略配置"],
  openGraph: {
    title: "内部系统 - 专业交易策略回测与实时监控",
    description: "专业的外汇内部系统，提供策略回测、实时交易监控和性能分析。",
    url: "https://growingpool.com/dashboard",
    type: "website",
  },
  alternates: {
    canonical: "https://growingpool.com/dashboard",
  },
  robots: {
    index: false, // Dashboard 页面不需要被搜索引擎索引
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
