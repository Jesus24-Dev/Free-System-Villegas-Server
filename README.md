# Free System Villegas - Kickboxing Gym Management API

Backend RESTful API for managing a kickboxing gym's operations, built with NestJS, Prisma, and PostgreSQL. Deployed on Neon (serverless PostgreSQL).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 11 |
| ORM | Prisma 7.8 |
| Database | PostgreSQL 15 (Neon) |
| Authentication | JWT (access tokens) |
| Validation | class-validator + class-transformer |
| Logging | Pino (nestjs-pino) |
| Documentation | Swagger/OpenAPI |
| Container | Docker multi-stage build |

## Project Structure

```
src/
├── main.ts                          # Bootstrap, CORS, Helmet, Swagger
├── app.module.ts                    # Root module, Throttler config
├── prisma/
│   ├── prisma.service.ts            # PrismaClient with lifecycle hooks
│   └── prisma.config.ts             # CLI datasource config
├── common/
│   ├── decorators/                  # @Public() decorator
│   ├── dto/                         # PaginationDto, PaginatedResponseDto
│   ├── filters/                     # PrismaClientExceptionFilter (P2003, P2014)
│   ├── guards/                      # AuthGuard, RolesGuard
│   ├── interfaces/                  # JwtPayload interface
│   └── logger/                      # Custom LoggerService (Pino)
└── features/
    ├── auth/                        # Register, Login, JWT
    ├── user/                        # User CRUD (soft delete)
    ├── person/                      # Person entity (soft delete)
    ├── coach/                       # Coach profile (1:1 with gym)
    ├── athlete/                     # Athlete profile (1:1 with gym)
    ├── gym/                         # Gym CRUD (coach-owned)
    ├── competition/                 # Competition CRUD + Excel export
    ├── competition-registration/    # Athlete registration per competition
    ├── competition-division/        # Weight/gender divisions
    ├── gym-payment/                 # Gym payment tracking
    ├── pago-movil/                  # Manual payment registration
    ├── admin/                       # Admin-only operations
    └── weights/                     # Fighting weight categories
```

## Features

### Authentication & Authorization
- JWT-based authentication (access tokens)
- Role-based access control (ADMIN, COACH, ATHLETE)
- `@Public()` decorator for unprotected routes
- API key authentication for Swagger UI (non-production only)

### Security
- Helmet.js for HTTP security headers
- CORS configuration (whitelist via `CORS_ORIGIN`)
- Global rate limiting: 30 requests/60 seconds
- `noImplicitAny: true`, `strictBindCallApply: true` in TypeScript
- Swagger disabled in production

### Data Integrity
- Soft delete on all entities (`deleted_at` field)
- Foreign key cascade on related entities
- Prisma indexes on frequently queried columns
- PrismaClientExceptionFilter for P2003/P2014 errors

### Pagination
- `page` and `limit` query parameters on all list endpoints
- `PaginatedResponseDto<T>` generic wrapper
- Consistent response format across all services

### Excel Export
- `GET /competition/:competitionId/export/:gymId`
- Returns `.xlsx` with athlete data for a gym in a competition

### Validation
- DNI format: `^[VEve]\d{6,9}$` (Venezuelan national ID)
- Password: min 8 chars, uppercase, number, special character
- UUID validation on all route params via `ParseUUIDPipe`

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or Neon account)
- Docker & Docker Compose (optional)

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed development data
npx prisma db seed

# Start dev server
npm run start:dev
```

### Docker

```bash
# Build and start all services
docker-compose up -d

# Run migrations inside container
docker exec kickbox_api_server npx prisma migrate deploy
```

### Production

```bash
npm run build
npm run start:prod
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run start` | Start server |
| `npm run start:dev` | Start with file watching |
| `npm run start:prod` | Start compiled server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Deploy migrations |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npx prisma db seed` | Seed database |

## API Documentation

Swagger UI is available at `/docs` in non-production environments.

Requires `X-API-KEY` header for access.

## Database

### Entities

- **User** - Authentication credentials
- **Person** - Personal data (name, surname, DNI)
- **Coach** - Coach profile (linked to Person)
- **Athlete** - Athlete profile (linked to Person)
- **Gym** - Gym details (owned by Coach)
- **Competition** - Competition events
- **CompetitionDivision** - Weight/gender divisions per competition
- **CompetitionRegistration** - Athlete registrations
- **GymPayment** - Gym payment records
- **PagoMovilFields** - Manual payment data

### Migrations

```bash
# Create migration
npx prisma migrate dev --name <migration_name>

# Deploy to production
npm run prisma:migrate
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) in English:

```
feat: add new feature
fix: bug fix
refactor: code restructuring
perf: performance improvement
style: formatting, missing semi-colons, etc
docs: documentation changes
test: adding missing tests
chore: maintenance tasks
```

## License

UNLICENSED
