import { PrismaClient, Gender, Roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

// Inicializamos Pino con el mismo formato limpio para la consola
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

export async function seedAdmin(prisma: PrismaClient) {
  logger.info(
    { context: 'SeedAdmin' },
    '🌱 Iniciando el proceso de seeding del Administrador...',
  );

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const dni = process.env.ADMIN_DNI || '00000000X';
  const name = process.env.ADMIN_NAME || 'Admin';
  const surname = process.env.ADMIN_SURNAME || 'Global';

  if (!email || !password) {
    logger.error(
      { context: 'SeedAdmin' },
      '❌ Error: ADMIN_EMAIL o ADMIN_PASSWORD no están definidos en el archivo .env',
    );
    process.exit(1);
  }

  try {
    // 1. Comprobar si el usuario administrador ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.info(
        { context: 'SeedAdmin', email },
        `ℹ️ El administrador con correo ${email} ya existe. Saltando creación.`,
      );
      return;
    }

    // 2. Comprobar si existe el perfil personal asociado al DNI
    let person = await prisma.person.findUnique({
      where: { dni },
    });

    if (!person) {
      logger.info(
        { context: 'SeedAdmin', dni },
        `👤 Creando perfil personal para el administrador (DNI: ${dni})...`,
      );
      person = await prisma.person.create({
        data: {
          dni,
          name,
          surname,
          birthday: new Date('1990-01-01'),
          gender: Gender.MALE,
          status: true,
        },
      });
    }

    // 3. Hashear la contraseña y crear el usuario vinculado
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    logger.info(
      { context: 'SeedAdmin', email },
      `🔑 Creando credenciales de usuario administrador...`,
    );
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: [Roles.ADMIN],
        person_id: person.id,
      },
    });

    logger.info(
      { context: 'SeedAdmin' },
      '✅ Seeding de administrador completado con éxito.',
    );
  } catch (error) {
    logger.error(
      { context: 'SeedAdmin', error },
      '❌ Error crítico inesperado durante la ejecución de seedAdmin.',
    );
    throw error;
  }
}
