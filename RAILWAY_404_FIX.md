# Railway 404 "Application not found" 错误修复

## 🔍 问题诊断

错误信息：
```json
{"status":"error","code":404,"message":"Application not found","request_id":"..."}
```

**可能的原因：**
1. ❌ 应用被删除或未部署
2. ❌ 应用还在部署中（未完成）
3. ❌ 应用启动失败
4. ❌ 域名配置问题

## ✅ 解决步骤

### 步骤 1：检查 Railway 部署状态

1. **登录 Railway**
   - https://railway.app
   - 进入你的项目

2. **检查 Deployments**
   - 点击 **Deployments** 标签页
   - 查看最新的部署状态

   **状态说明：**
   - ✅ **Active** = 部署成功，应用正在运行
   - ⏳ **Building** = 正在构建中
   - ⏳ **Deploying** = 正在部署中
   - ❌ **Failed** = 部署失败
   - ❌ **No deployments** = 没有部署

### 步骤 2：检查应用是否正在运行

1. **查看部署日志**
   - 点击最新的部署
   - 查看 **Logs** 标签页

2. **成功的日志应该显示：**
   ```
   🔍 DATABASE CONNECTION DEBUG INFO
   Connection type: ✅ Connection Pooling (recommended for Railway)
   Port: 6543 ✅
   🚀 Server is running on: http://localhost:3000
   ```

3. **如果看到错误：**
   - 检查错误信息
   - 确认环境变量是否正确设置
   - 确认数据库连接是否成功

### 步骤 3：如果应用被删除，重新部署

1. **检查服务是否存在**
   - Railway 项目 → **Services**
   - 确认 `zen-api` 服务是否存在

2. **如果服务不存在，创建新服务：**
   - 点击 **"New"** → **"GitHub Repo"**
   - 选择你的仓库
   - 选择 `zen-api` 目录
   - Railway 会自动检测 Dockerfile 并开始部署

3. **如果服务存在但未部署：**
   - 点击服务
   - 点击 **"Deploy"** 或 **"Redeploy"** 按钮

### 步骤 4：检查域名配置

1. **检查 Public Networking**
   - Railway 项目 → **Settings** → **Networking**
   - 确认 **Public Networking** 已启用
   - 确认域名是 `zen-api-production-23e1.up.railway.app`

2. **检查端口配置**
   - Railway 服务 → **Settings** → **Networking**
   - 确认 **Target port** 是 `3000`

### 步骤 5：验证部署

1. **等待部署完成**
   - 通常需要 2-5 分钟
   - 查看部署日志确认成功

2. **测试 API**
   ```bash
   curl https://zen-api-production-23e1.up.railway.app/categories/tree
   ```
   - 应该返回 200 状态码和 JSON 数据
   - 不应该返回 404 错误

## 🚨 常见问题

### Q1: 部署状态显示 "Failed"

**A:** 检查部署日志：
- 查看错误信息
- 确认 Dockerfile 是否正确
- 确认环境变量是否正确设置
- 确认数据库连接字符串格式

### Q2: 部署状态显示 "Building" 很久

**A:** 这是正常的：
- 首次部署可能需要 5-10 分钟
- 后续部署通常需要 2-5 分钟
- 耐心等待，查看日志确认进度

### Q3: 应用启动后立即停止

**A:** 可能的原因：
- 环境变量未设置或格式错误
- 数据库连接失败
- 应用代码错误

**解决方法：**
- 检查 Railway 日志
- 确认所有环境变量已设置
- 确认 `DATABASE_URL` 使用 Connection Pooling（端口 6543）

### Q4: 域名无法访问

**A:** 检查：
- Railway → Settings → Networking
- 确认 Public Networking 已启用
- 确认域名正确
- 等待 DNS 传播（可能需要几分钟）

## 📋 快速检查清单

- [ ] Railway 服务存在且已部署
- [ ] 部署状态是 "Active"（不是 "Building" 或 "Failed"）
- [ ] 部署日志显示 "Server is running on: http://localhost:3000"
- [ ] Public Networking 已启用
- [ ] Target port 是 3000
- [ ] 所有环境变量已设置（DATABASE_URL, NODE_ENV, PORT, FRONTEND_URL）
- [ ] DATABASE_URL 使用 Connection Pooling（端口 6543）
- [ ] 等待部署完成（2-5 分钟）
- [ ] API 测试返回 200（不是 404）

## 🎯 下一步

1. **检查 Railway 部署状态**
2. **查看部署日志**
3. **如果应用不存在，重新部署**
4. **如果应用存在但未运行，触发重新部署**
5. **验证 API 可以访问**
