#!/bin/sh

# 환경변수 설정 파일 처리
if [ -f "/usr/share/nginx/html/env.js" ]; then
    echo "🔧 환경변수 파일 처리 중..."
    envsubst < /usr/share/nginx/html/env.js > /tmp/env.js
    mv /tmp/env.js /usr/share/nginx/html/env.js
    echo "✅ 환경변수 설정 완료"
fi

# 런타임 환경변수 처리 (config.js 등)
if [ -f "/usr/share/nginx/html/config.js" ]; then
    echo "🔧 설정 파일 처리 중..."
    envsubst < /usr/share/nginx/html/config.js > /tmp/config.js
    mv /tmp/config.js /usr/share/nginx/html/config.js
    echo "✅ 설정 파일 처리 완료"
fi

# nginx 설정 검사
echo "🔍 nginx 설정 검사 중..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx 설정 검사 통과"
else
    echo "❌ nginx 설정 오류"
    exit 1
fi

# nginx 시작
echo "🚀 nginx 시작 중..."
exec nginx -g 'daemon off;'