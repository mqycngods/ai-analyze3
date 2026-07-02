# 构建阶段
FROM registry.openanolis.cn/openanolis/node:20-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN yarn build

# 生产运行阶段
FROM registry.openanolis.cn/openanolis/node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["yarn", "start"]
