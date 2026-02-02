#!/usr/bin/env bash

BASE_URL="http://localhost:3000"

echo "RESET POSTS"
curl -s -w "\nStatus: %{http_code}\n\n" -X POST $BASE_URL/reset

echo "CREATE POST (valid)"
curl -s -w "\nStatus: %{http_code}\n\n" -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'

echo "CREATE POST (missing data, error)"
curl -s -w "\nStatus: %{http_code}\n\n" -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{}'

echo "LIST ALL POSTS"
curl -s -w "\nStatus: %{http_code}\n\n" -X GET $BASE_URL/posts

echo "READ POST (exists)"
curl -s -w "\nStatus: %{http_code}\n\n" -X GET $BASE_URL/posts/1

echo "READ POST (not found)"
curl -s -w "\nStatus: %{http_code}\n\n" -X GET $BASE_URL/posts/999

echo "UPDATE POST (valid)"
curl -s -w "\nStatus: %{http_code}\n\n" -X PUT $BASE_URL/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

echo "UPDATE POST (empty title & content)"
curl -s -w "\nStatus: %{http_code}\n\n" -X PUT $BASE_URL/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"","content":""}'

echo "UPDATE POST (not found)"
curl -s -w "\nStatus: %{http_code}\n\n" -X PUT $BASE_URL/posts/999 \
  -H "Content-Type: application/json" \
  -d '{"title":"X"}'

echo "DELETE POST (valid)"
curl -s -w "\nStatus: %{http_code}\n\n" -X DELETE $BASE_URL/posts/1

echo "DELETE POST (not found)"
curl -s -w "\nStatus: %{http_code}\n\n" -X DELETE $BASE_URL/posts/999

echo "LIST ALL POSTS (after deletion)"
curl -s -w "\nStatus: %{http_code}\n\n" -X GET $BASE_URL/posts
