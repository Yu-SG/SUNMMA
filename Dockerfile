# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:24-alpine AS build

WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1

# 项目锁定 yarn@1.22.22，直接装同版本，避免依赖 corepack 是否随 Node 分发
RUN npm i -g yarn@1.22.22

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

# ---------- runtime ----------
FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOST=0.0.0.0 \
    CONTENT_DB_PATH=/app/.data/content.db \
    UPLOAD_DIR=/app/.data/uploads

# Nitro 产物自带依赖，运行时不需要 node_modules
COPY --from=build /app/.output ./.output

# SQLite 与上传图片都写在这里，必须挂载持久卷
RUN mkdir -p /app/.data && chown -R node:node /app/.data
USER node

VOLUME ["/app/.data"]
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
