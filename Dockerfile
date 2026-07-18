# ==========================================
# ETAPA 1: Dependencias de desarrollo
# ==========================================
FROM node:22-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

RUN npm run prisma:generate

# ==========================================
# ETAPA 2: Construcción de la App (Build)
# ==========================================

FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma
COPY . .

RUN npm run build

RUN rm -rf node_modules
RUN npm ci --only=production
RUN npm run prisma:generate

# ==========================================
# ETAPA 3: Imagen de Ejecución (Producción)
# ==========================================

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=${PORT:-3000}

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=dependencies /app/prisma.config.ts ./prisma.config.ts

EXPOSE ${PORT:-3000}
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]