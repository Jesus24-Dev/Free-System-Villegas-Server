import 'dotenv/config';
import {
  PrismaClient,
  Roles,
  Gender,
  States,
  CompetitionStatus,
  FightingMode,
  FightingCategory,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import pino from 'pino';

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

export async function seedDev(prisma: PrismaClient) {
  if (process.env.NODE_ENV === 'production') {
    logger.error(
      {
        context: 'SeedDev',
        env: process.env.NODE_ENV,
      },
      '🛑 CRITICAL WARNING: Intento de ejecutar seedDev en PRODUCCIÓN. Operación abortada.',
    );
    return;
  }

  if (
    process.env.RESET_DB === 'true' &&
    process.env.NODE_ENV === 'development'
  ) {
    logger.warn(
      { context: 'SeedDev' },
      '⚠️ Flag RESET_DB detectado. Limpiando tablas de prueba...',
    );

    try {
      await prisma.gymPayment.deleteMany();
      await prisma.competitionRegistration.deleteMany();
      await prisma.athlete.deleteMany();
      await prisma.pagoMovilFields.deleteMany();
      await prisma.gym.deleteMany();
      await prisma.coach.deleteMany();
      await prisma.user.deleteMany();
      await prisma.person.deleteMany();
      await prisma.competitionDivision.deleteMany();
      await prisma.competition.deleteMany();

      logger.info(
        { context: 'SeedDev' },
        '🧹 Base de datos de prueba limpia con éxito.',
      );
    } catch (error) {
      logger.error(
        { context: 'SeedDev', error },
        '❌ Error al limpiar las tablas de la base de datos.',
      );
      throw error;
    }
  } else {
    logger.info(
      { context: 'SeedDev' },
      'ℹ️ Ejecutando semillas de desarrollo en modo seguro (Sin destrucción de datos).',
    );
  }

  try {
    const password = await bcrypt.hash('123456', 10);

    // ==========================================
    // ADMIN
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '👥 Insertando registros de Administrador...',
    );
    let adminPerson = await prisma.person.findUnique({
      where: { dni: 'V10000000' },
    });
    if (!adminPerson) {
      adminPerson = await prisma.person.create({
        data: {
          dni: 'V10000000',
          name: 'System',
          surname: 'Administrator',
          birthday: new Date('1990-01-01'),
          gender: Gender.MALE,
        },
      });
    }

    await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password,
        role: [Roles.ADMIN],
        person_id: adminPerson.id,
      },
    });

    // ==========================================
    // COACH 1
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '👥 Insertando Entrenadores y Gimnasios...',
    );
    const coachPerson1 = await prisma.person.create({
      data: {
        dni: 'V20000001',
        name: 'Carlos',
        surname: 'Mendoza',
        birthday: new Date('1985-05-12'),
        gender: Gender.MALE,
      },
    });

    await prisma.user.create({
      data: {
        email: 'coach1@test.com',
        password,
        role: [Roles.COACH],
        person_id: coachPerson1.id,
      },
    });

    const coach1 = await prisma.coach.create({
      data: { person_id: coachPerson1.id },
    });

    // ==========================================
    // COACH 2
    // ==========================================
    const coachPerson2 = await prisma.person.create({
      data: {
        dni: 'V20000002',
        name: 'Ana',
        surname: 'Rodriguez',
        birthday: new Date('1987-03-14'),
        gender: Gender.FEMALE,
      },
    });

    await prisma.user.create({
      data: {
        email: 'coach2@test.com',
        password,
        role: [Roles.COACH],
        person_id: coachPerson2.id,
      },
    });

    const coach2 = await prisma.coach.create({
      data: { person_id: coachPerson2.id },
    });

    // ==========================================
    // GYMS
    // ==========================================
    const gym1 = await prisma.gym.create({
      data: {
        name: 'Dragon Fight Team',
        address: 'Caracas',
        state: States.DISTRITO_CAPITAL,
        monthly_payment: 30,
        owner_id: coach1.id,
      },
    });

    const gym2 = await prisma.gym.create({
      data: {
        name: 'Titan Combat Club',
        address: 'Maracay',
        state: States.ARAGUA,
        monthly_payment: 25,
        owner_id: coach2.id,
      },
    });

    await prisma.coach.update({
      where: { id: coach1.id },
      data: { gym_id: gym1.id },
    });

    await prisma.coach.update({
      where: { id: coach2.id },
      data: { gym_id: gym2.id },
    });

    // ==========================================
    // PAGOS MOVILES
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '💳 Insertando campos de Pago Móvil...',
    );
    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym1.id,
        bank_to_pay: '0102 - Banco de Venezuela',
        dni: 'V12345678',
        phone: '04141234567',
      },
    });

    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym1.id,
        bank_to_pay: '0105 - Mercantil',
        dni: 'V12345678',
        phone: '04141234567',
      },
    });

    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym2.id,
        bank_to_pay: '0108 - Provincial',
        dni: 'V12345678',
        phone: '04141234567',
      },
    });

    // ==========================================
    // ATHLETES
    // ==========================================
    logger.info({ context: 'SeedDev' }, '🥊 Creando Atletas de prueba...');
    for (let i = 1; i <= 6; i++) {
      const person = await prisma.person.create({
        data: {
          dni: `V3000000${i}`,
          name: `Athlete`,
          surname: `${i}`,
          birthday: new Date('2000-01-01'),
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        },
      });

      await prisma.user.create({
        data: {
          email: `athlete${i}@test.com`,
          password,
          role: [Roles.ATHLETE],
          person_id: person.id,
        },
      });

      await prisma.athlete.create({
        data: {
          person_id: person.id,
          gym_id: i <= 3 ? gym1.id : gym2.id,
        },
      });
    }

    // ==========================================
    // COMPETITION
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '🏆 Configurando Competencia Nacional...',
    );
    const competition = await prisma.competition.create({
      data: {
        name: 'Copa Nacional WAKO 2026',
        description: 'Competencia de desarrollo',
        location: 'Caracas',
        inscription_begin_at: new Date(),
        inscription_end_at: new Date('2026-12-31'),
        status: CompetitionStatus.OPEN,
      },
    });

    // ==========================================
    // DIVISIONS
    // ==========================================
    const divisionPF69 = await prisma.competitionDivision.create({
      data: {
        competition_id: competition.id,
        mode: FightingMode.POINT_FIGHTING,
        category: FightingCategory.S,
        gender: Gender.MALE,
        weight: 69,
      },
    });

    const divisionKL69 = await prisma.competitionDivision.create({
      data: {
        competition_id: competition.id,
        mode: FightingMode.KICK_LIGHT,
        category: FightingCategory.S,
        gender: Gender.MALE,
        weight: 69,
      },
    });

    const divisionK171 = await prisma.competitionDivision.create({
      data: {
        competition_id: competition.id,
        mode: FightingMode.K1,
        category: FightingCategory.S,
        gender: Gender.MALE,
        weight: 71,
      },
    });

    const divisionLK71 = await prisma.competitionDivision.create({
      data: {
        competition_id: competition.id,
        mode: FightingMode.LOW_KICK,
        category: FightingCategory.S,
        gender: Gender.MALE,
        weight: 71,
      },
    });

    // ==========================================
    // REGISTRATIONS
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '📝 Registrando atletas en divisiones...',
    );
    const athletes = await prisma.athlete.findMany();

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[0].id, division_id: divisionPF69.id },
    });

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[0].id, division_id: divisionKL69.id },
    });

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[1].id, division_id: divisionPF69.id },
    });

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[2].id, division_id: divisionKL69.id },
    });

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[3].id, division_id: divisionK171.id },
    });

    await prisma.competitionRegistration.create({
      data: { athlete_id: athletes[4].id, division_id: divisionLK71.id },
    });

    // ==========================================
    // PAYMENTS
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '💰 Generando historial de pagos ficticios...',
    );
    await prisma.gymPayment.create({
      data: {
        athlete_id: athletes[0].id,
        gym_id: gym1.id,
        amount: 30,
        payment_reference: 'REF-0001',
        day_payed: new Date(),
        isConfirmed: true,
      },
    });

    await prisma.gymPayment.create({
      data: {
        athlete_id: athletes[1].id,
        gym_id: gym1.id,
        amount: 30,
        payment_reference: 'REF-0002',
        day_payed: new Date(),
        isConfirmed: true,
      },
    });

    await prisma.gymPayment.create({
      data: {
        athlete_id: athletes[3].id,
        gym_id: gym2.id,
        amount: 25,
        payment_reference: 'REF-0003',
        day_payed: new Date(),
        isConfirmed: false,
      },
    });

    logger.info({ context: 'SeedDev' }, '✅ Seed dev completed successfully.');
  } catch (error) {
    logger.error(
      { context: 'SeedDev', error },
      '❌ Error crítico inesperado durante la ejecución de seedDev.',
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
