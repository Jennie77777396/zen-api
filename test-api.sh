#!/bin/bash

# 测试后端 API 的脚本
# 使用方法: ./test-api.sh

BASE_URL="http://localhost:3000"

echo "🧪 测试后端 API..."
echo ""

# 测试 1: 获取分类树
echo "1️⃣  测试 GET /categories/tree"
curl -s "$BASE_URL/categories/tree" | jq '.' || echo "❌ 请求失败或 jq 未安装"
echo ""

# 测试 2: 获取所有句子
echo "2️⃣  测试 GET /sentences"
curl -s "$BASE_URL/sentences" | jq '.' || echo "❌ 请求失败或 jq 未安装"
echo ""

echo "✅ 测试完成！"
echo ""
echo "💡 提示: 如果看到错误，请确保："
echo "   1. 后端服务器正在运行 (npm run start:dev)"
echo "   2. 已经运行过 seed (npx prisma db seed)"
echo "   3. DATABASE_URL 环境变量已配置"
