# Supabase + Railway IPv6 连接问题修复指南

## 问题诊断

错误信息：`connect ENETUNREACH 2600:1f13:838:6e0d:b726:130a:4d62:b0d9:5432`

**重要澄清：Railway 的 IPv4/IPv6 支持**

Railway 显示支持 "IPv4 & IPv6"，但这里有一个**关键区别**：

1. **入站连接**（外部 → Railway）：✅ 支持 IPv4 和 IPv6
   - 你的前端可以同时通过 IPv4 和 IPv6 访问 Railway
   - 这就是为什么 Railway 显示支持两者

2. **出站连接**（Railway → 外部服务，如 Supabase）：⚠️ 可能有限制
   - Railway 的某些节点/区域可能不支持 IPv6 **出站连接**
   - 即使入站支持 IPv6，出站到 Supabase 时可能失败

**根本原因：**
- Supabase 的默认连接字符串可能解析为 IPv6 地址
- Railway 的**出站连接**可能不支持 IPv6（即使入站支持）
- 导致 Prisma 无法连接到数据库，返回 500 错误

**为什么 Connection Pooling 能解决？**
- Connection Pooling 使用不同的主机名（`pooler.supabase.com`）
- 这个主机名通常**优先解析为 IPv4 地址**
- 即使 Railway 不支持 IPv6 出站，也能成功连接

## 解决方案（推荐：使用 Connection Pooling）

### 方法 1：使用 Supabase Connection Pooling（推荐）

1. **登录 Supabase 控制台**
   - 进入你的项目

2. **获取 Connection Pooling URI**
   - 进入 **Settings** → **Database**
   - 找到 **Connection string** 部分
   - 选择 **URI** 选项卡
   - **关键步骤**：勾选 **"Use connection pooling"** 或选择 **"Transaction"** 模式
   - 端口会从 `5432` 变成 `6543`
   - 复制这个新的连接字符串

3. **更新 Railway 环境变量**
   - 进入 Railway 项目 → **Variables** 页面
   - 找到 `DATABASE_URL`
   - 替换为新的 Connection Pooling URI（端口 6543）
   - **格式示例**：
     ```
     postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **重要**：不要包含引号，直接粘贴连接字符串

4. **重新部署 Railway**
   - Railway 会自动检测环境变量变化并重新部署
   - 或者手动触发重新部署

### 方法 2：强制使用 IPv4（如果方法 1 不可用）

如果 Supabase 没有提供 Connection Pooling，可以尝试：

1. **在连接字符串中添加参数**
   - 在 Railway 的 `DATABASE_URL` 末尾添加：
     ```
     ?connect_timeout=300&pool_timeout=300
     ```
   - 完整格式：
     ```
     postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres?connect_timeout=300&pool_timeout=300
     ```

2. **使用 Supabase 的直接连接地址**
   - 在 Supabase 控制台的 **Settings** → **Database** 中
   - 查找 **Direct connection** 或 **Session mode** 的连接字符串
   - 确保使用 IPv4 地址（如果 Supabase 提供了的话）

### 方法 3：使用 Prisma 的 directUrl（高级）

如果上述方法都不行，可以配置 Prisma 使用两个连接：

1. **更新 `prisma/schema.prisma`**：
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")      // 用于连接池
     directUrl = env("DIRECT_DATABASE_URL") // 用于迁移（可选）
   }
   ```

2. **在 Railway 添加两个环境变量**：
   - `DATABASE_URL`: Connection Pooling URI（端口 6543）
   - `DIRECT_DATABASE_URL`: 直接连接 URI（端口 5432，仅用于迁移）

## 验证修复

修复后，检查 Railway 日志：

1. **成功的日志应该显示**：
   ```
   Connecting to database...
   Using Supabase: true
   Connection type: Connection Pooling (recommended for Railway)
   Pool config SSL: enabled (rejectUnauthorized: false)
   🚀 Server is running on: http://localhost:3000
   ```

2. **不应该再看到**：
   - `ENETUNREACH`
   - `Error opening a TLS connection`
   - `500 Internal Server Error`（在 API 请求中）

3. **测试 API**：
   - 访问 `https://your-railway-url.up.railway.app/categories/tree`
   - 应该返回 200 状态码和分类数据

## 常见问题

### Q: Vercel 显示 200，但浏览器显示 500？
**A:** 这是正常的。Vercel 的 200 表示前端页面加载成功，但前端请求后端时，后端因为数据库连接失败返回了 500。

### Q: 修改环境变量后需要重新部署吗？
**A:** Railway 会自动检测环境变量变化并重新部署。你也可以手动触发重新部署。

### Q: 本地开发环境也需要修改吗？
**A:** 不需要。本地开发环境通常支持 IPv6，所以可以继续使用原来的连接字符串（端口 5432）。

### Q: Connection Pooling 和直接连接有什么区别？
**A:** 
- **Connection Pooling (6543)**: 通过 PgBouncer 连接池，更适合生产环境，支持更多并发连接
- **直接连接 (5432)**: 直接连接到 PostgreSQL，适合迁移和一次性操作

## 参考链接

- [Supabase Connection Pooling 文档](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma + Supabase 最佳实践](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
