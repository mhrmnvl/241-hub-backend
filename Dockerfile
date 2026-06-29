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
# (dummy URL: generate only reads schema, no DB connection made)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    pnpm prisma generate

# Build NestJS
RUN pnpm run build

# Remove 'prepare' script before pruning (prevents husky hook from running)
RUN node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8')); delete p.scripts.prepare; fs.writeFileSync('package.json', JSON.stringify(p))"

# Prune devDependencies — keep only prod deps in node_modules
RUN pnpm prune --prod

# ============================================================
# Stage 2: Runner (production image)
# ============================================================
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package.json for scripts (start:prod, etc.)
COPY package.json ./

# Copy pruned node_modules from builder (no devDeps, no reinstall needed)
COPY --from=builder /app/node_modules ./node_modules

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Copy prisma schema & migrations (needed for migrate deploy at startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Fix ownership — semua file /app harus dimiliki user nestjs
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs \
  && chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

# Jalankan node langsung — hindari corepack download saat startup
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/src/main.js"]
