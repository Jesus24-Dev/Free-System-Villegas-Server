import 'dotenv/config';

import {
  PrismaClient,
  Fighting_Mode,
  Fighting_Category,
  Gender,
} from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting the seeding WAKO weights');
  await prisma.fighting_Weights.deleteMany();
  const wakoWeights = [
    // =========================================================
    // POINT FIGHTING
    // =========================================================

    // --- Children (CH) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.CH,
      gender: Gender.MALE,
      weights: [18, 21, 24, 27, 30, 33, 36, 39, 42, 47],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.CH,
      gender: Gender.FEMALE,
      weights: [18, 21, 24, 27, 30, 33, 36, 39, 42, 47],
    },

    // --- Younger Cadets (YC) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.YC,
      gender: Gender.MALE,
      weights: [24, 27, 30, 33, 36, 39, 42, 47, 52],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.YC,
      gender: Gender.FEMALE,
      weights: [24, 27, 30, 33, 36, 39, 42, 47, 52],
    },

    // --- Older Cadets (OC) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    // --- Juniors (J) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    // --- Seniors (S) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },

    // --- Masters (M) ---
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.POINT_FIGHTING,
      category: Fighting_Category.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // LIGHT CONTACT
    // =========================================================

    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },
    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.LIGHT_CONTACT,
      category: Fighting_Category.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // KICK LIGHT
    // =========================================================

    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.OC,
      gender: Gender.MALE,
      weights: [32, 37, 42, 47, 52, 57, 63, 69],
    },
    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.OC,
      gender: Gender.FEMALE,
      weights: [32, 37, 42, 46, 50, 55, 60],
    },

    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [42, 47, 52, 57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [42, 46, 50, 55, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [57, 63, 69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [50, 55, 60, 65, 70],
    },
    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.M,
      gender: Gender.MALE,
      weights: [69, 74, 79, 84, 89, 94],
    },
    {
      mode: Fighting_Mode.KICK_LIGHT,
      category: Fighting_Category.M,
      gender: Gender.FEMALE,
      weights: [55, 60, 65, 70],
    },

    // =========================================================
    // FULL CONTACT / LOW KICK / K1
    // =========================================================

    // --- Seniors ---
    {
      mode: Fighting_Mode.FULL_CONTACT,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.FULL_CONTACT,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.LOW_KICK,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.LOW_KICK,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.K1,
      category: Fighting_Category.S,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.K1,
      category: Fighting_Category.S,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    // --- Juniors ---
    {
      mode: Fighting_Mode.FULL_CONTACT,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.FULL_CONTACT,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.LOW_KICK,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.LOW_KICK,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },

    {
      mode: Fighting_Mode.K1,
      category: Fighting_Category.J,
      gender: Gender.MALE,
      weights: [51, 54, 57, 60, 63.5, 67, 71, 75, 81, 86, 91],
    },
    {
      mode: Fighting_Mode.K1,
      category: Fighting_Category.J,
      gender: Gender.FEMALE,
      weights: [48, 52, 56, 60, 65, 70],
    },
  ];

  await prisma.fighting_Weights.createMany({
    data: wakoWeights,
  });

  console.log('✅ Official WAKO weights charged succesfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
