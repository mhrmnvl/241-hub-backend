import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is required for seeding');
}
const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('╔══════════════════════════════════╗');
  console.log('║   SIAKAD Admin-Only Seeder       ║');
  console.log('╚══════════════════════════════════╝\n');

  const org = await prisma.organization.findFirst({
    where: { deletedAt: null },
  });
  if (!org) {
    throw new Error('No organization found. Please run the main seeder first!');
  }

  const unit = await prisma.schoolUnit.findFirst({
    where: { organizationId: org.id, deletedAt: null },
  });
  if (!unit) {
    throw new Error('No school unit found. Please run the main seeder first!');
  }

  const username = 'admin';
  const password = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: {
      schoolUnitId_identifier: {
        schoolUnitId: unit.id,
        identifier: username,
      },
    },
    update: {
      passwordHash: password,
      isActive: true,
      deletedAt: null,
    },
    create: {
      organizationId: org.id,
      schoolUnitId: unit.id,
      identifier: username,
      passwordHash: password,
      isActive: true,
    },
  });

  console.log(`  [admin] created: ${user.identifier} (${user.id})`);

  console.log('\n╔══════════════════════════════════╗');
  console.log('║  ✓ Admin seed completed          ║');
  console.log('╚══════════════════════════════════╝\n');
}

main()
  .catch((e) => {
    console.error('\n✗ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
