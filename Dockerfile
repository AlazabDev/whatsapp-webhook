FROM node:20-alpine AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=deps /app/.next/standalone ./
COPY --from=deps /app/.next/static ./.next/static
COPY --from=deps /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
