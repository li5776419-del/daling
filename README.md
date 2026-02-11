# 搭灵 Darling - AI 驱动的精准社交平台

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量（.env.local）：
```
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. 启动开发服务器：
```bash
npm run dev
```

## 部署到 Vercel

```bash
npm run deploy
```

或者手动部署：

```bash
vercel --prod
```

在 Vercel Dashboard 设置环境变量：
- KV_REST_API_URL
- KV_REST_API_TOKEN

## 核心功能

- AI 灵偶动态生成
- 历史数据管理（侧边栏）
- 多维度人格匹配
- 灵偶 A2A 对话
- 付费解锁机制

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Vercel KV
- SecondMe API
