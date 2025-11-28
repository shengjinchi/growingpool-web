# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

GrowingPool 是一个基于 Next.js 15 的专业交易员培训平台，集成交易教育、实践训练、市场分析和SEO优化功能。项目原名为 pinbar-trader-app，现使用 pnpm 作为包管理器。

## 开发命令

### 核心开发命令
```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm start            # 生产运行
pnpm lint             # 代码质量检查
```

### SEO自动化命令
```bash
pnpm generate-sitemap     # 生成站点地图
pnpm baidu-sitemap        # 提交百度站点地图
pnpm baidu-submit         # 百度SEO提交
pnpm baidu-all           # 执行完整的SEO自动化流程
```

## 架构结构

### 技术栈
- **Next.js 15.0.3** - App Router架构，支持SSR/SSG
- **React 19.0.0-rc** - 最新版本React
- **TypeScript** - 严格类型检查
- **Tailwind CSS + Radix UI** - 样式和组件库
- **Supabase** - 数据库和认证
- **PostgreSQL + Redis** - 数据存储和缓存
- **Binance API** - 期货交易接口
- **Three.js + React Three Fiber** - 3D可视化
- **Lightweight Charts** - 交易图表库

### 核心目录

#### 应用架构 (`src/app/`)
```
src/app/
├── (server)/           # 服务端组件组 - 数据处理和API调用
├── [locale]/          # 国际化路由 - 多语言支持
│   └── (portal)/      # 主要功能页面组
│       ├── dashboard/      # 仪表板
│       ├── education/      # 教育培训
│       ├── live-trading/  # 实时交易
│       ├── market-analysis/# 市场分析
│       ├── tools/         # 交易工具
│       └── ...其他功能页面
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

#### 交易引擎 (`src/lib/trading/`)
```
src/lib/trading/
├── connectors/        # API连接器 (Binance等)
│   └── binance.ts # Binance API连接器
├── indicators/        # 技术指标计算
│   ├── bollinger.ts
│   ├── macd.ts
│   ├── keltner.ts
│   └── supertrend.ts
├── strategies/        # 交易策略实现
│   └── xauusd-strategy.ts
├── backtest/         # 回测系统
└── types.ts       # 交易数据类型定义
```

#### 组件库 (`src/components/`)
```
src/components/
├── ui/               # 基础UI组件 (基于Radix UI)
├── navigation/       # 导航组件
├── charts/           # 图表组件
├── education/        # 教育相关组件
├── custom/           # 自定义组件
└── magicui/          # 动画效果组件
```

#### 重要工具目录
```
src/lib/
├── user-management/   # 用户管理
├── utils.ts           # 工具函数
└── getServerLanguage.ts # 服务器语言检测

scripts/               # 自动化脚本
├── generate-sitemap.js    # 站点地图生成
├── baidu-sitemap-submit.js # 百度SEO提交
└── baidu-submit.js         # 百度链接提交
```

#### 内容管理 (`src/content/`)
```
src/content/
├── news/             # 自动新闻内容
├── analysis/         # 市场分析内容
└── education/        # 教育培训内容
```

### 数据流架构

```
外部数据源 → Next.js API路由 → 数据处理层 → 数据存储 → React UI
     ↓              ↓               ↓           ↓          ↓
Binance API → API Routes → 业务逻辑 → PostgreSQL/Redis → 用户界面
```

## 重要约定

### 组件开发模式
- **服务端组件**：放在`(server)`组，用于数据获取和处理
- **客户端组件**：业务逻辑和用户交互，使用`'use client'`
- **UI组件**：基于Radix UI，无障碍访问优先

### API设计模式
RESTful API设计，主要端点：
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

### 样式系统
- Tailwind CSS为主，配合Radix UI主题
- 支持深色模式切换
- 响应式设计优先
- 使用CVA管理组件变体

## 自动化系统

### 内容自动生成
- **新闻内容**：每30分钟自动生成
- **市场分析**：每80分钟自动更新
- **SEO提交**：定期向百度提交站点地图

### 测试环境配置
```env
BINANCE_TESTNET=true      # 使用测试网络
BINANCE_API_KEY=xxx      # Binance API密钥
BINANCE_API_SECRET=xxx   # Binance API密钥
```

## 环境变量

必需的环境变量：
```env
BINANCE_API_KEY=xxx
BINANCE_API_SECRET=xxx
BINANCE_TESTNET=true/false
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
GOOGLE_SERVICE_ACCOUNT_KEY=xxx
```

## 国际化支持

项目支持多语言，使用Next.js 15的国际化路由：
- 路由格式：`/[locale]/page`
- 配置文件：`src/lib/i18n/config.ts`

## 重要注意事项

### 安全考虑
- 所有API密钥通过环境变量管理
- 客户端不暴露敏感信息
- API路由实现适当的验证和授权

### 性能优化
- 使用Next.js的增量静态生成
- 图片优化和懒加载
- Redis缓存热点数据

### 代码质量
- 严格的TypeScript配置
- ESLint规则配置
- 统一的代码风格和类型定义

## 特色功能

### 3D可视化
- Three.js + React Three Fiber
- 自定义3D图表和动画效果

### 实时交易
- Binance期货交易完整支持
- WebSocket实时数据推送
- 技术指标实时计算

### SEO优化
- 自动内容生成系统
- 结构化数据标记
- 多语言SEO优化