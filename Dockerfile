# =====================
# BUILD STAGE
# =====================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build



# =====================
# PRODUCTION STAGE
# =====================

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


COPY --from=builder /app/dist ./dist

# Copiar Prisma generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000


CMD ["node", "dist/src/main.js"]