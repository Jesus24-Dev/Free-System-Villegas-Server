# AGENTS.md - AI-Assisted Development Guide

This document provides context for AI agents and contributors working on this codebase.

## Project Overview

**Free System Villegas** is a kickboxing gym management API built with NestJS, Prisma, and PostgreSQL (Neon).

- **Language:** TypeScript (strict mode enabled)
- **Runtime:** Node.js 20+
- **Database:** PostgreSQL 15 via Neon serverless
- **ORM:** Prisma 7.8 with `@prisma/adapter-pg`

## Git Conventions

### Commit Messages (Conventional Commits - English)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring without behavior change
- `perf` - Performance improvement
- `style` - Formatting, semicolons, whitespace
- `test` - Adding or updating tests
- `docs` - Documentation changes
- `chore` - Maintenance tasks (deps, config, etc.)

**Scope** (optional): module name, e.g., `auth`, `gym`, `athlete`, `competition`

**Examples:**
```
feat: add athlete Excel export for competitions
fix: handle null person in profile response
refactor: optimize gym details query with select
perf: reduce global throttle limit to 30 req/min
style: enable strict TypeScript checks
```

### Commit Rules

1. **Always commit after completing a task** - One commit per logical unit
2. **Never commit secrets** - `.env` files are gitignored
3. **Conventional Commits in English** - No Spanish in commit messages
4. **Run `npm run build` before committing** - Ensure no TypeScript errors
5. **Stage only relevant files** - Use `git add <file>` selectively

### Commit Workflow

```bash
# 1. Verify build
npm run build

# 2. Stage changes
git add src/ path/to/file.ts

# 3. Commit with conventional message
git commit -m "feat: add pagination to athlete endpoints"

# 4. Verify
git log --oneline -1
```

## Project Structure

```
src/
├── main.ts                          # Bootstrap, Swagger, CORS, Helmet
├── app.module.ts                    # Root module, Throttler (30 req/60s)
├── prisma/
│   ├── prisma.service.ts            # PrismaClient with lifecycle hooks
│   └── prisma.config.ts             # CLI datasource config
├── common/
│   ├── decorators/                  # @Public()
│   ├── dto/                         # PaginationDto, PaginatedResponseDto
│   ├── filters/                     # PrismaClientExceptionFilter (P2003, P2014)
│   ├── guards/                      # AuthGuard, RolesGuard
│   ├── interfaces/                  # JwtPayload
│   └── logger/                      # LoggerService (Pino)
└── features/
    ├── auth/                        # Register, Login, JWT
    ├── user/                        # User CRUD
    ├── person/                      # Person entity
    ├── coach/                       # Coach profile
    ├── athlete/                     # Athlete profile
    ├── gym/                         # Gym CRUD
    ├── competition/                 # Competition + Excel export
    ├── competition-registration/    # Athlete registration
    ├── competition-division/        # Weight/gender divisions
    ├── gym-payment/                 # Payment tracking
    ├── pago-movil/                  # Manual payment
    ├── admin/                       # Admin operations
    └── weights/                     # Weight categories
```

## Feature Module Convention

Each feature module follows this structure:

```
feature-name/
├── feature-name.module.ts
├── feature-name.controller.ts
├── feature-name.service.ts
├── dto/
│   ├── request/
│   │   ├── create-feature.dto.ts
│   │   ├── update-feature.dto.ts
│   │   └── index.ts
│   └── response/
│       ├── feature-response.dto.ts
│       └── index.ts
└── use-cases/                       # Optional: complex business logic
```

### Naming Conventions

- **Files:** `kebab-case` (e.g., `competition-division.module.ts`)
- **Classes:** `PascalCase` (e.g., `CompetitionDivisionService`)
- **Methods:** `camelCase` (e.g., `findByGymId`)
- **DTOs:** `*-dto.ts` suffix (e.g., `CreateCompetitionDto`)
- **Endpoints:** `kebab-case` (e.g., `/gym-payment/:id`)

## Key Patterns

### 1. Authentication Flow

```
Client → AuthGuard (verify JWT) → RolesGuard (check role) → Controller
```

- JWT payload: `{ sub: userId, email, role }`
- `@Public()` decorator bypasses auth

### 2. Soft Delete Pattern

All entities have `deleted_at DateTime?` field:

```typescript
// Find active records only
await this.prisma.feature.findMany({
  where: { deleted_at: null }
});

// Soft delete
await this.prisma.feature.update({
  where: { id },
  data: { deleted_at: new Date() }
});
```

### 3. Pagination Pattern

```typescript
// DTO
class PaginationDto {
  page?: number;  // default: 1
  limit?: number; // default: 10
}

// Service
async findAll(pagination: PaginationDto) {
  const { skip, limit } = pagination;
  const [data, total] = await Promise.all([
    this.prisma.findMany({ skip, take: limit }),
    this.prisma.count(),
  ]);
  return { data, meta: { total, page, limit, totalPages } };
}
```

### 4. Logger Usage

```typescript
// Structured logging
this.logger.info('EVENT_NAME', { key: value });
this.logger.error('EVENT_FAILED', error, { context });
this.logger.warn('WARNING', { details });
```

### 5. Prisma Query Optimization

Prefer `select` over `include` for performance:

```typescript
// GOOD - select only needed fields
await this.prisma.athlete.findMany({
  select: { id: true, person: { select: { name: true, dni: true } } }
});

// AVOID - includes all fields
await this.prisma.athlete.findMany({
  include: { person: true }
});
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes (default: 3000) |
| `NODE_ENV` | Environment | Yes |
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `JWT_SECRET` | JWT signing key | Yes |
| `JWT_EXPIRES_IN` | Token expiry | Yes |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | Yes |
| `ADMIN_*` | Initial admin credentials | For seeding |

## Available Scripts

```bash
npm run build          # Compile TypeScript
npm run start:dev      # Dev server with watch
npm run start:prod     # Production server
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Deploy migrations
npm run lint           # ESLint + fix
npm test               # Unit tests
npm run test:e2e       # E2E tests
```

## Security Checklist

- [x] Helmet.js for HTTP headers
- [x] CORS whitelist
- [x] Global rate limiting (30 req/60s)
- [x] JWT authentication
- [x] Role-based access control
- [x] Input validation (class-validator)
- [x] UUID validation on route params
- [x] Swagger disabled in production
- [x] Prisma error handling (P2003, P2014)
- [x] No secrets in code (`.env` gitignored)

## Testing

- Unit tests: `src/**/*.spec.ts`
- E2E tests: `test/` directory
- Run: `npm test` or `npm run test:e2e`

## Common Tasks

### Adding a New Feature Module

1. Create directory: `src/features/<name>/`
2. Create module, service, controller
3. Create DTOs (request/response)
4. Register in `app.module.ts`
5. Add Prisma model if needed
6. Run `npx prisma migrate dev --name <name>`
7. Run `npm run prisma:generate`
8. Commit: `feat: add <name> module`

### Adding a New Endpoint

1. Add method to controller with decorators
2. Add DTO for request/response
3. Add Swagger decorators (`@ApiOperation`, `@ApiResponse`)
4. Add validation if needed
5. Run `npm run build`
6. Commit: `feat: add <endpoint> to <module>`

### Modifying Prisma Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>`
3. Run `npm run prisma:generate`
4. Update affected services
5. Run `npm run build`
6. Commit: `feat: add <field> to <model>`
