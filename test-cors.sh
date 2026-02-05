#!/bin/bash

# CORS 测试脚本
# 使用方法: ./test-cors.sh [API_URL]

API_URL="${1:-http://localhost:3000}"
FRONTEND_ORIGIN="${2:-http://localhost:5173}"

echo "🧪 测试 CORS 配置..."
echo "API URL: $API_URL"
echo "Frontend Origin: $FRONTEND_ORIGIN"
echo ""

# 测试 OPTIONS 预检请求
echo "1️⃣  测试 OPTIONS 预检请求 (Preflight)"
curl -X OPTIONS "$API_URL/sentences" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"

echo ""
echo ""

# 测试实际 GET 请求
echo "2️⃣  测试 GET 请求（带 Origin 头）"
curl -X GET "$API_URL/sentences" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Content-Type: application/json" \
  -v 2>&1 | grep -i "access-control"

echo ""
echo ""

# 测试 POST 请求
echo "3️⃣  测试 POST 请求（带 Origin 头）"
curl -X POST "$API_URL/categories" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category"}' \
  -v 2>&1 | grep -i "access-control"

echo ""
echo ""
echo "✅ CORS 测试完成！"
echo ""
echo "💡 如果看到 'access-control-allow-origin' 响应头，说明 CORS 配置正确"
