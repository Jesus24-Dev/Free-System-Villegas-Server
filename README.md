# Free-System-Villegas-Server

Backend API for managing combat sports gyms, athletes, coaches, competitions, registrations and payments.

This project provides a modular backend architecture built with NestJS, Prisma ORM and PostgreSQL, focused on managing the operational needs of a combat sports organization.

The system allows coaches and administrators to manage athletes, gyms, competitions, registrations, divisions and payment processes through a REST API.

---

## Features

### Authentication and Authorization

* JWT-based authentication
* Role-based access control
* Protected routes
* Public route decorators

Available roles:

* `ADMIN`
* `COACH`
* `ATHLETE`

---

### Gym Management

* Gym creation and management
* Coach ownership
* Athlete association
* Payment configuration

---

### Athlete Management

* Athlete registration
* Personal information management
* Gym association
* Athlete profiles
* Competition history

---

### Competition Management

* Competition creation
* Competition states:

```
DRAFT
OPEN
CLOSED
FINISHED
```

* Competition divisions
* Athlete registration
* Fighting modes
* Weight categories

---

### Payment Management

* Gym monthly payments
* Mobile payment configuration
* Payment verification workflow

---

### Development Features

* Modular architecture
* DTO validation
* Swagger documentation
* Prisma migrations
* Structured logging
* Exception filters
* Unit testing
* Docker support

---

# Tech Stack

## Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger / OpenAPI

## Infrastructure

* Docker
* Docker Compose
* Neon PostgreSQL (production database)

---

# Project Architecture

The project follows a modular architecture based on NestJS features.

Example:

```
src
│
├── common
│   ├── filters
│   ├── logger
│   └── decorators
│
├── prisma
│
└── features
    │
    ├── auth
    ├── athlete
    ├── coach
    ├── gym
    ├── competition
    ├── competition-registration
    ├── competition-division
    ├── gym-payment
    └── pago-movil
```

Each feature contains its own:

* Controllers
* Services
* DTOs
* Use cases
* Tests

---

# Requirements

Before running the project locally:

* Node.js 22+
* PostgreSQL 15+
* npm

or:

* Docker
* Docker Compose

---

# Environment Variables

Create an environment file:

```
.env
```

Example:

```env
PORT=3004

NODE_ENV=development

DATABASE_URL="postgresql://postgres:password@localhost:5432/kickbox_villegas"

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:3000


SEED_DEV=false
RESET_DB=false


ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
ADMIN_DNI=00000000
ADMIN_NAME=Admin
ADMIN_SURNAME=User
```

---

# Running Locally

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure PostgreSQL

Create a PostgreSQL database:

```
kickbox_villegas
```

Update:

```env
DATABASE_URL
```

---

## 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

---

## 4. Generate Prisma Client

```bash
npm run prisma:generate
```

---

## 5. Seed database

The project contains multiple seeds.

The default seed process executes:

### WAKO Seed

Creates:

* Weight categories
* Base federation data

### Admin Seed

Creates:

* Production administrator account

### Development Seed

Creates:

* Fake development data

To enable development data:

```env
SEED_DEV=true
```

Then run:

```bash
npm run seed
```

---

## Start development server

```bash
npm run start:dev
```

API:

```
http://localhost:3004
```

Swagger:

```
http://localhost:3004/docs
```

---

# Running with Docker

The project includes a multi-stage Docker build.

The image contains:

* Production dependencies
* Prisma generated client
* Compiled NestJS application

---

## Build image

```bash
docker build -t free-system-api .
```

---

## Run container

```bash
docker run \
--env-file .env.production.local \
-p 3004:3004 \
--name free-system-api \
free-system-api
```

---

# Running with Docker Compose

Docker Compose starts:

* PostgreSQL container
* NestJS API container

Start:

```bash
docker compose up
```

The API automatically executes:

```bash
npx prisma migrate deploy
```

before starting.

---

## Services

### API

```
localhost:3004
```

Swagger:

```
localhost:3004/docs
```

### PostgreSQL

```
localhost:5432
```

---

# Production Database (Neon)

The application is compatible with Neon PostgreSQL.

Set:

```env
DATABASE_URL=your_neon_connection_string
```

The same Prisma migrations are used:

```bash
npx prisma migrate deploy
```

---

# Testing

Run tests:

```bash
npm run test
```

The project includes tests for:

* Use cases
* Business rules
* Error handling scenarios

---

# Database Workflow

After modifying Prisma models:

Generate client:

```bash
npm run prisma:generate
```

Create migration:

```bash
npx prisma migrate dev --name migration_name
```

Production migration:

```bash
npx prisma migrate deploy
```

---

# API Documentation

Swagger UI:

```
http://localhost:3004/docs
```

The documentation includes:

* Endpoints
* Request DTOs
* Response DTOs
* Authentication requirements

---

# Production Considerations

Recommended production setup:

* Docker container deployment
* Neon PostgreSQL database
* Environment variables managed by hosting provider
* HTTPS reverse proxy
* CI/CD pipeline

---

# Future Improvements

Potential improvements:

* Complete CI/CD workflow
* Advanced monitoring
* Cloud deployment
* File storage integration
* Notification system
* More extensive automated testing

---

# License

MIT License
