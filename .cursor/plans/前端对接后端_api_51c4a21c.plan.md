---
name: 前端对接后端 API
overview: 将前端从 localStorage 迁移到后端 API，包括：1) 后端创建 sentences 端点和开启 CORS，2) 前端修改数据模型为单分类，3) 使用 React Router v7 的 clientLoader 预加载数据，4) 创建递归分类树组件
todos:
  - id: backend-cors
    content: 在 zen-api/src/main.ts 中开启 CORS
    status: pending
  - id: backend-sentences-module
    content: 创建 sentences 模块（module, service, controller）
    status: pending
  - id: backend-sentences-endpoint
    content: 实现 GET /sentences 端点，返回所有句子及关联分类
    status: pending
    dependencies:
      - backend-sentences-module
  - id: backend-app-module
    content: 在 app.module.ts 中导入 SentenceModule
    status: pending
    dependencies:
      - backend-sentences-module
  - id: frontend-data-model
    content: 修改 storage.ts 中的 Sentence 接口为单分类（categoryId）
    status: pending
  - id: frontend-client-loader
    content: 在 home.tsx 中实现 clientLoader 并替换 localStorage 逻辑
    status: pending
    dependencies:
      - frontend-data-model
      - backend-sentences-endpoint
  - id: frontend-category-tree
    content: 创建 CategoryTree.tsx 递归组件（可选，用于未来扩展）
    status: pending
---

# 前端对接后端 API

## 架构概览

```
前端 (zen-web)         后端 (zen-api)
┌─────────────┐        ┌─────────────┐
│ home.tsx    │───────▶│ /categories │
│ clientLoader│        │ /tree       │
│             │        │             │
│             │───────▶│ /sentences  │
│             │        │             │
└─────────────┘        └─────────────┘
```

## 后端任务

### 1. 开启 CORS

**文件**: `zen-api/src/main.ts`

- 在 `bootstrap()` 函数中添加 `app.enableCors()`
- 允许前端（localhost:5173）访问后端 API

### 2. 创建 Sentences 模块

**新文件**: `zen-api/src/sentence/sentence.module.ts`

**新文件**: `zen-api/src/sentence/sentence.service.ts`

**新文件**: `zen-api/src/sentence/sentence.controller.ts`

- 实现 `GET /sentences` 端点
- 返回所有句子，包含关联的分类信息
- 使用 PrismaService 查询数据库

**更新**: `zen-api/src/app.module.ts`

- 导入 SentenceModule

## 前端任务

### 3. 修改数据模型（单分类）

**文件**: `zen-web/app/lib/storage.ts`

- 将 `Sentence` 接口的 `categories: string[]` 改为 `categoryId: string`
- 添加 `categoryName?: string` 用于显示（从后端获取）
- 移除多分类相关的逻辑

### 4. 实现 clientLoader

**文件**: `zen-web/app/routes/home.tsx`

- 添加 `clientLoader` 函数
- 使用 `Promise.all` 并行请求：
  - `GET http://localhost:3000/categories/tree`
  - `GET http://localhost:3000/sentences`
- 使用 `useLoaderData<typeof clientLoader>()` 获取数据
- 移除 `useState` 和 `getSentences()` 的 localStorage 调用

### 5. 创建递归分类树组件（可选显示）

**新文件**: `zen-web/app/components/CategoryTree.tsx`

- 定义 `Category` 接口（匹配后端返回的结构）
- 实现 `CategoryItem` 递归组件
- 支持无限层级嵌套显示
- 暂时不实现点击过滤功能（basic 模式）

## 数据流

1. **页面加载**: `clientLoader` 并行请求两个端点
2. **数据返回**: 前端接收 `{ categoryTree, sentences }`
3. **渲染**: 

   - 分类树显示在侧边栏（如果 UI 需要）
   - 句子列表显示在主区域

## 注意事项

- 确保后端服务器运行在 `localhost:3000`
- 前端服务器运行在 `localhost:5173`
- CORS 配置允许跨域请求
- 数据模型统一为单分类（`categoryId`）