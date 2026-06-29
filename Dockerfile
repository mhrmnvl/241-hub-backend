# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:22-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lockfile & manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Install ALL deps (including devDeps needed to build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm run build

# ============================================================
# Stage 2: Runner (production image)
# ============================================================
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifests for prod install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Copy prisma schema & migrations (needed for migrate deploy at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000

# Run migrations then start app
CMD ["pnpm", "run", "start:prod"]
