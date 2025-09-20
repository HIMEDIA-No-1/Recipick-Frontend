FROM node:22-alpine AS builder

ARG MODULE
ARG NODE_ENV=production
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm@10.15.1

# 패키지 설정 파일 먼저 복사 (캐시 최적화)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 의존성 설치 (별도 레이어로 캐시 최적화)
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY apps/ apps/
COPY libs/ libs/

# 빌드 실행
RUN pnpm --filter ${MODULE} build

FROM nginx:alpine AS production

ARG MODULE

# 필수 패키지 설치
RUN apk --no-cache add gettext dumb-init

# 빌드된 파일 복사
COPY --from=builder /app/apps/${MODULE}/dist /usr/share/nginx/html

# 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# 보안을 위한 nginx 사용자 권한 설정
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# dumb-init으로 시그널 처리 개선
ENTRYPOINT ["dumb-init", "/docker-entrypoint.sh"]