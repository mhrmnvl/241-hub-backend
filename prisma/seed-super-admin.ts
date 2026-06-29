/**
 * Seed Super Admin Only
 * Platform-level super admin — tidak terikat Organization manapun.
 * username: admin | password: admin
 */
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
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   Seed: Super Admin (Platform)       ║');
  console.log('╚══════════════════════════════════════╝\n');

  const username = 'admin';
  const password = 'admin';
  const passwordHash = await bcrypt.hash(password, 10);

  // Cek apakah super admin sudah ada
  const existing = await prisma.user.findFirst({
    where: {
      identifier: username,
      organizationId: { equals: null },
      deletedAt: null,
    },
  });

  let user;
  if (existing) {
    // Update password
    user = await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, isActive: true, deletedAt: null },
    });
    console.log(`  [user] updated: ${user.identifier} (${user.id})`);
  } else {
    // Buat super admin baru tanpa organization
    user = await prisma.user.create({
      data: {
        organizationId: null,
        schoolUnitId: null,
        identifier: username,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`  [user] created: ${user.identifier} (${user.id})`);
  }

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║  ✓ Super Admin seeded successfully   ║');
  console.log('║                                      ║');
  console.log('║  username : admin                    ║');
  console.log('║  password : admin                    ║');
  console.log('╚══════════════════════════════════════╝\n');
}

main()
  .catch((e) => {
    console.error('\n✗ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
