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

COPY --from=builder /app/apps/${MODULE}/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]