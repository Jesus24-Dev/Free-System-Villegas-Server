import { seedWako } from './seed-wako';

async function main() {
  console.log('🌱 Starting seeds');

  await seedWako();

  if (process.env.SEED_DEV === 'true') {
    const { seedDev } = await import('./seed-dev.js');

    await seedDev();
  }

  console.log('✅ Seed completed');
}

main();
