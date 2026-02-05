#!/bin/bash

# 综合测试脚本 - 测试所有 API 功能
# Usage: ./test.sh [section]
#   section: crud, search, all (default: all)

API_URL="${API_URL:-http://localhost:3000}"
SECTION="${1:-all}"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 测试函数
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo -e "${YELLOW}Testing: $description${NC}"
  echo "  $method $endpoint"
  
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      "$API_URL$endpoint")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "  ${GREEN}✓ Success (HTTP $http_code)${NC}"
    echo "  Response: $(echo "$body" | jq -c '.' 2>/dev/null || echo "$body" | head -c 100)"
  else
    echo -e "  ${RED}✗ Failed (HTTP $http_code)${NC}"
    echo "  Response: $body"
  fi
  echo ""
  echo "$body"
}

# 搜索测试函数
test_search() {
  local endpoint=$1
  local query=$2
  local description=$3
  
  echo -e "${YELLOW}Testing: $description${NC}"
  echo "  GET $endpoint?q=$query"
  
  response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint?q=$query")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "  ${GREEN}✓ Success (HTTP $http_code)${NC}"
    echo "  Response: $(echo "$body" | jq -c '.' 2>/dev/null || echo "$body" | head -c 100)"
  else
    echo -e "  ${RED}✗ Failed (HTTP $http_code)${NC}"
    echo "  Response: $body"
  fi
  echo ""
}

# CRUD 测试
test_crud() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}CRUD 测试${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
  
  # 获取分类树
  echo "📋 GET /categories/tree"
  CATEGORY_TREE=$(test_endpoint "GET" "/categories/tree" "" "Get category tree")
  echo ""
  
  # 创建分类
  echo "📝 POST /categories - Create category"
  CATEGORY_RESPONSE=$(test_endpoint "POST" "/categories" '{"name":"Test Category"}' "Create category")
  CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | jq -r '.id' 2>/dev/null)
  echo ""
  
  # 创建句子
  if [ -n "$CATEGORY_ID" ] && [ "$CATEGORY_ID" != "null" ]; then
    echo "📝 POST /sentences - Create sentence"
    SENTENCE_RESPONSE=$(test_endpoint "POST" "/sentences" "{\"content\":\"Test sentence\",\"categoryIds\":[\"$CATEGORY_ID\"]}" "Create sentence")
    SENTENCE_ID=$(echo "$SENTENCE_RESPONSE" | jq -r '.id' 2>/dev/null)
    echo ""
  fi
  
  # 获取句子
  echo "📋 GET /sentences"
  test_endpoint "GET" "/sentences" "" "Get all sentences"
  echo ""
  
  # 错误测试
  echo "❌ POST /sentences - Test error: no categories"
  test_endpoint "POST" "/sentences" '{"content":"This should fail"}' "Create sentence without categories (should fail)"
  echo ""
}

# 搜索测试
test_search_section() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}搜索测试${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
  
  test_search "/search/categories" "Phil" "Search categories"
  test_search "/search/sentences" "test" "Search sentences"
  test_search "/search" "test" "Comprehensive search"
  echo ""
}

# 主测试流程
echo "🧪 Zen API 综合测试"
echo "===================================="
echo "API URL: $API_URL"
echo "测试部分: $SECTION"
echo ""

case "$SECTION" in
  crud)
    test_crud
    ;;
  search)
    test_search_section
    ;;
  all|*)
    test_crud
    test_search_section
    ;;
esac

echo -e "${GREEN}✅ 测试完成！${NC}"
echo ""
