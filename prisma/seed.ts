import * as dotenv from 'dotenv';
import { seedWako } from './seed-wako';
import { seedAdmin } from './seed-admin';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  },
});

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  logger.info(
    { context: 'SeedMain' },
    '🌱 Starting database seeding process...',
  );

  // Ejecutamos la semilla base de la federación/organización
  await seedWako(prisma);

  // Ejecutamos las semillas de desarrollo si el flag está activo
  if (process.env.SEED_DEV === 'true') {
    logger.warn(
      { context: 'SeedMain' },
      '⚠️ SEED_DEV detectado como TRUE. Cargando entorno de desarrollo...',
    );

    // Importación dinámica para desarrollo
    const { seedDev } = await import('./seed-dev.js');
    await seedDev(prisma);
  }

  // Ejecutamos la semilla del administrador global
  await seedAdmin(prisma);

  logger.info({ context: 'SeedMain' }, '✅ All seeds completed successfully.');
}

main()
  .catch((error) => {
    logger.error(
      { context: 'SeedMain', error },
      '❌ Error crítico e inesperado durante el proceso de seeding general.',
    );
    process.exit(1);
  })
  .finally(async () => {
    logger.info({ context: 'SeedMain' }, '🔌 Disconnecting Prisma client...');
    await prisma.$disconnect();
  });
