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
import { faker } from '@faker-js/faker';
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

const VENEZUELAN_DNI = () =>
  `V${faker.number.int({ min: 10000000, max: 30000000 })}`;

export async function seedDev(prisma: PrismaClient) {
  if (process.env.NODE_ENV === 'production') {
    logger.error(
      { context: 'SeedDev', env: process.env.NODE_ENV },
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
    const password = await bcrypt.hash('12345678', 10);

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
    // COACHES
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '👥 Insertando Entrenadores y Gimnasios...',
    );

    const createCoach = async (
      email: string,
      dni: string,
      name: string,
      surname: string,
      gender: Gender,
    ) => {
      const person = await prisma.person.create({
        data: {
          dni,
          name,
          surname,
          birthday: faker.date.birthdate({
            min: 1980,
            max: 1995,
            mode: 'year',
          }),
          gender,
        },
      });
      await prisma.user.create({
        data: {
          email,
          password,
          role: [Roles.COACH],
          person_id: person.id,
        },
      });
      return prisma.coach.create({ data: { person_id: person.id } });
    };

    const coach1 = await createCoach(
      'coach1@test.com',
      'V20000001',
      'Carlos',
      'Mendoza',
      Gender.MALE,
    );
    const coach2 = await createCoach(
      'coach2@test.com',
      'V20000002',
      'Ana',
      'Rodriguez',
      Gender.FEMALE,
    );

    // ==========================================
    // GYMS
    // ==========================================
    const gym1 = await prisma.gym.create({
      data: {
        name: faker.company.name(),
        address: `${faker.location.city()}, Venezuela`,
        state: States.DISTRITO_CAPITAL,
        monthly_payment: faker.number.float({
          min: 15,
          max: 50,
          fractionDigits: 0,
        }),
        owner_id: coach1.id,
      },
    });

    const gym2 = await prisma.gym.create({
      data: {
        name: faker.company.name(),
        address: `${faker.location.city()}, Venezuela`,
        state: States.ARAGUA,
        monthly_payment: faker.number.float({
          min: 15,
          max: 50,
          fractionDigits: 0,
        }),
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
    const banks = [
      '0102 - Banco de Venezuela',
      '0105 - Mercantil',
      '0108 - Provincial',
    ];
    const gym1Phone = faker.phone
      .number({ style: 'national' })
      .replace(/\D/g, '')
      .slice(0, 11);
    const gym2Phone = faker.phone
      .number({ style: 'national' })
      .replace(/\D/g, '')
      .slice(0, 11);

    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym1.id,
        bank_to_pay: banks[0],
        dni: VENEZUELAN_DNI(),
        phone: gym1Phone,
      },
    });
    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym1.id,
        bank_to_pay: banks[1],
        dni: VENEZUELAN_DNI(),
        phone: gym1Phone,
      },
    });
    await prisma.pagoMovilFields.create({
      data: {
        gym_id: gym2.id,
        bank_to_pay: banks[2],
        dni: VENEZUELAN_DNI(),
        phone: gym2Phone,
      },
    });

    // ==========================================
    // ATHLETES
    // ==========================================
    logger.info({ context: 'SeedDev' }, '🥊 Creando Atletas de prueba...');
    const athletes: { id: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const gender = i % 2 === 0 ? Gender.MALE : Gender.FEMALE;
      const person = await prisma.person.create({
        data: {
          dni: VENEZUELAN_DNI(),
          name: faker.person.firstName(
            gender === Gender.MALE ? 'male' : 'female',
          ),
          surname: faker.person.lastName(),
          birthday: faker.date.birthdate({
            min: 1995,
            max: 2005,
            mode: 'year',
          }),
          gender,
        },
      });
      await prisma.user.create({
        data: {
          email: `athlete${i + 1}@test.com`,
          password,
          role: [Roles.ATHLETE],
          person_id: person.id,
        },
      });
      const athlete = await prisma.athlete.create({
        data: { person_id: person.id, gym_id: i < 3 ? gym1.id : gym2.id },
      });
      athletes.push(athlete);
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
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        inscription_begin_at: new Date(),
        inscription_end_at: faker.date.future({ years: 1 }),
        status: CompetitionStatus.OPEN,
      },
    });

    // ==========================================
    // DIVISIONS
    // ==========================================
    const createDivision = (mode: FightingMode, weight: number) =>
      prisma.competitionDivision.create({
        data: {
          competition_id: competition.id,
          mode,
          category: FightingCategory.S,
          gender: Gender.MALE,
          weight,
        },
      });

    const divisionPF69 = await createDivision(FightingMode.POINT_FIGHTING, 69);
    const divisionKL69 = await createDivision(FightingMode.KICK_LIGHT, 69);
    const divisionK171 = await createDivision(FightingMode.K1, 71);
    const divisionLK71 = await createDivision(FightingMode.LOW_KICK, 71);

    // ==========================================
    // REGISTRATIONS
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '📝 Registrando atletas en divisiones...',
    );
    const registrations = [
      { athlete_id: athletes[0].id, division_id: divisionPF69.id },
      { athlete_id: athletes[0].id, division_id: divisionKL69.id },
      { athlete_id: athletes[1].id, division_id: divisionPF69.id },
      { athlete_id: athletes[2].id, division_id: divisionKL69.id },
      { athlete_id: athletes[3].id, division_id: divisionK171.id },
      { athlete_id: athletes[4].id, division_id: divisionLK71.id },
    ];
    await prisma.competitionRegistration.createMany({ data: registrations });

    // ==========================================
    // PAYMENTS
    // ==========================================
    logger.info(
      { context: 'SeedDev' },
      '💰 Generando historial de pagos ficticios...',
    );
    await prisma.gymPayment.createMany({
      data: [
        {
          athlete_id: athletes[0].id,
          gym_id: gym1.id,
          amount: gym1.monthly_payment,
          payment_reference: `REF-${faker.string.numeric(4)}`,
          day_payed: faker.date.recent({ days: 30 }),
          isConfirmed: true,
        },
        {
          athlete_id: athletes[1].id,
          gym_id: gym1.id,
          amount: gym1.monthly_payment,
          payment_reference: `REF-${faker.string.numeric(4)}`,
          day_payed: faker.date.recent({ days: 15 }),
          isConfirmed: true,
        },
        {
          athlete_id: athletes[3].id,
          gym_id: gym2.id,
          amount: gym2.monthly_payment,
          payment_reference: `REF-${faker.string.numeric(4)}`,
          day_payed: faker.date.recent({ days: 5 }),
          isConfirmed: false,
        },
      ],
    });

    logger.info({ context: 'SeedDev' }, '✅ Seed dev completed successfully.');
  } catch (error) {
    logger.error(
      { context: 'SeedDev', error },
      '❌ Error crítico inesperado durante la ejecución de seedDev.',
    );
    throw error;
  }
}
