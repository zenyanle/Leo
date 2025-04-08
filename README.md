# Notion 博客系统

[![项目状态](https://img.shields.io/badge/status-开发中-yellow)](https://shields.io/)

一个基于 Next.js 构建的博客系统，使用 Notion 作为内容管理系统（CMS）。项目采用静态站点生成（SSG）方式，在构建阶段从 Notion 数据库获取内容，生成高性能的静态 HTML 博文页面。

**状态：** 当前处于活跃开发阶段。

---

## ✨ 特性

- **Notion 作为 CMS：** 直接通过 Notion 数据库管理博客文章内容。
- **静态站点生成（SSG）：** 构建时预渲染页面，提升页面性能和 SEO 表现。
- **Markdown 转换：** 使用 `notion-to-md` 将 Notion 页面内容转换为 Markdown。
- **HTML 渲染：** 使用 `marked` 将 Markdown 渲染为 HTML。
- **语法高亮：** 使用 `highlight.js` 对代码块进行高亮显示。
- **动态路由 Slug：** 根据 Notion 属性生成文章 URL Slug。
- **拼音 Slug 转换：** 中文 Slug 会自动转换为拼音，提升 URL 可读性与兼容性。
- **博客列表页：** 显示所有已发布文章的预览信息。
- **博客详情页：** 为每篇文章生成独立的静态页面。
- **定时内容更新：** 使用 `revalidate` 支持定期刷新内容。

---

## 🚀 技术栈

- **框架：** [Next.js](https://nextjs.org/)（App Router）
- **语言：** [TypeScript](https://www.typescriptlang.org/)
- **CMS：** [Notion](https://www.notion.so/)
- **集成：** [`@notionhq/client`](https://github.com/makenotion/notion-sdk-js)
- **Markdown 转换：** [`notion-to-md`](https://github.com/souvikinator/notion-to-md)
- **Markdown 渲染：** [`marked`](https://marked.js.org/)、[`marked-highlight`](https://github.com/markedjs/marked-highlight)
- **代码高亮：** [`highlight.js`](https://highlightjs.org/)
- **Slug 生成：** [`pinyin`](https://github.com/hotoo/pinyin)
- **样式：** CSS Modules + 全局 CSS

---

## 🛠️ 快速开始

### 环境要求

- Node.js（建议使用 LTS 或与 `package.json` 中指定版本一致）
- npm 或 yarn
- 一个 Notion 账户及集成 Token

### 安装步骤

1. 克隆项目：
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
```

---

## 🔧 Notion 配置

### 1. 创建 Notion 集成

- 前往 [My Integrations](https://www.notion.so/my-integrations) 创建集成
- 记下生成的 **Internal Integration Token**（即 `.env.local` 中的 `NEXT_PUBLIC_NOTION_ACCESS_TOKEN`）

### 2. 创建 Notion 数据库

- 创建数据库用于存储博文
- 与你的集成共享权限（分享按钮 → 添加集成）
- 记录 **Database ID**，可在数据库页面的 URL 中找到（示例：`https://www.notion.so/workspace/数据库ID?v=...`）

### 3. 设置数据库属性（区分大小写）：

- `Name`（类型：标题）
- `Published`（类型：复选框）
- `Tags`（类型：多选）
- `Description`（类型：富文本）
- `Slug`（类型：公式）
- `Updated`（类型：最后编辑时间）

Slug 示例公式：
```notion
replaceAll(prop("Name"), " ", "-")
```

---

## ⚙️ 配置环境变量

在项目根目录创建 `.env.local` 文件：
```env
NEXT_PUBLIC_NOTION_ACCESS_TOKEN=你的Notion集成Token
NEXT_PUBLIC_NOTION_BLOG_DATABASE_ID=你的数据库ID
```

> 🔒 安全提示：虽然使用 `NEXT_PUBLIC_` 变量前缀会暴露至前端，但在本项目中由于构建为静态文件，构建后不会出现在客户端代码中。如后续加入 SSR 或 API 路由，请考虑改为服务端私密变量。

---

## ▶️ 本地运行
```bash
npm run dev
# 或
yarn dev
```
打开浏览器访问：http://localhost:3000

---

## 🏗️ 构建生产版本

项目已配置为静态导出（`output: 'export'`）：
```bash
npm run build
# 或
yarn build
```
构建后生成内容位于 `out/` 目录。

---

## ☁️ 部署

构建后可将 `out/` 目录部署至任何静态托管平台，如：

- Vercel
- Netlify
- GitHub Pages
- AWS S3 / Cloudflare Pages 等

---

## 📁 项目结构

```bash
.
├── app/                   # Next.js App Router
│   ├── blog/              # 博客路由页面
│   │   ├── [slug]/        # 动态路由页
│   │   │   └── page.tsx   # 博客文章页面模板
│   │   └── page.tsx       # 博客首页（暂显示示例 Markdown）
│   ├── service/           # 服务（如获取 Notion 数据）
│   │   └── notion-service.ts
│   ├── styles/            # 样式文件夹
│   │   ├── blog.module.css
│   │   └── shared.module.css
│   ├── types/             # TypeScript 类型定义
│   │   └── schema.ts
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.module.css    # 首页样式
│   └── page.tsx           # 首页内容
├── public/                # 静态资源
├── next.config.ts         # Next.js 配置
├── package.json           # 依赖与脚本
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

---

## 📌 待办事项 / 未来计划

- [ ] 博客首页分页支持
- [ ] 标签筛选功能
- [ ] UI 和样式优化
- [ ] 搜索功能支持
- [ ] 更完善的错误处理
- [ ] 若加入 SSR / API 路由，调整敏感密钥存储方式

---

