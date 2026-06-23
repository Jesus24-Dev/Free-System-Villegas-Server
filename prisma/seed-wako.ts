import 'dotenv/config';

import {
  PrismaClient,
  FightingMode,
  FightingCategory,
  Gender,
} from '@prisma/client';
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

export async function seedWako(prisma: PrismaClient) {
  logger.info(
    { context: 'SeedWakoWeights' },
    '🌱 Starting the seeding WAKO weights',
  );
  await prisma.fightingWeights.deleteMany();
  const wakoWeights = [
    // =========================================================
    // POINT FIGHTING
    // =========================================================

    // --- Children (CH) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.CH,
      gender: Gender.MALE,
      weights: [18, 21, 24, 27, 30, 33, 36, 39, 42, 47],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.CH,
      gender: Gender.FEMALE,
      weights: [18, 21, 24, 27, 30, 33, 36, 39, 42, 47],
    },

    // --- Younger Cadets (YC) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.YC,
      gender: Gender.MALE,
      weights: [24, 27, 30, 33, 36, 39, 42, 47, 52],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.YC,
      gender: Gender.FEMALE,
      weights: [24, 27, 30, 33, 36, 39, 42, 47, 52],
    },

    // --- Older Cadets (OC) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    // --- Juniors (J) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    // --- Seniors (S) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },

    // --- Masters (M) ---
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.POINT_FIGHTING,
      category: FightingCategory.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // LIGHT CONTACT
    // =========================================================

    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },
    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.LIGHT_CONTACT,
      category: FightingCategory.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // KICK LIGHT
    // =========================================================

    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },
    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: FightingMode.KICK_LIGHT,
      category: FightingCategory.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // FULL CONTACT / LOW KICK / K1
    // =========================================================

    // --- Seniors ---
    {
      mode: FightingMode.FULL_CONTACT,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.FULL_CONTACT,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: FightingMode.LOW_KICK,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.LOW_KICK,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: FightingMode.K1,
      category: FightingCategory.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.K1,
      category: FightingCategory.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    // --- Juniors ---
    {
      mode: FightingMode.FULL_CONTACT,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.FULL_CONTACT,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: FightingMode.LOW_KICK,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.LOW_KICK,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: FightingMode.K1,
      category: FightingCategory.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: FightingMode.K1,
      category: FightingCategory.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },
  ];

  const rows = wakoWeights.flatMap((group) =>
    group.weights.map((weight) => ({
      mode: group.mode,
      category: group.category,
      gender: group.gender,
      weight: -weight,
    })),
  );

  await prisma.fightingWeights.createMany({
    data: rows,
  });

  logger.info(
    { context: 'SeedWakoWeights' },
    '✅ Official WAKO weights charged succesfully!',
  );
  await prisma.$disconnect();
}
