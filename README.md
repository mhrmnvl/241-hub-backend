<div align="center">

# SIAKAD Backend

**Sistem Informasi Akademik — REST API**

Built with **NestJS 11** · **Prisma 7** · **PostgreSQL** · **TypeScript 5**

[![CI](https://github.com/mhrmnvl/siakad-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/mhrmnvl/siakad-backend/actions)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)](https://postgresql.org)

</div>

---

## Overview

SIAKAD is a **School Academic Information System** backend API designed for Islamic Junior High Schools (MTs). It manages the complete academic lifecycle including:

- Multi-role user management (Admin, Employee/Teacher, Student) with RBAC
- Institution & academic year / curriculum management
- Curriculum–subject mapping and teaching assignments
- Class management, student enrollment, and class supervisors (wali kelas)
- Schedule management with time slots
- Assessment items, student scores, and report card (rapor) generation
- Attendance recording
- Student–parent relationship management
- Events, announcements, achievements, scholarships, and educational history

---

## Tech Stack

| Layer      | Technology                                                         |
| ---------- | ------------------------------------------------------------------ |
| Framework  | [NestJS 11](https://nestjs.com)                                    |
| Language   | TypeScript 5 with ESM                                              |
| ORM        | [Prisma 7](https://prisma.io) + `@prisma/adapter-pg`               |
| Database   | PostgreSQL 14+                                                     |
| Auth       | JWT (access + refresh token rotation) via `@nestjs/jwt` + Passport |
| Validation | `class-validator` + `class-transformer` + Zod (env)                |
| Security   | Helmet, CORS whitelist, `@nestjs/throttler` (rate limiting)        |
| Health     | `@nestjs/terminus` (`/health` endpoint)                            |
| Logging    | Pino + `nestjs-pino` (structured JSON, auto request context)       |
| API Docs   | Swagger / OpenAPI (`@nestjs/swagger`)                              |
| Testing    | Jest (unit + e2e)                                                  |
| CI/CD      | GitHub Actions (lint → type-check → test → build)                  |

---

## Architecture

```
src/
├── core/
│   ├── config/         # Zod-validated environment schema
│   ├── database/       # PrismaService with lifecycle hooks
│   ├── decorators/     # @CurrentUser, @Roles
│   ├── filters/        # Global HTTP exception filter
│   ├── guards/         # JwtAuthGuard, RolesGuard
│   ├── health/         # /health endpoint (DB + memory + disk)
│   ├── interceptors/   # Response envelope + ClassSerializer
│   └── logger/         # Pino logger config
├── features/           # One folder per domain module
│   └── [module]/
│       ├── controllers/
│       ├── use-cases/
│       ├── repositories/
│       └── dto/
├── shared/             # Pagination DTO, shared utilities
├── types/              # Global type definitions
├── app.module.ts
└── main.ts
```

### Request Lifecycle

```
Request → PinoLogger → ThrottlerGuard → JwtAuthGuard → RolesGuard
        → ValidationPipe → Controller → UseCase → Repository → Prisma
        → ResponseInterceptor → Response
        → HttpExceptionFilter (on error)
```

---

## API Modules

| Module                | Route prefix                        | Description                                  |
| --------------------- | ----------------------------------- | -------------------------------------------- |
| Auth                  | `/auth`                             | Login, logout, token refresh, profile (`/me`) |
| Dashboard             | `/dashboard`                        | Summary statistics                           |
| Users                 | `/users`                            | User account CRUD                            |
| Profile               | `/profiles`                         | Profile, addresses, social media links       |
| Employee              | `/employees`                        | Employee CRUD, addresses, position links     |
| Student               | `/students`                         | Student CRUD, addresses, parent links        |
| Parent                | `/parents`                          | Parent CRUD                                  |
| Student-Parent        | `/student-parents`                  | Link students to parents                     |
| Institution           | `/institutions`                     | Institution profile, address, social media   |
| Academic Year         | `/academic-years`                   | Yearly academic terms                        |
| Semester              | `/semesters`                        | Semesters with rollover support              |
| Curriculum            | `/curricula`                        | Curriculum definitions                       |
| Curriculum Subject    | `/curriculum-subjects`              | Subject–curriculum mapping                   |
| Subject               | `/subjects`                         | Course subjects                              |
| Class                 | `/classes`                          | Classes per grade level                      |
| Class Supervisor      | `/class-supervisors`                | Wali kelas per class per semester            |
| Student Enrollment    | `/student-enrollments`              | Student–class enrollment (single + bulk)     |
| Teaching Assignment   | `/teaching-assignments`             | Teacher–subject–class assignments            |
| Schedule              | `/schedules`                        | Class schedules per day                      |
| Time Slot             | `/time-slots`                       | Reusable time slot definitions               |
| Assessment Item       | `/assessment-items`                 | Assessment definitions (UTS, UAS, etc.)      |
| Student Score         | `/student-scores`                   | Student score entries                        |
| Attendance            | `/attendances`                      | Attendance recording                         |
| Rapor                 | `/rapors`                           | Report card generation & publishing          |
| Academic Calendar     | `/academic-calendars`               | Calendar events per academic year            |
| Achievement           | `/achievements`                     | Student achievements                         |
| Scholarship           | `/scholarships`                     | Scholarship records                          |
| Educational History   | `/educational-histories`            | Student education history                    |
| Event                 | `/events`                           | School events                                |
| Announcement          | `/announcements`                    | School announcements                         |
| Education             | `/educations`                       | Education levels (lookup table)              |
| Position              | `/positions`                        | Staff positions                              |
| Occupation            | `/occupations`                      | Parent occupations                           |
| Platform              | `/platforms`                        | Social media platforms                       |
| Health                | `/health`                           | Liveness + readiness probe                   |

---

## Prerequisites

| Tool       | Version |
| ---------- | ------- |
| Node.js    | >= 22   |
| pnpm       | >= 10   |
| PostgreSQL | >= 14   |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mhrmnvl/siakad-backend.git
cd siakad-backend
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` — at minimum set:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/siakad_db
JWT_SECRET=your-strong-random-secret-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 4. Start

```bash
pnpm start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

---

## Environment Variables

All variables are validated at startup with **Zod** — the app refuses to start if required vars are missing or malformed.

| Variable                 | Required | Default                 | Description                                 |
| ------------------------ | -------- | ----------------------- | ------------------------------------------- |
| `DATABASE_URL`           | yes      | —                       | PostgreSQL connection string (pooler URL)   |
| `DIRECT_URL`             | —        | —                       | Direct connection for migrations & seeding  |
| `NODE_ENV`               | —        | `development`           | `development` \| `production` \| `test`     |
| `PORT`                   | —        | `3000`                  | HTTP listening port                         |
| `TRUST_PROXY`            | —        | `0`                     | Set to `1` behind reverse proxy (nginx/ALB) |
| `JWT_SECRET`             | yes      | —                       | Min 16 chars (32+ in production)            |
| `JWT_ACCESS_EXPIRATION`  | —        | `15m`                   | Access token TTL (e.g. `15m`, `1h`)         |
| `JWT_REFRESH_EXPIRATION` | —        | `7d`                    | Refresh token TTL                           |
| `BCRYPT_SALT_ROUNDS`     | —        | `10`                    | bcrypt hashing cost factor                  |
| `FRONTEND_URL`           | —        | `http://localhost:5173` | CORS allowed origin                         |
| `THROTTLE_TTL`           | —        | `60000`                 | Rate limit window (ms)                      |
| `THROTTLE_LIMIT`         | —        | `100`                   | Max requests per window                     |
| `AUTH_THROTTLE_TTL`      | —        | `60000`                 | Auth-specific rate limit window (ms)        |
| `AUTH_THROTTLE_LIMIT`    | —        | `10`                    | Max auth requests per window                |

> See `.env.example` for the complete seed configuration reference.

---

## Database & Seeding

### Migrations

```bash
# Development
pnpm prisma:migrate

# Production (safe, no schema changes)
pnpm prisma:deploy
```

### Seeding

The seeder is **fully modular** — one file per module under `prisma/seeds/modules/`.

```bash
pnpm prisma:seed
```

All seed data is configurable via `.env`:

```env
SEED_PLATFORMS=Instagram,Facebook,YouTube
SEED_POSITIONS=Kepala Sekolah:MANAGEMENT,Guru:ACADEMIC

SEED_CURRICULUM_NAME=Merdeka
SEED_ACADEMIC_YEAR_NAME=2024/2025
SEED_CLASSES=VII-A:7,VII-B:7,VIII-A:8

SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=admin123

SEED_EMPLOYEE_COUNT=1
SEED_EMPLOYEE_1_USERNAME=guru
SEED_EMPLOYEE_1_NAME=Budi Santoso
SEED_EMPLOYEE_1_SUBJECTS=Matematika,IPA

SEED_STUDENT_COUNT=1
SEED_STUDENT_1_USERNAME=siswa
SEED_STUDENT_1_NIS=245001
SEED_STUDENT_1_CLASS=VII-A
```

---

## Testing

```
Test Suites: 229 passed, 229 total
Tests:       1146 passed, 1146 total
```

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `pnpm test`        | Unit tests (Jest)               |
| `pnpm test:cov`    | Unit tests + coverage report    |
| `pnpm test:ci`     | CI mode (sequential + coverage) |
| `pnpm test:e2e`    | End-to-end tests (Supertest)    |

---

## Code Quality

### Dual-Layer ESLint

| Config | Purpose | Speed |
| --- | --- | --- |
| `eslint.config.mjs` | Daily development (`recommended` + `stylistic`) | ⚡ Fast |
| `eslint.typecheck.config.mjs` | CI/pre-push (`recommendedTypeChecked` + `stylisticTypeChecked`) | 🔒 Strict |

### Git Hooks (Husky + lint-staged)

| Hook | Trigger | What runs |
| --- | --- | --- |
| `pre-commit` | Every commit | `lint-staged` → ESLint --fix + Prettier (staged files only) |
| `pre-push` | Every push | `tsc --noEmit` + full test suite |

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm lint` | Fast lint (no type-checking) |
| `pnpm lint:fix` | Fast lint + auto-fix |
| `pnpm lint:strict` | Strict lint with type-checking |
| `pnpm typecheck` | TypeScript compiler check |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |

---

## CI/CD

GitHub Actions pipeline runs on every push/PR to `main` and `develop`:

```
pnpm install → Prisma Generate → Lint → Format Check → Type Check → Unit Tests → Build → Security Audit
```

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for full configuration.

---

## API Documentation

Swagger UI is available in **non-production** environments:

```
http://localhost:<PORT>/api
```

- Bearer auth support (persistent across refreshes)
- All endpoints documented with request/response schemas
- Automatically hidden in `NODE_ENV=production`

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── prisma.config.ts     # Prisma config (migrations, seeds)
│   ├── seed.ts              # Seed orchestrator
│   ├── migrations/          # Migration history
│   └── seeds/modules/       # One seed file per module
├── src/
│   ├── core/                # Infrastructure (guards, filters, logger, health)
│   ├── features/            # Domain modules (use-case architecture)
│   │   └── [module]/
│   │       ├── controllers/   # REST endpoints
│   │       ├── use-cases/     # Business logic (1 class = 1 action)
│   │       ├── repositories/  # Prisma data access
│   │       └── dto/           # Request validation
│   ├── shared/              # Pagination DTO, shared utilities
│   ├── types/               # Global type definitions
│   ├── app.module.ts
│   └── main.ts
├── test/                    # E2E test files
├── .husky/                  # Git hooks (pre-commit, pre-push)
├── .github/workflows/       # CI pipeline
├── eslint.config.mjs        # Fast ESLint (daily dev)
├── eslint.typecheck.config.mjs # Strict ESLint (CI/pre-push)
├── lint-staged.config.cjs   # lint-staged configuration
├── .env.example
└── package.json
```

---

## Production Deployment

### Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong `JWT_SECRET` (>= 32 chars, generated randomly)
- [ ] Set `FRONTEND_URL` to exact production frontend origin
- [ ] Set `TRUST_PROXY=1` if behind nginx / load balancer
- [ ] Run migrations before starting the app
- [ ] Do **not** use default seed credentials

### Build & Start

```bash
pnpm build
pnpm start:prod
```

### Health Check

```
GET /health
```

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "disk_storage": { "status": "up" }
  }
}
```

---

## Security

| Feature         | Implementation                                                        |
| --------------- | --------------------------------------------------------------------- |
| HTTP headers    | `helmet` (strict CSP in production)                                   |
| CORS            | Whitelist-only, no wildcards in production                            |
| Rate limiting   | `@nestjs/throttler` global (100 req/min), strict on `/auth` endpoints |
| Auth            | JWT access tokens (15m) + refresh tokens (7d)                         |
| Passwords       | `bcrypt` (10 rounds)                                                  |
| Env validation  | Zod schema — app fails to start on misconfiguration                   |
| Request logging | Pino structured JSON with auto request context                        |
| RBAC            | Role-based access control (Admin, Employee, Student)                  |

---

## License

UNLICENSED — private project.
