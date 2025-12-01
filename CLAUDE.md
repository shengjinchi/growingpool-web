# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

GrowingPool 是一个基于 Next.js 15 的专业交易员培训平台，集成交易教育、实践训练、市场分析和SEO优化功能。项目原名为 pinbar-trader-app，现使用 pnpm 作为包管理器。这是一个严格筛选的交易员培养平台，通过30天考核期筛选10-15%通过率的优秀交易员，并提供资金管理权限。

## 开发命令

### 核心开发命令
```bash
pnpm dev              # 启动开发服务器 (localhost:3001)
pnpm build            # 生产构建
pnpm start            # 生产运行
pnpm lint             # 代码质量检查
pnpm generate-sitemap # 生成站点地图
```

### 重要环境配置
- **端口**: 开发服务器默认运行在3001端口
- **测试网络**: 使用 `BINANCE_TESTNET=true` 进行测试
- **双语支持**: 默认语言为中文，根路径重定向到 `/zh`

## 核心架构

### 技术栈
- **Next.js 15.0.3** - App Router架构，支持SSR/SSG
- **React 19.0.0-rc** - 最新版本React
- **TypeScript** - 严格类型检查，路径别名 `@/*`
- **Tailwind CSS + Radix UI** - 样式和组件库
- **Supabase** - 数据库和认证
- **PostgreSQL + Redis** - 数据存储和缓存
- **Binance API** - 期货交易接口
- **Three.js + React Three Fiber** - 3D可视化
- **Lightweight Charts** - 交易图表库

### 国际化架构
- **双语支持**: 真正的URL路径级别国际化 (`/zh/`, `/en/`)
- **默认路径**: 根路径重定向到 `/zh`
- **语言切换**: 智能语言切换，保持当前页面
- **SEO优化**: 针对不同语言的SEO策略

### 关键配置
- **Next.js配置**: 支持外部图片域名和原生Node.js模块
- **包管理**: pnpm 10.18.3，React 19特定的依赖覆盖
- **TypeScript**: 严格模式，增量编译，路径映射

### 目录结构

#### App Router 架构
```
src/app/
├── (server)/           # 服务端组件组 - 数据处理和API调用
├── [locale]/          # 国际化路由 (/zh/, /en/)
│   └── (portal)/      # 主要功能页面组
│       ├── dashboard/      # 交易仪表板
│       ├── education/      # 教育培训
│       ├── live-trading/  # 实时交易
│       ├── splan/         # 会员系统
│       └── blog/          # 博客系统
├── api/               # API路由 - 后端接口
│   ├── trading/      # 交易相关API
│   ├── database-test/  # 数据库测试
│   └── supabase-test/  # Supabase测试
├── layout.tsx         # 根布局
├── page.tsx           # 首页（重定向到中文版）
├── robots.ts          # SEO配置
├── sitemap.ts         # 站点地图
└── globals.css        # 全局样式
```

#### 交易系统架构
```
src/lib/trading/
├── connectors/        # API连接器 (Binance等)
├── indicators/        # 技术指标计算 (MACD, Bollinger, Keltner, Supertrend)
├── strategies/        # 交易策略实现
├── backtest/         # 回测系统
└── types.ts          # 完整的TypeScript类型定义
```

#### 组件分层
```
src/components/
├── ui/               # 基础UI组件 (基于Radix UI)
├── layout/           # 布局组件
├── navigation/       # 导航组件
├── charts/           # 图表组件
├── education/        # 教育相关组件
├── custom/           # 自定义业务组件
├── providers/        # 全局Provider
└── magicui/          # 动画效果组件
```

#### 数据与内容管理
```
src/
├── data/             # 静态数据 (blogPosts.ts 410KB博客数据)
├── content/          # 自动生成内容 (新闻、分析、教育)
├── contexts/         # React Context (LanguageContext)
├── hooks/            # 自定义Hooks
├── middleware.ts     # 中间件 (语言检测)
└── types/            # 全局类型定义
```

## 开发约定

### 组件开发模式
- **服务端组件**: 放在`(server)`组，用于数据获取和处理
- **客户端组件**: 业务逻辑和用户交互，使用`'use client'`
- **UI组件**: 基于Radix UI，无障碍访问优先，使用CVA管理变体

### API设计模式
RESTful API架构，主要端点：
```
/api/trading/
├── test-connection    # 连接测试
├── binance-status     # 账户状态
├── candles           # K线数据
├── positions         # 持仓管理
├── symbols           # 交易对信息
└── live              # 实时交易数据

/api/database-test/   # 数据库连接测试
/api/supabase-test/   # Supabase服务测试
```

### 核心业务逻辑
- **30天考核机制**: 严格的交易员筛选流程
- **分阶段培训**: 规则学习(1-5天)→盈利练习(6-20天)→盈利考核(21-30天)
- **通过率控制**: 仅10-15%通过考核
- **收益分成**: 通过考核后获得60%-90%利润分成
- **资金管理**: 优秀交易员获得大额资金管理权限

### 样式系统
- **主框架**: Tailwind CSS + Radix UI主题
- **组件变体**: Class Variance Authority (CVA)
- **响应式**: 移动优先设计
- **主题**: 支持深色模式切换

## 环境配置

### 必需环境变量
```env
BINANCE_API_KEY=xxx
BINANCE_API_SECRET=xxx
BINANCE_TESTNET=true/false
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
GOOGLE_SERVICE_ACCOUNT_KEY=xxx
```

### 开发注意事项
- **安全**: 所有API密钥通过环境变量管理，客户端不暴露敏感信息
- **测试**: 使用 `BINANCE_TESTNET=true` 进行开发测试
- **端口**: 开发服务器默认3001端口
- **语言**: 默认中文，支持完整的中英双语切换

## 关键技术特性

### 数据管理与缓存
- **增量静态生成**: Next.js 15的ISR和SSG优化
- **Redis缓存**: 热点数据和交易指标缓存
- **图片优化**: 自动图片优化和懒加载
- **数据库**: PostgreSQL + Supabase集成

### 实时交易功能
- **Binance API**: 完整的期货交易API集成
- **WebSocket**: 实时数据推送和价格更新
- **技术指标**: MACD、Bollinger、Keltner、Supertrend实时计算
- **风险控制**: 完整的风险管理和仓位控制

### 可视化与交互
- **3D可视化**: Three.js + React Three Fiber
- **交易图表**: Lightweight Charts专业图表库
- **动画效果**: Framer Motion和MagicUI组件
- **响应式设计**: 移动优先的自适应布局

### SEO与性能
- **多语言SEO**: 针对中英文的SEO优化
- **自动内容**: 新闻和分析内容自动生成
- **结构化数据**: 完整的SEO元数据
- **性能监控**: Vercel Analytics和Speed Insights

## 重要文件说明

- **`src/data/blogPosts.ts`**: 410KB博客数据，包含完整文章内容
- **`src/middleware.ts`**: 语言检测和路径重定向中间件
- **`src/contexts/LanguageContext.tsx`**: 双语切换Context
- **`src/components/layout/UnifiedNavbar.tsx`**: 统一导航栏组件
- **`next.config.ts`**: Next.js配置，支持外部图片和原生模块
- **`tsconfig.json`**: TypeScript配置，路径映射和增量编译