# 多阶段构建：Node 24 + Nitro（node-server 预设）
FROM node:24-alpine AS build

WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Nitro 产物自带依赖，无需再拷贝 node_modules
COPY --from=build /app/.output ./.output

# SQLite 与上传图片都写在这里，务必挂载持久卷
VOLUME ["/app/.data"]
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
