FROM node:22-alpine AS builder

ARG MODULE
ARG NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm@10.15.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/ apps/
COPY libs/ libs/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter ${MODULE} build

FROM nginx:alpine AS production

ARG MODULE

RUN apk add --no-cache gettext

COPY --from=builder /app/apps/${MODULE}/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]