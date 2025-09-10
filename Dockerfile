FROM node:22-alpine AS builder

ARG APP_NAME
ARG NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm@10.15.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/ apps/
COPY libs/ libs/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter ${APP_NAME} build

FROM nginx:alpine AS production

ARG APP_NAME

COPY --from=builder /app/apps/${APP_NAME}/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]