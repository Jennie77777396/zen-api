# Public Networking 说明

## ✅ 必须启用 Public Networking

**原因：**
- 前端部署在 **Vercel**（外部）
- 后端部署在 **Railway**（外部）
- 前端需要从**浏览器**直接访问后端 API
- 如果只启用 Private Networking，前端无法访问后端

## 🔍 架构说明

```
┌─────────────────┐
│  用户浏览器      │
│  (访问 Vercel)   │
└────────┬────────┘
         │
         │ HTTP 请求
         ↓
┌─────────────────┐
│  Vercel 前端     │
│  (React App)    │
└────────┬────────┘
         │
         │ fetch('https://zen-api-production-23e1.up.railway.app/...')
         ↓
┌─────────────────┐
│  Railway 后端    │ ← 必须启用 Public Networking
│  (NestJS API)   │    否则前端无法访问
└─────────────────┘
```

## 📋 Public Networking vs Private Networking

### Public Networking（公共网络）✅ **必须启用**

**用途：**
- 允许从**互联网**访问你的服务
- 前端（Vercel）可以从浏览器调用后端 API
- 任何人都可以通过 URL 访问（但你有 CORS 保护）

**配置：**
- Railway 会自动生成公共域名
- 例如：`zen-api-production-23e1.up.railway.app`
- 可以通过 HTTPS 访问

**安全性：**
- ✅ 有 CORS 配置保护（只允许特定域名访问）
- ✅ 有 SSL/TLS 加密（HTTPS）
- ✅ 可以设置认证（如果需要）

### Private Networking（私有网络）❌ **不需要**

**用途：**
- 只在 Railway **内部网络**中访问
- 服务之间的内部通信
- 例如：`zen-api.railway.internal`

**限制：**
- ❌ 无法从互联网访问
- ❌ 前端无法从浏览器访问
- ❌ 只能从其他 Railway 服务访问

## 🎯 你的项目配置

### 当前架构

```
前端 (Vercel)
  ↓ HTTP 请求
后端 (Railway) ← 必须启用 Public Networking
  ↓ 数据库查询
Supabase (外部)
```

### 配置步骤

1. **启用 Public Networking**
   - Railway 服务 → **Settings** → **Networking**
   - 启用 **Public Networking**
   - Railway 会自动生成公共域名

2. **配置端口**
   - **Target port**: `3000`
   - 这是你的 NestJS 应用监听的端口

3. **获取公共 URL**
   - Railway 会显示公共域名
   - 例如：`https://zen-api-production-23e1.up.railway.app`
   - 这个 URL 需要配置到前端的 `VITE_API_URL`

4. **配置前端环境变量**
   - 在 Vercel 设置 `VITE_API_URL`
   - 值：`https://zen-api-production-23e1.up.railway.app`

## 🔒 安全性考虑

### CORS 保护

你的后端已经配置了 CORS：

```typescript
// src/main.ts
app.enableCors({
  origin: process.env.NODE_ENV === 'production' 
    ? (origin, callback) => {
        // 只允许特定域名访问
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : true, // 开发环境允许所有
});
```

**这意味着：**
- ✅ 只有配置的域名可以访问（如 `guru-drinks-burbon.vercel.app`）
- ✅ 其他域名会被 CORS 阻止
- ✅ 即使 URL 公开，也有保护

### SSL/TLS 加密

- ✅ Railway 自动提供 HTTPS
- ✅ 所有通信都加密
- ✅ 证书自动管理

## 📝 总结

| 选项 | 是否启用 | 原因 |
|------|---------|------|
| **Public Networking** | ✅ **必须** | 前端需要从浏览器访问后端 |
| **Private Networking** | ⚪ 可选 | 只在需要服务间通信时使用 |

## 🚀 下一步

1. ✅ 启用 Public Networking
2. ✅ 确认 Target port 是 `3000`
3. ✅ 获取公共域名（例如：`zen-api-production-23e1.up.railway.app`）
4. ✅ 在 Vercel 设置 `VITE_API_URL` 环境变量
5. ✅ 测试前端可以访问后端 API

## ⚠️ 常见问题

### Q: 启用 Public Networking 安全吗？

**A:** 是的，因为：
- ✅ 有 CORS 保护（只允许特定域名）
- ✅ 有 SSL/TLS 加密
- ✅ 可以添加认证（如果需要）

### Q: 可以同时启用 Public 和 Private Networking 吗？

**A:** 可以，它们不冲突：
- Public: 用于外部访问（前端）
- Private: 用于内部服务通信

### Q: 如果只启用 Private Networking 会怎样？

**A:** 
- ❌ 前端无法访问后端
- ❌ 会收到 404 或连接错误
- ❌ 应用无法正常工作
