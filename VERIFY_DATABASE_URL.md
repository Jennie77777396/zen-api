# 验证 DATABASE_URL 配置

## ✅ 已设置的环境变量

从截图看到：
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `3000`
- ✅ `FRONTEND_URL` = `https://guru-drinks-burbon.vercel.app`
- ⚠️ `DATABASE_URL` = `*******` (值被隐藏)

## 🔍 验证 DATABASE_URL

由于 `DATABASE_URL` 的值被隐藏，需要确认它是否正确：

### 方法 1：点击 DATABASE_URL 查看/编辑

1. 在 Railway Variables 页面
2. 点击 `DATABASE_URL` 行
3. 查看实际值，确认：
   - ✅ 端口是 `6543`（不是 `5432`）
   - ✅ 主机名包含 `pooler`（如 `pooler.supabase.com`）
   - ✅ 格式：`postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[POOLER-HOST]:6543/postgres`

### 方法 2：使用 Raw Editor 查看

1. 点击右上角的 **"Raw Editor"** 按钮
2. 查看 `DATABASE_URL` 的完整值
3. 确认格式正确

### 方法 3：检查部署日志

部署后，查看 Railway 日志，应该看到：

**✅ 正确的日志：**
```
========================================
🔍 DATABASE CONNECTION DEBUG INFO
========================================
Connecting to database...
Using Supabase: true
Connection type: ✅ Connection Pooling (recommended for Railway)
Port: 6543 ✅
Host: aws-0-us-west-2.pooler.supabase.com ✅
Full connection string: postgresql://postgres.dxueonvaxzhvnebekdbu:****@aws-0-us-west-2.pooler.supabase.com:6543/postgres
========================================
```

**❌ 错误的日志（如果还在用旧配置）：**
```
Connection type: ❌ Direct connection (may fail on Railway)
Port: 5432 ❌ (should be 6543)
Host: db.xxxx.supabase.co ❌ (should contain pooler)
```

## 📋 正确的 DATABASE_URL 格式

### ✅ 正确格式（Connection Pooling）

```
postgresql://postgres.dxueonvaxzhvnebekdbu:YOUR_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**关键点：**
- ✅ 端口：`:6543`
- ✅ 主机：`pooler.supabase.com` 或包含 `pooler`
- ✅ 用户名：`postgres.[PROJECT-REF]`

### ❌ 错误格式（Direct Connection）

```
postgresql://postgres:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres
```

**问题：**
- ❌ 端口：`:5432`（会尝试 IPv6，可能失败）
- ❌ 主机：`db.xxxx.supabase.co`（可能解析为 IPv6）
- ❌ 用户名：`postgres`（不是 Connection Pooling 格式）

## 🚀 下一步操作

### 1. 如果 DATABASE_URL 正确（端口 6543）

1. **触发重新部署**
   - Railway → **Deployments**
   - 点击 **"Redeploy"** 按钮
   - 等待 1-2 分钟

2. **检查日志**
   - 查看部署日志
   - 确认看到 "Connection Pooling" 和端口 6543

3. **测试 API**
   ```bash
   curl https://zen-api-production-23e1.up.railway.app/categories/tree
   ```
   - 应该返回 200 状态码和 JSON 数据

### 2. 如果 DATABASE_URL 不正确（端口 5432）

1. **获取正确的 Connection Pooling URI**
   - Supabase Dashboard → Settings → Database
   - Connection string → URI
   - **勾选 "Use connection pooling"**
   - 复制新的连接字符串（端口 6543）

2. **更新 Railway Variables**
   - 点击 `DATABASE_URL` 行
   - 编辑值
   - 粘贴新的 Connection Pooling URI
   - 保存

3. **重新部署**
   - Railway 会自动检测变化并重新部署
   - 或手动触发重新部署

## 🎯 快速检查清单

- [ ] `DATABASE_URL` 端口是 `6543`（不是 `5432`）
- [ ] `DATABASE_URL` 主机名包含 `pooler`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `FRONTEND_URL` = 你的 Vercel 域名
- [ ] 已经触发重新部署
- [ ] 部署日志显示 "Connection Pooling" 和端口 6543

## 💡 提示

如果 `DATABASE_URL` 的值被隐藏，你可以：
1. 点击 `DATABASE_URL` 行查看/编辑
2. 使用 Raw Editor 查看完整值
3. 检查部署日志确认实际使用的连接字符串
